from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATASET_PATH = DATA_DIR / "traffic_dataset.csv"
METADATA_PATH = DATA_DIR / "metadata.json"
MODELS_DIR = BASE_DIR / "artifacts"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Application metadata
APP_TITLE = "TrafficFlow AI"
APP_VERSION = "2.4.0"
APP_DESCRIPTION = "AI-powered vehicle flow analysis and prediction platform"
