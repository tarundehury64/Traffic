import React, { useEffect, useState } from "react";
import {
  Database,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import { DatasetInfo, DatasetRecord } from "../types";

export const DatasetPage: React.FC = () => {
  const [info, setInfo] = useState<DatasetInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  // Table State
  const [records, setRecords] = useState<DatasetRecord[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(48204);
  const [search, setSearch] = useState<string>("");
  const [weatherFilter, setWeatherFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("date_time");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    api
      .getDatasetInfo()
      .then((data) => setInfo(data))
      .catch((err) => console.error("Failed to load dataset info", err))
      .finally(() => setLoadingInfo(false));
  }, []);

  const loadRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await api.getDatasetRecords({
        page,
        page_size: pageSize,
        search: search || undefined,
        weather: weatherFilter === "All" ? undefined : weatherFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      setRecords(res.records);
      setTotalPages(res.total_pages);
      setTotalRecords(res.total_records);
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [page, pageSize, weatherFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadRecords();
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Dataset Provenance & Quality Validation
            </h1>
            <MetricBadge type="DATASET" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete empirical transparency: source attribution, quality report, and interactive data explorer.
          </p>
        </div>

        {info && (
          <a
            href={info.metadata.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-colors shadow-xs"
          >
            <span>UCI Dataset Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Dataset Metadata Overview Cards */}
      {info && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Dataset Name
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
              {info.metadata.dataset_name}
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-mono">
              UCI ML Repository (ID: 492)
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Observation Scope
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
              {info.metadata.total_records.toLocaleString()} Records
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {info.metadata.date_range.start.split(" ")[0]} to {info.metadata.date_range.end.split(" ")[0]}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Monitored Corridor
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
              Westbound I-94
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              MN DOT Station ATR 301
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              License & Attribution
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
              CC BY 4.0
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              Open Academic & Public Use
            </p>
          </div>
        </div>
      )}

      {/* Data Quality Report (Section 16) */}
      {info && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Data Quality & Pre-Training Validation Report
              </h2>
            </div>
            <MetricBadge type="DATASET" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Verified Records:</span>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                {info.quality_report.total_records.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">100% Ingested</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Missing Holiday Values:</span>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                {info.quality_report.missing_values_percentage}%
              </p>
              <p className="text-[10px] text-slate-400">Imputed to "None" (99.8%)</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Duplicate Timestamps:</span>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                {info.quality_report.duplicate_timestamps.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">Multi-weather sub-readings</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Valid Timestamps:</span>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                {info.quality_report.valid_timestamps_percentage}%
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">ISO 8601 Validated</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-semibold">Automated Sensor Correction Applied:</span> Handled{" "}
              {info.quality_report.sensor_anomalies_corrected.zero_kelvin_temps} sensor failure records (0°K temperature imputed with historical median) and capped{" "}
              {info.quality_report.sensor_anomalies_corrected.extreme_rain_spikes} erroneous rainfall spikes (&gt;100mm/hr) prior to model training.
            </p>
          </div>
        </div>
      )}

      {/* Dataset Preview Table with Filtering, Search, Sorting, Pagination (Section 15) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Dataset Record Explorer
              </h3>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {records.length} of {totalRecords.toLocaleString()} matching records
            </p>
          </div>

          {/* Search and Weather Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search date or weather..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            <select
              value={weatherFilter}
              onChange={(e) => {
                setWeatherFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="All">All Weathers</option>
              <option value="Clear">Clear</option>
              <option value="Clouds">Clouds</option>
              <option value="Rain">Rain</option>
              <option value="Snow">Snow</option>
              <option value="Drizzle">Drizzle</option>
              <option value="Mist">Mist</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
                <th
                  onClick={() => toggleSort("date_time")}
                  className="py-2.5 px-3 font-semibold cursor-pointer hover:text-blue-600 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold">Location</th>
                <th
                  onClick={() => toggleSort("traffic_volume")}
                  className="py-2.5 px-3 font-semibold cursor-pointer hover:text-blue-600 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Vehicle Count</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold">Day</th>
                <th className="py-2.5 px-3 font-semibold">Hour</th>
                <th className="py-2.5 px-3 font-semibold">Temp (°C)</th>
                <th className="py-2.5 px-3 font-semibold">Weather</th>
                <th className="py-2.5 px-3 font-semibold">Holiday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loadingRecords ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-blue-600" />
                    Fetching page records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No records match the active search filter.
                  </td>
                </tr>
              ) : (
                records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                    <td className="py-2 px-3 text-slate-900 dark:text-slate-100 font-sans">
                      {r.timestamp}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-sans">
                      {r.location}
                    </td>
                    <td className="py-2 px-3 font-bold text-blue-600 dark:text-blue-400">
                      {r.vehicle_count.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">
                      {r.day_name}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      {r.hour.toString().padStart(2, "0")}:00
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      {r.temp_celsius.toFixed(1)}°C
                    </td>
                    <td className="py-2 px-3 font-sans">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.weather_main}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans">
                      {r.is_holiday ? (
                        <span className="text-amber-600 font-bold text-[10px]">Holiday</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
