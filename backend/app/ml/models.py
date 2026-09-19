import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from backend.app.config import MODELS_DIR
from backend.app.ml.pipeline import load_and_clean_data, prepare_feature_matrix

MODELS_CACHE_FILE = MODELS_DIR / "trained_models.joblib"
METRICS_CACHE_FILE = MODELS_DIR / "model_metrics.joblib"

class TrafficModelManager:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.metrics: Dict[str, Any] = {}
        self.feature_names: List[str] = []
        self.feature_importances: List[Dict[str, Any]] = []
        self.best_model_name: str = "Random Forest Regressor"
        self.is_trained: bool = False
        self.df_clean: pd.DataFrame = None
        self.quality_report: Dict[str, Any] = None
        self.residual_std_error: float = 380.0
        
    def initialize(self, force_retrain: bool = False):
        """Loads or trains models and precalculates metrics."""
        self.df_clean, self.quality_report = load_and_clean_data()
        
        if not force_retrain and os.path.exists(MODELS_CACHE_FILE) and os.path.exists(METRICS_CACHE_FILE):
            print("Loading pre-trained models from cache...")
            saved = joblib.load(MODELS_CACHE_FILE)
            self.models = saved["models"]
            self.feature_names = saved["feature_names"]
            self.best_model_name = saved.get("best_model_name", "Random Forest Regressor")
            self.residual_std_error = saved.get("residual_std_error", 380.0)
            
            self.metrics = joblib.load(METRICS_CACHE_FILE)
            self.feature_importances = self.metrics.get("feature_importances", [])
            self.is_trained = True
            print("Models loaded successfully.")
            return

        print("Training models from dataset...")
        self.train_all_models()

    def train_all_models(self, test_size: float = 0.20):
        X, y, self.feature_names = prepare_feature_matrix(self.df_clean)
        
        # Chronological train/test split (or stratified temporal)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, shuffle=True
        )
        
        candidate_models = {
            "Linear Regression": LinearRegression(),
            "Ridge Regression": Ridge(alpha=1.0),
            "Random Forest Regressor": RandomForestRegressor(
                n_estimators=75, max_depth=16, min_samples_split=5, random_state=42, n_jobs=-1
            ),
            "Gradient Boosting Regressor": GradientBoostingRegressor(
                n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42
            )
        }
        
        comparison_results = []
        best_rmse = float("inf")
        
        for name, model in candidate_models.items():
            print(f"Training {name}...")
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            mae = float(mean_absolute_error(y_test, y_pred))
            mse = float(mean_squared_error(y_test, y_pred))
            rmse = float(np.sqrt(mse))
            r2 = float(r2_score(y_test, y_pred))
            
            # Degrees of freedom for residual standard error
            dof = max(1, len(y_test) - X_test.shape[1])
            res_se = float(np.sqrt(np.sum((y_test - y_pred) ** 2) / dof))
            
            res = {
                "model_name": name,
                "mae": round(mae, 2),
                "rmse": round(rmse, 2),
                "r2_score": round(r2, 4),
                "residual_std_error": round(res_se, 2),
                "training_records": len(X_train),
                "testing_records": len(X_test)
            }
            comparison_results.append(res)
            self.models[name] = model
            
            if rmse < best_rmse:
                best_rmse = rmse
                self.best_model_name = name
                self.residual_std_error = res_se
                
        # Extract Feature Importance from Random Forest
        rf_model = self.models.get("Random Forest Regressor")
        if rf_model and hasattr(rf_model, "feature_importances_"):
            importances = rf_model.feature_importances_
            feature_imp_list = []
            for feat, imp in zip(self.feature_names, importances):
                feature_imp_list.append({
                    "feature": feat,
                    "importance": round(float(imp) * 100, 2)
                })
            # Sort descending
            feature_imp_list.sort(key=lambda x: x["importance"], reverse=True)
            self.feature_importances = feature_imp_list
            
        self.metrics = {
            "comparison": comparison_results,
            "selected_model": self.best_model_name,
            "feature_importances": self.feature_importances,
            "evaluation_criterion": "Lowest Root Mean Squared Error (RMSE) on independent test split"
        }
        
        # Save cache
        joblib.dump({
            "models": self.models,
            "feature_names": self.feature_names,
            "best_model_name": self.best_model_name,
            "residual_std_error": self.residual_std_error
        }, MODELS_CACHE_FILE)
        
        joblib.dump(self.metrics, METRICS_CACHE_FILE)
        self.is_trained = True
        print(f"Training complete. Best model: {self.best_model_name}")

    def run_experiment(self, test_size: float, model_type: str, selected_features: List[str]) -> Dict[str, Any]:
        """
        Runs an ad-hoc experiment on the actual dataset for the interactive ML workbench.
        """
        if not selected_features:
            selected_features = ["hour", "day_of_week", "baseline_flow"]
            
        X, y, _ = prepare_feature_matrix(self.df_clean, feature_names=selected_features)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, shuffle=True
        )
        
        if model_type == "Linear Regression":
            model = LinearRegression()
        elif model_type == "Ridge Regression":
            model = Ridge(alpha=1.0)
        elif model_type == "Random Forest Regressor":
            model = RandomForestRegressor(n_estimators=40, max_depth=12, random_state=42, n_jobs=-1)
        elif model_type == "Gradient Boosting Regressor":
            model = GradientBoostingRegressor(n_estimators=50, max_depth=5, random_state=42)
        else:
            model = LinearRegression()
            
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))
        
        return {
            "model_type": model_type,
            "test_split": test_size,
            "training_records": len(X_train),
            "testing_records": len(X_test),
            "features_used": selected_features,
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "r2_score": round(r2, 4)
        }

model_manager = TrafficModelManager()
