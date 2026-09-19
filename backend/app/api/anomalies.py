from fastapi import APIRouter
from backend.app.ml.anomalies import detect_traffic_anomalies

router = APIRouter(prefix="", tags=["Anomaly Detection"])

@router.get("/anomalies")
def get_anomalies():
    """
    Returns detected historical traffic records with abnormal vehicle flow
    labeled strictly as 'Unusual traffic pattern detected'.
    """
    anomalies = detect_traffic_anomalies(max_records=20)
    return {
        "count": len(anomalies),
        "anomalies": anomalies,
        "detection_method": "Statistical deviation exceeding 2.4 sigma / IQR threshold per weekday-hour bin",
        "transparency_notice": "Abnormal traffic volume indicates a statistical deviation from expected patterns. It does not prove an accident or road incident.",
        "data_badge": "DATASET"
    }
