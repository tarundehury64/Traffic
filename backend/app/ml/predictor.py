import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Any, List
from backend.app.ml.pipeline import get_location_by_id, LOCATIONS
from backend.app.ml.models import model_manager

def classify_traffic_level(volume: float) -> Dict[str, str]:
    if volume < 1500:
        return {"level": "LOW", "description": "Free-flowing traffic with minimal delay"}
    elif volume < 3500:
        return {"level": "MODERATE", "description": "Steady vehicle flow with minor localized slowdowns"}
    elif volume < 5200:
        return {"level": "HEAVY", "description": "High volume with congestion approaching roadway saturation"}
    else:
        return {"level": "SEVERE", "description": "Severe bumper-to-bumper queueing and significant delay"}

def predict_traffic_flow(
    location_id: str,
    date_str: str,
    time_str: str,
    temp_celsius: float = 15.0,
    rain_1h: float = 0.0,
    snow_1h: float = 0.0,
    clouds_all: int = 40,
    weather_main: str = "Clouds",
    horizon: str = "Next 1 hour"
) -> Dict[str, Any]:
    """
    Generates ML-driven vehicle flow prediction with uncertainty bounds
    and historical vs predicted timeline for visualization.
    """
    if not model_manager.is_trained:
        model_manager.initialize()

    location = get_location_by_id(location_id)
    loc_multiplier = location.get("multiplier", 1.0)
    
    # Parse date and time
    try:
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        # Fallback for seconds or alternative formats
        try:
            dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        except Exception:
            dt = datetime.now()

    hour = dt.hour
    day_of_week = dt.weekday() # 0 = Monday
    day_name = dt.strftime("%A")
    month = dt.month
    is_weekend = 1 if day_of_week >= 5 else 0
    is_holiday = 0  # Default assumption for standard weekdays
    
    # Cyclical encodings
    sin_hour = math.sin(2 * math.pi * hour / 24.0)
    cos_hour = math.cos(2 * math.pi * hour / 24.0)
    sin_day = math.sin(2 * math.pi * day_of_week / 7.0)
    cos_day = math.cos(2 * math.pi * day_of_week / 7.0)
    
    # Get historical baseline from dataset
    df = model_manager.df_clean
    subset = df[(df["day_of_week"] == day_of_week) & (df["hour"] == hour)]
    if len(subset) > 0:
        baseline_flow = float(subset["traffic_volume"].mean())
        baseline_std = float(subset["traffic_volume"].std())
    else:
        baseline_flow = float(df["traffic_volume"].mean())
        baseline_std = float(df["traffic_volume"].std())
        
    prev_traffic_volume = baseline_flow
    
    # Feature vector matching trained model order
    features = {
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month,
        "is_weekend": is_weekend,
        "is_holiday": is_holiday,
        "temp_celsius": temp_celsius,
        "rain_1h": rain_1h,
        "snow_1h": snow_1h,
        "clouds_all": clouds_all,
        "sin_hour": sin_hour,
        "cos_hour": cos_hour,
        "sin_day": sin_day,
        "cos_day": cos_day,
        "prev_traffic_volume": prev_traffic_volume,
        "baseline_flow": baseline_flow
    }
    
    X_input = pd.DataFrame([features])[model_manager.feature_names]
    
    # Inference with best model
    model = model_manager.models.get(model_manager.best_model_name)
    base_pred = float(model.predict(X_input)[0])
    
    # Horizon adjustments (traffic transitions)
    horizon_factor = 1.0
    if horizon == "Next 15 minutes":
        horizon_factor = 1.0
    elif horizon == "Next 30 minutes":
        horizon_factor = 1.01
    elif horizon == "Next 1 hour":
        horizon_factor = 1.03
    elif horizon == "Next 3 hours":
        # Slight trend towards subsequent hours
        next_hour = (hour + 2) % 24
        next_baseline = float(df[(df["day_of_week"] == day_of_week) & (df["hour"] == next_hour)]["traffic_volume"].mean())
        horizon_factor = next_baseline / max(1.0, baseline_flow)

    predicted_flow = round(max(50.0, base_pred * loc_multiplier * horizon_factor))
    baseline_flow_loc = round(baseline_flow * loc_multiplier)
    
    # Calculate 95% prediction uncertainty interval: ± 1.96 * residual_std_error
    uncertainty_margin = round(1.96 * (model_manager.residual_std_error * loc_multiplier))
    lower_bound = max(0, predicted_flow - uncertainty_margin)
    upper_bound = predicted_flow + uncertainty_margin
    
    level_info = classify_traffic_level(predicted_flow)
    
    # Build 12-hour timeline for Historical vs Predicted Visualization
    timeline: List[Dict[str, Any]] = []
    start_dt = dt - timedelta(hours=5)
    
    for i in range(12):
        step_dt = start_dt + timedelta(hours=i)
        step_hour = step_dt.hour
        step_dow = step_dt.weekday()
        
        # Historical average for that step
        step_sub = df[(df["day_of_week"] == step_dow) & (df["hour"] == step_hour)]
        step_hist = float(step_sub["traffic_volume"].mean()) if len(step_sub) > 0 else 3000.0
        step_hist_loc = round(step_hist * loc_multiplier)
        
        # Step prediction
        step_feat = features.copy()
        step_feat["hour"] = step_hour
        step_feat["day_of_week"] = step_dow
        step_feat["sin_hour"] = math.sin(2 * math.pi * step_hour / 24.0)
        step_feat["cos_hour"] = math.cos(2 * math.pi * step_hour / 24.0)
        step_feat["sin_day"] = math.sin(2 * math.pi * step_dow / 7.0)
        step_feat["cos_day"] = math.cos(2 * math.pi * step_dow / 7.0)
        step_feat["baseline_flow"] = step_hist
        step_feat["prev_traffic_volume"] = step_hist
        
        X_step = pd.DataFrame([step_feat])[model_manager.feature_names]
        step_pred = round(max(50.0, float(model.predict(X_step)[0]) * loc_multiplier))
        
        timeline.append({
            "timestamp": step_dt.strftime("%Y-%m-%d %H:%M"),
            "time_label": step_dt.strftime("%H:%M"),
            "historical_vehicles": step_hist_loc,
            "predicted_vehicles": step_pred,
            "uncertainty_lower": max(0, step_pred - uncertainty_margin),
            "uncertainty_upper": step_pred + uncertainty_margin,
            "is_target_time": (step_hour == hour)
        })

    return {
        "location": location["name"],
        "location_id": location["id"],
        "location_type": location["type"],
        "is_dataset_location": location["is_dataset_location"],
        "timestamp": dt.isoformat(),
        "date": date_str,
        "time": time_str,
        "day_of_week": day_name,
        "predicted_vehicle_flow": int(predicted_flow),
        "historical_baseline_flow": int(baseline_flow_loc),
        "difference_from_baseline": int(predicted_flow - baseline_flow_loc),
        "unit": "vehicles/hour",
        "traffic_level": level_info["level"],
        "traffic_level_desc": level_info["description"],
        "confidence_interval": {
            "confidence_level": "95% Prediction Interval",
            "margin_error": int(uncertainty_margin),
            "lower_bound": int(lower_bound),
            "upper_bound": int(upper_bound),
            "basis": f"Calculated from model residual standard error (s_e = {round(model_manager.residual_std_error, 1)} vehicles/hr) evaluated on test set."
        },
        "model_used": model_manager.best_model_name,
        "data_badge": "PREDICTION",
        "transparency_notice": "Prediction based on historical/training traffic data from UCI Metro Interstate Volume dataset. ML-generated estimate, not live feed.",
        "timeline": timeline
    }
