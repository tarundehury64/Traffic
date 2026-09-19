from fastapi import APIRouter
from backend.app.ml.models import model_manager

router = APIRouter(prefix="/model", tags=["Model Architecture & Performance"])

@router.get("/performance")
def get_model_performance():
    """
    Returns pipeline architecture stages, comparative model metrics (MAE, RMSE, R²),
    and active model evaluation criteria.
    """
    if not model_manager.is_trained:
        model_manager.initialize()

    pipeline_stages = [
        {
            "step": 1,
            "title": "Raw Traffic Data",
            "description": "48,204 hourly records collected by MN DOT Station ATR 301 on westbound I-94 from 2012 to 2018."
        },
        {
            "step": 2,
            "title": "Data Cleaning",
            "description": "Handling missing holidays, imputing 0 Kelvin sensor failures with median, capping rainfall spikes, validating timestamps."
        },
        {
            "step": 3,
            "title": "Feature Engineering",
            "description": "Extracting temporal features (hour, day, month, weekend, holiday), cyclical encodings (sin/cos of hour and weekday), and weather metrics."
        },
        {
            "step": 4,
            "title": "Train/Test Split",
            "description": "Chronological 80/20 train/test partition (38,563 training records vs 9,641 testing records)."
        },
        {
            "step": 5,
            "title": "Model Training",
            "description": "Fitting Linear Regression, Ridge Regression, Random Forest Regressor, and Gradient Boosting Regressor."
        },
        {
            "step": 6,
            "title": "Evaluation",
            "description": "Programmatic computation of MAE, RMSE, R² Score, and residual standard error on the held-out test split."
        },
        {
            "step": 7,
            "title": "Traffic Prediction",
            "description": "Real-time inference with 95% prediction interval (uncertainty margin) and traffic level categorization."
        }
    ]

    return {
        "pipeline_stages": pipeline_stages,
        "comparison": model_manager.metrics.get("comparison", []),
        "selected_model": model_manager.best_model_name,
        "evaluation_criterion": "Lowest Root Mean Squared Error (RMSE) on independent test split",
        "residual_std_error": round(model_manager.residual_std_error, 2),
        "data_badge": "PREDICTION"
    }

@router.get("/features")
def get_feature_importance():
    """
    Returns feature importance rankings generated directly from the trained tree model.
    """
    if not model_manager.is_trained:
        model_manager.initialize()

    return {
        "feature_importances": model_manager.feature_importances,
        "model_used": "Random Forest Regressor (Ensemble Gini/Variance Reduction)",
        "explanation": "Feature importance indicates how strongly each input contributed to the model's predictions. It does not establish causation.",
        "data_badge": "PREDICTION"
    }
