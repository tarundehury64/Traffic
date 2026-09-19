import {
  TrafficSummary,
  PredictionRequest,
  PredictionResult,
  AnalyticsData,
  ModelPerformanceData,
  FeatureImportance,
  DatasetInfo,
  DatasetRecord,
  AnomalyEvent,
  ExperimentRequest,
  ExperimentResult,
  LocationCard
} from "../types";

const API_BASE = "/api";

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    let errorDetail = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) errorDetail = errJson.detail;
    } catch {
      // Use fallback
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  getSummary: (): Promise<TrafficSummary> => fetchJson<TrafficSummary>("/traffic/summary"),
  
  getAnalytics: (): Promise<AnalyticsData> => fetchJson<AnalyticsData>("/traffic/analytics"),
  
  getLocations: (): Promise<{ locations: LocationCard[]; geographic_data: { available: boolean; message: string; detail: string; badge: string } }> =>
    fetchJson("/traffic/locations"),
    
  getHistory: (limit = 48, offset = 0) =>
    fetchJson<{ total_records: number; records: Array<{ timestamp: string; vehicles: number; temp_celsius: number; weather_condition: string; is_holiday: boolean }> }>(
      `/traffic/history?limit=${limit}&offset=${offset}`
    ),

  predict: (req: PredictionRequest): Promise<PredictionResult> =>
    fetchJson<PredictionResult>("/predict", {
      method: "POST",
      body: JSON.stringify(req)
    }),

  getModelPerformance: (): Promise<ModelPerformanceData> =>
    fetchJson<ModelPerformanceData>("/model/performance"),

  getFeatureImportance: (): Promise<{ feature_importances: FeatureImportance[]; model_used: string; explanation: string; data_badge: string }> =>
    fetchJson("/model/features"),

  getDatasetInfo: (): Promise<DatasetInfo> =>
    fetchJson<DatasetInfo>("/dataset/info"),

  getDatasetRecords: (params: {
    page: number;
    page_size: number;
    search?: string;
    weather?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<{
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    records: DatasetRecord[];
    data_badge: string;
  }> => {
    const query = new URLSearchParams();
    query.set("page", params.page.toString());
    query.set("page_size", params.page_size.toString());
    if (params.search) query.set("search", params.search);
    if (params.weather) query.set("weather", params.weather);
    if (params.sort_by) query.set("sort_by", params.sort_by);
    if (params.sort_order) query.set("sort_order", params.sort_order);
    return fetchJson(`/dataset/records?${query.toString()}`);
  },

  getAnomalies: (): Promise<{
    count: number;
    anomalies: AnomalyEvent[];
    detection_method: string;
    transparency_notice: string;
    data_badge: string;
  }> => fetchJson("/anomalies"),

  runExperiment: (req: ExperimentRequest): Promise<ExperimentResult> =>
    fetchJson<ExperimentResult>("/experiment/run", {
      method: "POST",
      body: JSON.stringify(req)
    })
};
