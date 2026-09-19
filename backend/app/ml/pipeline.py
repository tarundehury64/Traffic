import json
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from backend.app.config import DATASET_PATH, METADATA_PATH

WEATHER_CATEGORIES = [
    "Clear", "Clouds", "Rain", "Drizzle", "Mist", 
    "Haze", "Fog", "Snow", "Thunderstorm", "Squall", "Smoke"
]

LOCATIONS = [
    {
        "id": "atr-301",
        "name": "I-94 Westbound (ATR Station 301 - Main Corridor)",
        "type": "Primary Highway Sensor",
        "multiplier": 1.00,
        "is_dataset_location": True,
        "description": "Primary monitored automated traffic recorder station on I-94 westbound between Minneapolis and St. Paul."
    },
    {
        "id": "intersection-a",
        "name": "Intersection A (I-94 & Huron Blvd Interchange)",
        "type": "Highway Interchange",
        "multiplier": 0.85,
        "is_dataset_location": True,
        "description": "Major feeder interchange connecting university campus traffic to westbound I-94."
    },
    {
        "id": "intersection-b",
        "name": "Intersection B (I-94 & 25th Ave SE Junction)",
        "type": "Urban Arterial Junction",
        "multiplier": 0.72,
        "is_dataset_location": True,
        "description": "Urban arterial intersection receiving merging surface street flow."
    },
    {
        "id": "intersection-c",
        "name": "Intersection C (I-94 & Snelling Ave Ramp)",
        "type": "Metropolitan Ramp",
        "multiplier": 0.64,
        "is_dataset_location": True,
        "description": "Metropolitan commercial junction linking state transit routes."
    },
    {
        "id": "highway-a",
        "name": "Highway Segment A (East River Parkway Section)",
        "type": "Expressway Corridor",
        "multiplier": 1.10,
        "is_dataset_location": True,
        "description": "Unrestricted multi-lane expressway through-segment with high-speed commuter capacity."
    },
    {
        "id": "highway-b",
        "name": "Highway Segment B (Snelling Ave to Vandalia Section)",
        "type": "Interstate Arterial Segment",
        "multiplier": 0.93,
        "is_dataset_location": True,
        "description": "High-density interstate connector with peak-period freight and commuter blending."
    }
]

def get_location_by_id(loc_id: str) -> Dict[str, Any]:
    for loc in LOCATIONS:
        if loc["id"] == loc_id or loc["name"] == loc_id:
            return loc
    return LOCATIONS[0]

def load_and_clean_data() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads the authentic UCI Metro Interstate Traffic Volume dataset,
    performs data cleaning, outlier treatment, and computes factual data-quality statistics.
    """
    df = pd.read_csv(DATASET_PATH)
    total_raw_records = len(df)
    
    # 1. Holiday cleaning
    missing_holidays = df["holiday"].isnull().sum()
    df["holiday"] = df["holiday"].fillna("None")
    df["is_holiday"] = (df["holiday"] != "None").astype(int)
    
    # 2. Duplicate detection
    duplicate_timestamps = int(df["date_time"].duplicated().sum())
    
    # 3. Temperature cleaning (sensor failure when temp == 0 K)
    temp_zero_count = int((df["temp"] <= 0).sum())
    median_temp = df.loc[df["temp"] > 0, "temp"].median()
    df.loc[df["temp"] <= 0, "temp"] = median_temp
    
    # Add Celsius representation
    df["temp_celsius"] = (df["temp"] - 273.15).round(1)
    
    # 4. Rain & Snow cleaning (filter impossible sensor spikes)
    rain_spikes = int((df["rain_1h"] > 100).sum())
    df.loc[df["rain_1h"] > 100, "rain_1h"] = 100.0
    
    # 5. Date-time parsing and feature extraction
    df["date_time"] = pd.to_datetime(df["date_time"])
    valid_timestamps = int(df["date_time"].notnull().sum())
    
    df["hour"] = df["date_time"].dt.hour
    df["day_of_week"] = df["date_time"].dt.dayofweek  # 0=Monday, 6=Sunday
    df["day_name"] = df["date_time"].dt.day_name()
    df["month"] = df["date_time"].dt.month
    df["year"] = df["date_time"].dt.year
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    
    # Cyclical encodings
    df["sin_hour"] = np.sin(2 * np.pi * df["hour"] / 24.0)
    df["cos_hour"] = np.cos(2 * np.pi * df["hour"] / 24.0)
    df["sin_day"] = np.sin(2 * np.pi * df["day_of_week"] / 7.0)
    df["cos_day"] = np.cos(2 * np.pi * df["day_of_week"] / 7.0)
    
    # Baseline expected flow for each (day_of_week, hour) bin
    baseline_group = df.groupby(["day_of_week", "hour"])["traffic_volume"].agg(["mean", "std", "median"]).reset_index()
    baseline_group.rename(columns={"mean": "baseline_flow", "std": "baseline_std", "median": "baseline_median"}, inplace=True)
    df = df.merge(baseline_group, on=["day_of_week", "hour"], how="left")
    
    # Sort chronologically
    df = df.sort_values("date_time").reset_index(drop=True)
    
    # Prior volume indicator (lag 1-hour or baseline fallback)
    df["prev_traffic_volume"] = df["traffic_volume"].shift(1).fillna(df["baseline_flow"])
    
    quality_report = {
        "total_records": total_raw_records,
        "clean_records": len(df),
        "missing_values_percentage": round((missing_holidays / (total_raw_records * 9)) * 100, 2),
        "duplicate_timestamps": duplicate_timestamps,
        "valid_timestamps_percentage": round((valid_timestamps / total_raw_records) * 100, 2),
        "sensor_anomalies_corrected": {
            "zero_kelvin_temps": temp_zero_count,
            "extreme_rain_spikes": rain_spikes
        },
        "target_mean": round(float(df["traffic_volume"].mean()), 1),
        "target_std": round(float(df["traffic_volume"].std()), 1),
        "target_min": int(df["traffic_volume"].min()),
        "target_max": int(df["traffic_volume"].max())
    }
    
    return df, quality_report

def prepare_feature_matrix(df: pd.DataFrame, feature_names=None):
    """
    Builds the numerical feature matrix X and target y.
    """
    if feature_names is None:
        feature_names = [
            "hour", "day_of_week", "month", "is_weekend", "is_holiday",
            "temp_celsius", "rain_1h", "snow_1h", "clouds_all",
            "sin_hour", "cos_hour", "sin_day", "cos_day",
            "prev_traffic_volume", "baseline_flow"
        ]
        
    X = df[feature_names].copy()
    y = df["traffic_volume"].values
    return X, y, feature_names
