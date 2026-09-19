import sys
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.app.ml.models import model_manager

def main():
    print("=" * 60)
    print("TrafficFlow AI - Model Training & Evaluation Pipeline")
    print("Dataset: UCI Metro Interstate Traffic Volume (48,204 rows)")
    print("=" * 60)
    
    model_manager.initialize(force_retrain=True)
    
    print("\n--- Model Evaluation Results ---")
    for res in model_manager.metrics["comparison"]:
        print(f"Model: {res['model_name']:<30} | MAE: {res['mae']:<8} | RMSE: {res['rmse']:<8} | R²: {res['r2_score']:<8}")
        
    print(f"\nSelected Best Model: {model_manager.best_model_name}")
    print(f"Residual Standard Error: {model_manager.residual_std_error:.2f} vehicles/hour")
    
    print("\nTop Features by Importance:")
    for item in model_manager.feature_importances[:7]:
        print(f"  - {item['feature']:<25}: {item['importance']:.2f}%")
        
    print("\nTraining completed and cached to backend/artifacts/.")

if __name__ == "__main__":
    main()
