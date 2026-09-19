from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from backend.app.ml.models import model_manager

router = APIRouter(prefix="/experiment", tags=["Academic ML Workbench"])

class ExperimentRequest(BaseModel):
    test_split: float = Field(default=0.20, ge=0.10, le=0.40, description="Test split fraction e.g. 0.20 for 80/20")
    model_type: str = Field(default="Random Forest Regressor", description="Model algorithm to train")
    selected_features: List[str] = Field(
        default=["hour", "day_of_week", "temp_celsius", "rain_1h", "baseline_flow", "prev_traffic_volume"],
        description="Feature subset to include"
    )

@router.post("/run")
def run_ml_experiment(req: ExperimentRequest):
    """
    Executes a dynamic training & evaluation experiment on the authentic dataset
    and returns programmatically computed evaluation metrics.
    """
    try:
        results = model_manager.run_experiment(
            test_size=req.test_split,
            model_type=req.model_type,
            selected_features=req.selected_features
        )
        results["data_badge"] = "PREDICTION"
        results["notice"] = "Programmatically evaluated on independent test partition using scikit-learn metrics."
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Experiment execution error: {str(e)}"
        )
