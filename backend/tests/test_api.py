from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "TrafficFlow AI"
    assert data["model_status"] == "Ready"

def test_traffic_summary():
    response = client.get("/api/traffic/summary")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert data["kpis"]["current_dataset"]["raw_count"] == 48204
    assert data["live_mode"]["connected"] is False

def test_traffic_analytics():
    response = client.get("/api/traffic/analytics")
    assert response.status_code == 200
    data = response.json()
    assert len(data["hourly_distribution"]) == 24
    assert len(data["daily_distribution"]) == 7
    assert "heatmap" in data
    assert len(data["heatmap"]["matrix"]) == 7

def test_traffic_locations():
    response = client.get("/api/traffic/locations")
    assert response.status_code == 200
    data = response.json()
    assert len(data["locations"]) > 0
    assert data["geographic_data"]["available"] is False
    assert "Map unavailable" in data["geographic_data"]["message"]

def test_predict_endpoint():
    payload = {
        "location": "atr-301",
        "date": "2026-09-20",
        "time": "18:00",
        "temp_celsius": 18.0,
        "rain_1h": 0.0,
        "snow_1h": 0.0,
        "clouds_all": 25,
        "weather_main": "Clear",
        "horizon": "Next 1 hour"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_vehicle_flow" in data
    assert data["predicted_vehicle_flow"] > 0
    assert data["traffic_level"] in ["LOW", "MODERATE", "HEAVY", "SEVERE"]
    assert "confidence_interval" in data
    assert len(data["timeline"]) == 12

def test_model_performance():
    response = client.get("/api/model/performance")
    assert response.status_code == 200
    data = response.json()
    assert len(data["comparison"]) >= 4
    assert len(data["pipeline_stages"]) == 7

def test_model_features():
    response = client.get("/api/model/features")
    assert response.status_code == 200
    data = response.json()
    assert len(data["feature_importances"]) > 0
    assert "does not establish causation" in data["explanation"]

def test_dataset_info_and_records():
    info_resp = client.get("/api/dataset/info")
    assert info_resp.status_code == 200
    assert info_resp.json()["metadata"]["total_records"] == 48204
    
    rec_resp = client.get("/api/dataset/records?page=1&page_size=10")
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    assert len(rec_data["records"]) == 10
    assert rec_data["total_records"] == 48204

def test_anomalies():
    response = client.get("/api/anomalies")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert "Unusual traffic pattern detected" in data["anomalies"][0]["classification_notice"]

def test_experiment_run():
    payload = {
        "test_split": 0.20,
        "model_type": "Linear Regression",
        "selected_features": ["hour", "day_of_week", "temp_celsius", "baseline_flow"]
    }
    response = client.post("/api/experiment/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["r2_score"] > 0.8
    assert data["training_records"] > 0
    assert data["testing_records"] > 0
