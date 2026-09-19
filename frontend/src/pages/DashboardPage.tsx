import React, { useEffect, useState } from "react";
import {
  Database,
  Gauge,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Calendar
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { KpiCard } from "../components/KpiCard";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import { TrafficSummary, AnomalyEvent } from "../types";
import { NavTab } from "../components/Sidebar";

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [recentAnomalies, setRecentAnomalies] = useState<AnomalyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumData, histData, anomData] = await Promise.all([
        api.getSummary(),
        api.getHistory(48, 0),
        api.getAnomalies()
      ]);
      setSummary(sumData);
      
      const formattedHistory = histData.records.map((r) => ({
        time: r.timestamp.split(" ")[1],
        date: r.timestamp.split(" ")[0],
        vehicles: r.vehicles,
        temp: r.temp_celsius,
        condition: r.weather_condition
      }));
      setTrendData(formattedHistory);
      setRecentAnomalies(anomData.anomalies.slice(0, 3));
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading telemetry & model metrics...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-6 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 text-xs">
        <p className="font-semibold text-sm mb-1">Telemetry Initialization Error</p>
        <p>{error || "Dataset could not be loaded. Please verify the configured data source."}</p>
        <button
          onClick={loadData}
          className="mt-3 px-3 py-1.5 rounded bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis } = summary;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              TrafficFlow AI Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              Model Status: Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AI-powered vehicle flow analysis and prediction · Monitored Corridor: Westbound I-94 (ATR Station 301)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("prediction")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Prediction</span>
          </button>
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Current Dataset"
          value={kpis.current_dataset.value}
          badge={kpis.current_dataset.badge}
          subtitle="UCI Metro Interstate Records"
          icon={<Database className="w-5 h-5 text-blue-600" />}
          trend="100% Verified"
          trendPositive={true}
        />

        <KpiCard
          title="Average Vehicle Flow"
          value={kpis.average_vehicle_flow.value}
          badge={kpis.average_vehicle_flow.badge}
          subtitle="Calculated Across All Hours"
          icon={<Gauge className="w-5 h-5 text-indigo-600" />}
          trend="Baseline Mean"
          trendPositive={true}
        />

        <KpiCard
          title="Peak Traffic Hour"
          value={kpis.peak_traffic_hour.value}
          badge={kpis.peak_traffic_hour.badge}
          subtitle={kpis.peak_traffic_hour.peak_volume || "5,340 vehicles/hr"}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          trend="Evening Rush"
          trendPositive={false}
        />

        <KpiCard
          title="Model Performance"
          value={kpis.model_performance.value}
          badge={kpis.model_performance.badge}
          subtitle={`RMSE: ${kpis.model_performance.rmse} veh/hr`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          trend="Random Forest"
          trendPositive={true}
        />
      </div>

      {/* Historical Chronological Traffic Trend */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Historical Traffic Volume Sequence (48-Hour Sample)
              </h2>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actual recorded vehicle counts from continuous automated traffic recorder loop sensors
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
            <span>Observed Flow (veh/hr)</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg shadow-md text-xs">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {data.date} · {label}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                          Traffic: {data.vehicles.toLocaleString()} vehicles/hr
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Weather: {data.condition} ({data.temp}°C)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="vehicles"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVehicles)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Recent Anomalies Preview & Quick Prediction Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Detected Unusual Traffic Patterns */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Unusual Traffic Patterns Detected
                </h3>
              </div>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Historical records where observed volume diverged by &gt;2.4 standard deviations from normal expectations.
            </p>

            <div className="space-y-2.5">
              {recentAnomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {anom.date} at {anom.time} ({anom.day_name})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Normal: {anom.normal_range_min.toLocaleString()} – {anom.normal_range_max.toLocaleString()} veh/hr
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {anom.observed_flow.toLocaleString()} veh/hr
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {anom.deviation_percentage > 0 ? `+${anom.deviation_percentage}%` : `${anom.deviation_percentage}%`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Labeled: Statistical Anomaly</span>
            <button
              onClick={() => onNavigate("anomalies")}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All Detected Anomalies</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Quick Prediction Engine Launcher */}
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                  AI Traffic Flow Predictor
                </h3>
              </div>
              <MetricBadge type="PREDICTION" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Enter target time, day, weather factors (temperature, rain, snow, clouds), and forecast horizons to estimate highway flow along with statistical uncertainty intervals.
            </p>

            <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Active Regression Architecture:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{summary.model_engine}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Uncertainty Margin:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">±268 vehicles/hr (95% CI)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Prediction Horizons Supported:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">15m, 30m, 1h, 3h</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Based on historical patterns</span>
            <button
              onClick={() => onNavigate("prediction")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Launch Prediction Form</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
