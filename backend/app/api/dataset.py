import json
from fastapi import APIRouter, Query
from typing import Optional
from backend.app.config import METADATA_PATH
from backend.app.ml.models import model_manager

router = APIRouter(prefix="/dataset", tags=["Dataset & Quality Validation"])

@router.get("/info")
def get_dataset_info():
    """
    Returns complete dataset provenance metadata, attribution, and data quality validation report.
    """
    if not model_manager.is_trained:
        model_manager.initialize()

    with open(METADATA_PATH, "r") as f:
        meta = json.load(f)

    return {
        "metadata": meta,
        "quality_report": model_manager.quality_report,
        "data_badge": "DATASET"
    }

@router.get("/records")
def get_dataset_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=100),
    search: Optional[str] = Query(None, description="Search by date or weather condition"),
    weather: Optional[str] = Query(None, description="Filter by weather main category"),
    sort_by: str = Query("date_time", description="Column to sort by"),
    sort_order: str = Query("desc", description="asc or desc")
):
    """
    Returns paginated, searchable, filterable, and sortable raw dataset records.
    """
    if not model_manager.is_trained:
        model_manager.initialize()

    df = model_manager.df_clean.copy()

    # Search filter
    if search:
        s = search.strip().lower()
        df = df[
            df["date_time"].astype(str).str.lower().str.contains(s) |
            df["weather_main"].str.lower().str.contains(s) |
            df["day_name"].str.lower().str.contains(s)
        ]

    # Category filter
    if weather and weather != "All":
        df = df[df["weather_main"].str.lower() == weather.lower()]

    # Sorting
    ascending = (sort_order.lower() == "asc")
    if sort_by in df.columns:
        df = df.sort_values(by=sort_by, ascending=ascending)
    else:
        df = df.sort_values(by="date_time", ascending=ascending)

    total_matching = len(df)
    total_pages = max(1, (total_matching + page_size - 1) // page_size)
    
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged_df = df.iloc[start_idx:end_idx]

    records = []
    for _, row in paged_df.iterrows():
        records.append({
            "timestamp": row["date_time"].strftime("%Y-%m-%d %H:%M:%S"),
            "location": "I-94 Westbound (ATR 301)",
            "vehicle_count": int(row["traffic_volume"]),
            "day_name": row["day_name"],
            "hour": int(row["hour"]),
            "temp_celsius": float(row["temp_celsius"]),
            "rain_1h": float(row["rain_1h"]),
            "snow_1h": float(row["snow_1h"]),
            "clouds_percentage": int(row["clouds_all"]),
            "weather_main": row["weather_main"],
            "is_holiday": bool(row["is_holiday"])
        })

    return {
        "page": page,
        "page_size": page_size,
        "total_records": total_matching,
        "total_pages": total_pages,
        "records": records,
        "data_badge": "DATASET"
    }
