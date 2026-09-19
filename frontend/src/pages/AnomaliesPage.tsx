import React, { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, RefreshCw, AlertOctagon, TrendingDown, TrendingUp, Info } from "lucide-react";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import { AnomalyEvent } from "../types";

export const AnomaliesPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnomalies();
      setAnomalies(res.anomalies);
    } catch (err: any) {
      setError(err.message || "Failed to load anomaly events");
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
        <p className="text-xs text-slate-500 font-medium">Scanning dataset for statistical traffic outliers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Unusual Traffic Pattern Detection
            </h1>
            <MetricBadge type="DATASET" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Statistical deviation monitoring detecting historical vehicle flows divergent from hourly weekday baselines.
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Refresh anomalies"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory Scientific Transparency Notice (Section 17) */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">Strict Attribution Standard: "Unusual Traffic Pattern Detected"</p>
          <p className="text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
            Abnormal traffic volume alone does not prove an accident or roadway collision. Anomalies may result from severe weather events, Minnesota State Fair influx, sensor maintenance, or localized detour shifts. The system strictly labels these as <span className="font-semibold underline">“Unusual traffic pattern detected”</span>.
          </p>
        </div>
      </div>

      {/* Anomaly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {anomalies.map((item) => {
          const isSurge = item.deviation_percentage > 0;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs traffic-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSurge
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      }`}
                    >
                      {isSurge ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Anomaly Event
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.anomaly_type}
                      </span>
                    </div>
                  </div>
                  <MetricBadge type="DATASET" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500">
                      Location: <span className="font-medium text-slate-800 dark:text-slate-200">{item.location}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Timestamp:{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.date} at {item.time} ({item.day_name})
                      </span>
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Observed Flow:</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                          {item.observed_flow.toLocaleString()} <span className="text-xs font-normal text-slate-500">veh/hr</span>
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isSurge
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {isSurge ? `+${item.deviation_percentage}%` : `${item.deviation_percentage}%`}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Normal Historical Range:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.normal_range_min.toLocaleString()} – {item.normal_range_max.toLocaleString()} veh/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Baseline Mean:</span>
                      <span>{item.expected_baseline.toLocaleString()} veh/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weather at Observation:</span>
                      <span>
                        {item.weather_condition} ({item.temperature_celsius}°C)
                      </span>
                    </div>
                    {item.holiday && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                        <span>Associated Holiday:</span>
                        <span>{item.holiday}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 italic">
                {item.classification_notice}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
