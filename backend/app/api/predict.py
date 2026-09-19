from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from backend.app.ml.predictor import predict_traffic_flow
from backend.app.ml.pipeline import LOCATIONS

router = APIRouter(prefix="", tags=["Prediction Engine"])

class PredictionRequest(BaseModel):
    location: str = Field(default="atr-301", description="Location identifier or corridor name")
    date: str = Field(default="2026-09-20", description="Date in YYYY-MM-DD format")
    time: str = Field(default="18:00", description="Time in HH:MM format")
    temp_celsius: float = Field(default=18.0, description="Ambient temperature in Celsius")
    rain_1h: float = Field(default=0.0, ge=0.0, le=100.0, description="Rainfall in mm within past hour")
    snow_1h: float = Field(default=0.0, ge=0.0, le=100.0, description="Snowfall in mm within past hour")
    clouds_all: int = Field(default=20, ge=0, le=100, description="Cloud cover percentage (0-100%)")
    weather_main: str = Field(default="Clear", description="Weather condition category")
    horizon: str = Field(default="Next 1 hour", description="Forecast horizon (Next 15 minutes, Next 30 minutes, Next 1 hour, Next 3 hours)")

@router.post("/predict")
def predict_traffic(req: PredictionRequest):
    """
    Generates an ML vehicle flow prediction based on historical patterns,
    with uncertainty bounds and comparison timeline.
    """
    try:
        result = predict_traffic_flow(
            location_id=req.location,
            date_str=req.date,
            time_str=req.time,
            temp_celsius=req.temp_celsius,
            rain_1h=req.rain_1h,
            snow_1h=req.snow_1h,
            clouds_all=req.clouds_all,
            weather_main=req.weather_main,
            horizon=req.horizon
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )
