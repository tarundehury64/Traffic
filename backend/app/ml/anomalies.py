import pandas as pd
import numpy as np
from typing import List, Dict, Any
from backend.app.ml.models import model_manager

def detect_traffic_anomalies(max_records: int = 15) -> List[Dict[str, Any]]:
    """
    Identifies historical traffic records where observed vehicle flow significantly
    diverges from the typical historical range (e.g. > 2.2 standard deviations or extreme drop/surge).
    Labeled strictly as 'Unusual traffic pattern detected'.
    """
    if not model_manager.is_trained:
        model_manager.initialize()

    df = model_manager.df_clean
    
    # Calculate difference from baseline
    df["flow_diff"] = df["traffic_volume"] - df["baseline_flow"]
    df["z_score"] = np.where(
        df["baseline_std"] > 0,
        (df["traffic_volume"] - df["baseline_flow"]) / df["baseline_std"],
        0.0
    )
    
    # Filter for significant anomalies (|z| > 2.4 and meaningful volume difference)
    anomalous_df = df[
        (df["z_score"].abs() > 2.4) & 
        (df["traffic_volume"] > 0) &
        (df["baseline_flow"] > 1000)
    ].copy()
    
    # Sort by absolute z-score
    anomalous_df["abs_z"] = anomalous_df["z_score"].abs()
    top_anomalies = anomalous_df.sort_values(by="abs_z", ascending=False).head(max_records)
    
    results = []
    for _, row in top_anomalies.iterrows():
        normal_min = max(0, int(round(row["baseline_flow"] - 1.96 * row["baseline_std"])))
        normal_max = int(round(row["baseline_flow"] + 1.96 * row["baseline_std"]))
        observed = int(row["traffic_volume"])
        
        direction = "Deficit (Sudden Drop)" if observed < normal_min else "Surge (Severe Spike)"
        deviation_pct = round(((observed - row["baseline_flow"]) / max(1.0, row["baseline_flow"])) * 100, 1)
        
        results.append({
            "id": f"anomaly-{int(row['date_time'].timestamp())}",
            "location": "I-94 Westbound (ATR Station 301)",
            "timestamp": row["date_time"].strftime("%Y-%m-%d %H:%M"),
            "date": row["date_time"].strftime("%Y-%m-%d"),
            "time": row["date_time"].strftime("%H:%M"),
            "day_name": row["day_name"],
            "observed_flow": observed,
            "normal_range_min": normal_min,
            "normal_range_max": normal_max,
            "expected_baseline": int(round(row["baseline_flow"])),
            "deviation_percentage": deviation_pct,
            "anomaly_type": direction,
            "weather_condition": row["weather_main"],
            "temperature_celsius": row["temp_celsius"],
            "holiday": row["holiday"] if row["holiday"] != "None" else None,
            "classification_notice": "Unusual traffic pattern detected (statistical anomaly based on historical baseline). Cause undetermined; abnormal traffic alone does not prove an accident."
        })
        
    return results
