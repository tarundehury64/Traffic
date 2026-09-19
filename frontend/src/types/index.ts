export type BadgeType = "DATASET" | "PREDICTION" | "ESTIMATE" | "LIVE API";

export interface KpiItem {
  value: string;
  raw_count?: number;
  raw_flow?: number;
  r2?: number;
  rmse?: number;
  badge: BadgeType;
  label: string;
  peak_volume?: string;
}

export interface TrafficSummary {
  platform_name: string;
  subtitle: string;
  model_status: string;
  model_engine: string;
  kpis: {
    current_dataset: KpiItem;
    average_vehicle_flow: KpiItem;
    peak_traffic_hour: KpiItem;
    model_performance: KpiItem;
  };
  live_mode: {
    connected: boolean;
    status_text: string;
    message: string;
    badge: BadgeType;
  };
}

export interface PredictionRequest {
  location: string;
  date: string;
  time: string;
  temp_celsius: number;
  rain_1h: number;
  snow_1h: number;
  clouds_all: number;
  weather_main: string;
  horizon: string;
}

export interface TimelinePoint {
  timestamp: string;
  time_label: string;
  historical_vehicles: number;
  predicted_vehicles: number;
  uncertainty_lower: number;
  uncertainty_upper: number;
  is_target_time: boolean;
}

export interface PredictionResult {
  location: string;
  location_id: string;
  location_type: string;
  is_dataset_location: boolean;
  timestamp: string;
  date: string;
  time: string;
  day_of_week: string;
  predicted_vehicle_flow: number;
  historical_baseline_flow: number;
  difference_from_baseline: number;
  unit: string;
  traffic_level: "LOW" | "MODERATE" | "HEAVY" | "SEVERE";
  traffic_level_desc: string;
  confidence_interval: {
    confidence_level: string;
    margin_error: number;
    lower_bound: number;
    upper_bound: number;
    basis: string;
  };
  model_used: string;
  data_badge: BadgeType;
  transparency_notice: string;
  timeline: TimelinePoint[];
}

export interface HourlyPoint {
  hour: number;
  hour_label: string;
  average_vehicles: number;
  min_vehicles: number;
  max_vehicles: number;
  sample_count: number;
}

export interface DailyPoint {
  day_name: string;
  day_of_week: number;
  average_vehicles: number;
  min_vehicles: number;
  max_vehicles: number;
}

export interface HeatmapCell {
  day_name: string;
  day_index: number;
  hour: number;
  hour_label: string;
  average_flow: number;
}

export interface HeatmapDayRow {
  day_name: string;
  day_short: string;
  hours: HeatmapCell[];
}

export interface PeakAnalysis {
  morning_peak: {
    time_window: string;
    average_vehicles: number;
    peak_single_hour: string;
    peak_single_hour_volume: number;
  };
  afternoon_traffic: {
    time_window: string;
    average_vehicles: number;
    description: string;
  };
  evening_peak: {
    time_window: string;
    average_vehicles: number;
    peak_single_hour: string;
    peak_single_hour_volume: number;
  };
  lowest_traffic_period: {
    time_window: string;
    average_vehicles: number;
    valley_hour: string;
    valley_hour_volume: number;
  };
}

export interface LocationCard {
  id: string;
  name: string;
  type: string;
  is_dataset_location: boolean;
  multiplier: number;
  total_records: number;
  average_traffic: number;
  peak_traffic: number;
  lowest_traffic: number;
  traffic_trend: string;
  description: string;
}

export interface AnalyticsData {
  hourly_distribution: HourlyPoint[];
  daily_distribution: DailyPoint[];
  peak_analysis: PeakAnalysis;
  heatmap: {
    matrix: HeatmapDayRow[];
    cells: HeatmapCell[];
    min_flow: number;
    max_flow: number;
  };
  location_comparison: LocationCard[];
  data_badge: BadgeType;
  provenance_note: string;
}

export interface PipelineStage {
  step: number;
  title: string;
  description: string;
}

export interface ModelMetric {
  model_name: string;
  mae: number;
  rmse: number;
  r2_score: number;
  residual_std_error: number;
  training_records: number;
  testing_records: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelPerformanceData {
  pipeline_stages: PipelineStage[];
  comparison: ModelMetric[];
  selected_model: string;
  evaluation_criterion: string;
  residual_std_error: number;
  data_badge: BadgeType;
}

export interface DatasetRecord {
  timestamp: string;
  location: string;
  vehicle_count: number;
  day_name: string;
  hour: number;
  temp_celsius: number;
  rain_1h: number;
  snow_1h: number;
  clouds_percentage: number;
  weather_main: string;
  is_holiday: boolean;
}

export interface DatasetInfo {
  metadata: {
    dataset_name: string;
    source: string;
    source_url: string;
    citation: string;
    license: string;
    monitored_corridor: string;
    sensor_station: string;
    reporting_interval: string;
    total_records: number;
    date_range: {
      start: string;
      end: string;
    };
    target_variable: string;
    raw_features: Array<{
      name: string;
      type: string;
      description: string;
    }>;
    geographic_coordinates_available: boolean;
    geographic_note: string;
  };
  quality_report: {
    total_records: number;
    clean_records: number;
    missing_values_percentage: number;
    duplicate_timestamps: number;
    valid_timestamps_percentage: number;
    sensor_anomalies_corrected: {
      zero_kelvin_temps: number;
      extreme_rain_spikes: number;
    };
    target_mean: number;
    target_std: number;
    target_min: number;
    target_max: number;
  };
  data_badge: BadgeType;
}

export interface AnomalyEvent {
  id: string;
  location: string;
  timestamp: string;
  date: string;
  time: string;
  day_name: string;
  observed_flow: number;
  normal_range_min: number;
  normal_range_max: number;
  expected_baseline: number;
  deviation_percentage: number;
  anomaly_type: string;
  weather_condition: string;
  temperature_celsius: number;
  holiday?: string | null;
  classification_notice: string;
}

export interface ExperimentRequest {
  test_split: number;
  model_type: string;
  selected_features: string[];
}

export interface ExperimentResult {
  model_type: string;
  test_split: number;
  training_records: number;
  testing_records: number;
  features_used: string[];
  mae: number;
  rmse: number;
  r2_score: number;
  data_badge: BadgeType;
  notice: string;
}
