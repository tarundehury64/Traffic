import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import {
  BarChart3,
  Calendar,
  Clock,
  Compass,
  Flame,
  Layers,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Sun,
  Moon
} from "lucide-react";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import { AnalyticsData } from "../types";

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<any | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load traffic analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Aggregating historical traffic patterns...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
        <p className="font-semibold text-sm mb-1">Analytics Processing Error</p>
        <p>{error || "Could not aggregate dataset records."}</p>
        <button
          onClick={loadAnalytics}
          className="mt-3 px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { hourly_distribution, daily_distribution, peak_analysis, heatmap, location_comparison } = data;

  // Heatmap color interpolation
  const getHeatmapColor = (flow: number) => {
    const ratio = Math.max(0, Math.min(1, (flow - heatmap.min_flow) / (heatmap.max_flow - heatmap.min_flow || 1)));
    if (ratio < 0.2) return "bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
    if (ratio < 0.4) return "bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200";
    if (ratio < 0.6) return "bg-indigo-200 text-indigo-950 dark:bg-indigo-900/80 dark:text-indigo-100";
    if (ratio < 0.8) return "bg-amber-200 text-amber-950 dark:bg-amber-900/80 dark:text-amber-100";
    return "bg-rose-400 text-white dark:bg-rose-600 dark:text-white font-bold";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Traffic Analytics & Pattern Intelligence
            </h1>
            <MetricBadge type="DATASET" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empirical distributions across hours, weekdays, rush periods, and 24x7 heatmap matrix.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="self-start sm:self-auto p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Refresh dataset analytics"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Peak Traffic Analysis 4-Card Summary (Section 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Morning Peak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Morning Peak
            </span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {peak_analysis.morning_peak.time_window}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
            Avg: {peak_analysis.morning_peak.average_vehicles.toLocaleString()} veh/hr
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Max Hour: {peak_analysis.morning_peak.peak_single_hour} ({peak_analysis.morning_peak.peak_single_hour_volume.toLocaleString()} veh/hr)
          </p>
        </div>

        {/* Afternoon Traffic */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Afternoon Traffic
            </span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {peak_analysis.afternoon_traffic.time_window}
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Avg: {peak_analysis.afternoon_traffic.average_vehicles.toLocaleString()} veh/hr
          </p>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {peak_analysis.afternoon_traffic.description}
          </p>
        </div>

        {/* Evening Peak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Evening Peak
            </span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {peak_analysis.evening_peak.time_window}
          </p>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
            Avg: {peak_analysis.evening_peak.average_vehicles.toLocaleString()} veh/hr
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Max Rush: {peak_analysis.evening_peak.peak_single_hour} ({peak_analysis.evening_peak.peak_single_hour_volume.toLocaleString()} veh/hr)
          </p>
        </div>

        {/* Lowest Traffic Period */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Lowest Traffic Valley
            </span>
            <Moon className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {peak_analysis.lowest_traffic_period.time_window}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
            Avg: {peak_analysis.lowest_traffic_period.average_vehicles.toLocaleString()} veh/hr
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Trough Hour: {peak_analysis.lowest_traffic_period.valley_hour} ({peak_analysis.lowest_traffic_period.valley_hour_volume.toLocaleString()} veh/hr)
          </p>
        </div>
      </div>

      {/* Traffic Heatmap (Section 8) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Traffic Heatmap (24 Hours × 7 Days)
              </h2>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Average vehicle flow per weekday and hour derived across all 48,204 historical records
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span>Low ({heatmap.min_flow} veh)</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-3 rounded bg-blue-50 border border-slate-200 dark:border-slate-700"></span>
              <span className="w-4 h-3 rounded bg-blue-100"></span>
              <span className="w-4 h-3 rounded bg-indigo-200"></span>
              <span className="w-4 h-3 rounded bg-amber-200"></span>
              <span className="w-4 h-3 rounded bg-rose-400"></span>
            </div>
            <span>High ({heatmap.max_flow.toLocaleString()} veh)</span>
          </div>
        </div>

        {/* Heatmap Matrix Table */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-[11px] border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="py-2 px-2 text-left font-semibold text-slate-500 dark:text-slate-400 w-16">
                  Day
                </th>
                {Array.from({ length: 24 }).map((_, h) => (
                  <th
                    key={h}
                    className="py-2 text-center font-mono text-[10px] text-slate-400 dark:text-slate-500"
                  >
                    {h % 2 === 0 ? `${h.toString().padStart(2, "0")}` : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.matrix.map((row) => (
                <tr key={row.day_name}>
                  <td className="py-1 px-2 font-medium text-slate-700 dark:text-slate-300">
                    {row.day_short}
                  </td>
                  {row.hours.map((cell) => (
                    <td
                      key={cell.hour}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="p-0.5"
                    >
                      <div
                        className={`h-7 rounded text-[10px] flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:ring-2 hover:ring-blue-500 ${getHeatmapColor(
                          cell.average_flow
                        )}`}
                        title={`${cell.day_name} ${cell.hour_label}: ${cell.average_flow.toLocaleString()} vehicles/hour`}
                      >
                        {cell.average_flow > 4500 ? `${Math.round(cell.average_flow / 1000)}k` : ""}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Hover Inspection Bar */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {hoveredCell ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {hoveredCell.day_name} at {hoveredCell.hour_label}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                Average Flow: {hoveredCell.average_flow.toLocaleString()} vehicles/hour
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic">
              Hover over any heatmap cell to view exact hourly average vehicle flow.
            </span>
          )}
          <span className="text-[10px] text-slate-400">[DATASET METRIC]</span>
        </div>
      </div>

      {/* Hourly Distribution & Daily Pattern Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Hourly Traffic Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Average vehicle flow across 24 hours</p>
            </div>
            <MetricBadge type="DATASET" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="hour_label" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg shadow text-xs">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                            Average: {d.average_vehicles.toLocaleString()} veh/hr
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            Range: {d.min_vehicles.toLocaleString()} – {d.max_vehicles.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="average_vehicles" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Traffic Pattern Bar/Line */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Daily Traffic Pattern (Mon – Sun)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Average vehicle flow per day of the week</p>
            </div>
            <MetricBadge type="DATASET" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="day_name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg shadow text-xs">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                            Average Flow: {d.average_vehicles.toLocaleString()} veh/hr
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="average_vehicles" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Location Comparison Interactive Section (Section 7) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Location Volume Comparison
              </h3>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empirical and derived flow across monitored corridor segments
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {location_comparison.map((loc) => {
            const maxVal = Math.max(...location_comparison.map((l) => l.average_traffic));
            const pct = Math.round((loc.average_traffic / maxVal) * 100);

            return (
              <div key={loc.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {loc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">({loc.type})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {loc.average_traffic.toLocaleString()} veh/hr
                    </span>
                    <span className="text-[11px] text-slate-500">Peak: {loc.peak_traffic.toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
