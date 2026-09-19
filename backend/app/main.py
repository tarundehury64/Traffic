from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import APP_TITLE, APP_VERSION, APP_DESCRIPTION
from backend.app.ml.models import model_manager
from backend.app.api.traffic import router as traffic_router
from backend.app.api.predict import router as predict_router
from backend.app.api.models import router as models_router
from backend.app.api.dataset import router as dataset_router
from backend.app.api.anomalies import router as anomalies_router
from backend.app.api.experiment import router as experiment_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure models and data are initialized
    print("Starting TrafficFlow AI Backend...")
    model_manager.initialize()
    print("TrafficFlow AI Backend initialized successfully.")
    yield
    print("Shutting down TrafficFlow AI Backend.")

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    lifespan=lifespan
)

# CORS Configuration for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(traffic_router, prefix="/api")
app.include_router(predict_router, prefix="/api")
app.include_router(models_router, prefix="/api")
app.include_router(dataset_router, prefix="/api")
app.include_router(anomalies_router, prefix="/api")
app.include_router(experiment_router, prefix="/api")

@app.get("/")
def root():
    if not model_manager.is_trained:
        model_manager.initialize()
    return {
        "platform": APP_TITLE,
        "version": APP_VERSION,
        "status": "online",
        "model_status": "Ready" if model_manager.is_trained else "Initializing",
        "docs_url": "/docs",
        "disclaimer": "Predictions are ML-generated estimates based on historical UCI Metro Interstate traffic data, not guaranteed real-time government feeds."
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_ready": model_manager.is_trained,
        "active_model": model_manager.best_model_name
    }
