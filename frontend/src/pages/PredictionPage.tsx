import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CloudSun,
  Thermometer,
  CloudRain,
  Sliders,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Info,
  ShieldCheck
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import { PredictionRequest, PredictionResult, LocationCard } from "../types";

export const PredictionPage: React.FC = () => {
  const [locations, setLocations] = useState<LocationCard[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Form State
  const [selectedLocation, setSelectedLocation] = useState<string>("atr-301");
  const [date, setDate] = useState<string>("2026-09-20");
  const [time, setTime] = useState<string>("18:00");
  const [tempCelsius, setTempCelsius] = useState<number>(18.0);
  const [rain1h, setRain1h] = useState<number>(0.0);
  const [snow1h, setSnow1h] = useState<number>(0.0);
  const [cloudsAll, setCloudsAll] = useState<number>(20);
  const [weatherMain, setWeatherMain] = useState<string>("Clear");
  const [horizon, setHorizon] = useState<string>("Next 1 hour");

  // Prediction Output State
  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived Day of Week
  const derivedDay = React.useMemo(() => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Sunday";
      return d.toLocaleDateString("en-US", { weekday: "long" });
    } catch {
      return "Sunday";
    }
  }, [date]);

  useEffect(() => {
    api
      .getLocations()
      .then((data) => {
        setLocations(data.locations);
        if (data.locations.length > 0) {
          setSelectedLocation(data.locations[0].id);
        }
      })
      .catch((err) => console.error("Could not load locations", err))
      .finally(() => setLoadingLocations(false));

    // Run initial prediction automatically on load
    handlePredict(false);
  }, []);

  const handlePredict = async (showLoading = true) => {
    if (showLoading) setPredicting(true);
    setError(null);
    try {
      const payload: PredictionRequest = {
        location: selectedLocation,
        date,
        time,
        temp_celsius: Number(tempCelsius),
        rain_1h: Number(rain1h),
        snow_1h: Number(snow1h),
        clouds_all: Number(cloudsAll),
        weather_main: weatherMain,
        horizon
      };
      const res = await api.predict(payload);
      setPredictionResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to calculate prediction");
    } finally {
      setPredicting(false);
    }
  };

  const getTrafficLevelBadgeColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300";
      case "MODERATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300";
      case "HEAVY":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
      case "SEVERE":
      default:
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Traffic Prediction Engine
          </h1>
          <MetricBadge type="PREDICTION" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Machine-learning vehicle flow estimation conditioned on date, time, weather factors, and forecast horizon.
        </p>
      </div>

      {/* Main Grid: Form Inputs (Left) and Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prediction Form (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Input Parameters
            </h2>
            <span className="text-[11px] text-slate-500">Historical ML Model</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePredict(true);
            }}
            className="space-y-4 text-xs"
          >
            {/* Location Select */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Location Segment
                </span>
                <span className="text-[10px] text-slate-400 font-normal">[DATASET LOCATIONS]</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Corridor and branch branches calibrated against Minnesota DOT ATR 301.
              </p>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Auto-derived Day Display */}
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Derived Day of Week:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{derivedDay}</span>
            </div>

            {/* Weather Inputs */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                Weather Conditions (From Dataset Schema)
              </label>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                    <Thermometer className="w-3 h-3 text-red-500" />
                    Temp (°C)
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    value={tempCelsius}
                    onChange={(e) => setTempCelsius(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                    <CloudRain className="w-3 h-3 text-blue-500" />
                    Rain (mm)
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={rain1h}
                    onChange={(e) => setRain1h(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block">Cloud Cover (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={cloudsAll}
                    onChange={(e) => setCloudsAll(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block">Weather Category</span>
                  <select
                    value={weatherMain}
                    onChange={(e) => setWeatherMain(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Clear">Clear</option>
                    <option value="Clouds">Clouds</option>
                    <option value="Rain">Rain</option>
                    <option value="Drizzle">Drizzle</option>
                    <option value="Mist">Mist</option>
                    <option value="Fog">Fog</option>
                    <option value="Snow">Snow</option>
                    <option value="Thunderstorm">Thunderstorm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Prediction Horizon */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                Prediction Horizon
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Next 15 minutes", "Next 30 minutes", "Next 1 hour", "Next 3 hours"].map((h) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`py-1.5 px-2 rounded-md text-xs font-medium border text-center transition-colors ${
                      horizon === h
                        ? "bg-blue-50 text-blue-700 border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={predicting}
              className="w-full mt-4 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {predicting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Prediction...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict Traffic Flow</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results & Comparison Visualization (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
              <p className="font-semibold">Prediction Generation Failed</p>
              <p>{error}</p>
            </div>
          )}

          {predictionResult && (
            <>
              {/* Prediction Summary Result Card (Matching Section 5 requirements) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Forecast
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {predictionResult.location}
                    </h3>
                  </div>
                  <MetricBadge type="PREDICTION" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Predicted Flow */}
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Predicted Vehicle Flow
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1 tracking-tight">
                      {predictionResult.predicted_vehicle_flow.toLocaleString()}{" "}
                      <span className="text-sm font-medium text-slate-500">vehicles/hour</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Historical Baseline: {predictionResult.historical_baseline_flow.toLocaleString()} veh/hr
                    </p>
                  </div>

                  {/* Expected Traffic Level */}
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Expected Traffic Level
                      </p>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border tracking-wider ${getTrafficLevelBadgeColor(
                            predictionResult.traffic_level
                          )}`}
                        >
                          {predictionResult.traffic_level}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      {predictionResult.traffic_level_desc}
                    </p>
                  </div>
                </div>

                {/* Prediction Confidence / Uncertainty Info */}
                <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-amber-600" />
                      Prediction Uncertainty Interval (95% CI)
                    </span>
                    <MetricBadge type="ESTIMATE" />
                  </div>
                  <p className="text-[11px]">
                    Expected Range:{" "}
                    <span className="font-bold">
                      {predictionResult.confidence_interval.lower_bound.toLocaleString()} –{" "}
                      {predictionResult.confidence_interval.upper_bound.toLocaleString()} veh/hr
                    </span>{" "}
                    (±{predictionResult.confidence_interval.margin_error.toLocaleString()} veh/hr)
                  </p>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-400">
                    {predictionResult.confidence_interval.basis}
                  </p>
                </div>

                {/* Transparent Notice */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Prediction based on historical traffic patterns.
                  </span>
                  <span>Model: {predictionResult.model_used}</span>
                </div>
              </div>

              {/* Historical vs Predicted Traffic Visualization (Section 6) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                        Historical vs Predicted Traffic
                      </h3>
                      <MetricBadge type="DATASET" />
                      <MetricBadge type="PREDICTION" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      12-Hour continuous comparative timeline surrounding {predictionResult.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="w-3 h-0.5 bg-slate-500 inline-block"></span>
                      Historical Traffic
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-600 inline-block"></span>
                      Predicted Traffic
                    </span>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionResult.timeline}
                      margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                      <XAxis dataKey="time_label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const p = payload[0].payload;
                            return (
                              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg text-xs space-y-1">
                                <p className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 pb-1">
                                  {label} {p.is_target_time && "(Requested Target Hour)"}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                  Historical:{" "}
                                  <span className="font-semibold">
                                    {p.historical_vehicles.toLocaleString()} vehicles
                                  </span>
                                </p>
                                <p className="text-blue-600 dark:text-blue-400 font-bold">
                                  Predicted:{" "}
                                  <span>{p.predicted_vehicles.toLocaleString()} vehicles</span>
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  95% CI: {p.uncertainty_lower.toLocaleString()} –{" "}
                                  {p.uncertainty_upper.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {/* Historical traffic line - solid neutral slate */}
                      <Line
                        type="monotone"
                        dataKey="historical_vehicles"
                        name="Historical Traffic"
                        stroke="#64748b"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#64748b" }}
                      />
                      {/* Predicted traffic line - dashed vibrant blue */}
                      <Line
                        type="monotone"
                        dataKey="predicted_vehicles"
                        name="Predicted Traffic"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: "#2563eb" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
