import React, { useEffect, useState } from "react";
import {
  Cpu,
  CheckCircle2,
  ArrowDown,
  Sparkles,
  BarChart2,
  Sliders,
  Play,
  RefreshCw,
  Info,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import {
  ModelPerformanceData,
  FeatureImportance,
  ExperimentRequest,
  ExperimentResult
} from "../types";

export const ModelPerformancePage: React.FC = () => {
  const [perfData, setPerfData] = useState<ModelPerformanceData | null>(null);
  const [featuresData, setFeaturesData] = useState<{
    feature_importances: FeatureImportance[];
    explanation: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Experiment Workbench State
  const [testSplit, setTestSplit] = useState<number>(0.20);
  const [modelType, setModelType] = useState<string>("Random Forest Regressor");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "hour",
    "day_of_week",
    "temp_celsius",
    "rain_1h",
    "baseline_flow",
    "prev_traffic_volume"
  ]);
  const [runningExp, setRunningExp] = useState(false);
  const [expResult, setExpResult] = useState<ExperimentResult | null>(null);
  const [expError, setExpError] = useState<string | null>(null);

  const availableFeatures = [
    { id: "hour", label: "Hour of Day" },
    { id: "day_of_week", label: "Day of Week" },
    { id: "month", label: "Month of Year" },
    { id: "is_weekend", label: "Is Weekend Flag" },
    { id: "is_holiday", label: "Is Holiday Flag" },
    { id: "temp_celsius", label: "Temperature (°C)" },
    { id: "rain_1h", label: "Rainfall (mm)" },
    { id: "snow_1h", label: "Snowfall (mm)" },
    { id: "clouds_all", label: "Cloud Cover (%)" },
    { id: "sin_hour", label: "Sin Hour (Cyclical)" },
    { id: "cos_hour", label: "Cos Hour (Cyclical)" },
    { id: "prev_traffic_volume", label: "Previous Hour Traffic Volume" },
    { id: "baseline_flow", label: "Historical Baseline Mean Flow" }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, f] = await Promise.all([
        api.getModelPerformance(),
        api.getFeatureImportance()
      ]);
      setPerfData(p);
      setFeaturesData(f);
    } catch (err) {
      console.error("Error loading model metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeature = (featId: string) => {
    if (selectedFeatures.includes(featId)) {
      if (selectedFeatures.length > 1) {
        setSelectedFeatures(selectedFeatures.filter((f) => f !== featId));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, featId]);
    }
  };

  const handleRunExperiment = async () => {
    setRunningExp(true);
    setExpError(null);
    try {
      const payload: ExperimentRequest = {
        test_split: testSplit,
        model_type: modelType,
        selected_features: selectedFeatures
      };
      const res = await api.runExperiment(payload);
      setExpResult(res);
    } catch (err: any) {
      setExpError(err.message || "Failed to execute experiment");
    } finally {
      setRunningExp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Retrieving ML evaluation benchmarks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Machine Learning Architecture & Performance
          </h1>
          <MetricBadge type="PREDICTION" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          End-to-end ML pipeline, comparative regression evaluations, feature importance rankings, and interactive academic experimentation.
        </p>
      </div>

      {/* Visual ML Pipeline (Section 11) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              ML Pipeline Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual representation of the data transformation and inference lifecycle
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">7-Stage Pipeline</span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-xs">
          {perfData?.pipeline_stages.map((stage, idx) => (
            <div
              key={stage.step}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {stage.step}
                  </span>
                  {idx < 6 && (
                    <span className="hidden md:inline text-slate-400 font-mono text-[10px]">→</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] mb-1">
                  {stage.title}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Comparison Table (Section 12) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Model Evaluation & Benchmark Comparison
              </h2>
              <MetricBadge type="PREDICTION" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluation metrics programmatically computed on independent 80/20 test split (9,641 unseen observations)
            </p>
          </div>
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Criterion: </span>
            <span>{perfData?.evaluation_criterion}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Model Architecture</th>
                <th className="py-2.5 px-3 font-semibold">MAE (veh/hr)</th>
                <th className="py-2.5 px-3 font-semibold">RMSE (veh/hr)</th>
                <th className="py-2.5 px-3 font-semibold">R² Score</th>
                <th className="py-2.5 px-3 font-semibold">Residual Std Error</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {perfData?.comparison.map((m) => {
                const isSelected = m.model_name === perfData.selected_model;
                return (
                  <tr
                    key={m.model_name}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-blue-50/50 dark:bg-blue-950/30 font-medium"
                        : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {isSelected && <Award className="w-4 h-4 text-blue-600 shrink-0" />}
                        <span className={isSelected ? "font-bold text-blue-900 dark:text-blue-200" : "text-slate-800 dark:text-slate-200"}>
                          {m.model_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {m.mae.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {m.rmse.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {m.r2_score.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      ±{m.residual_std_error.toFixed(1)}
                    </td>
                    <td className="py-3 px-3">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          SELECTED MODEL
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance (Section 13) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Factors Influencing Traffic Prediction (Feature Importance)
              </h2>
              <MetricBadge type="PREDICTION" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empirical variance reduction ranking generated from {perfData?.selected_model}
            </p>
          </div>
        </div>

        <div className="h-64 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featuresData?.feature_importances.slice(0, 8)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis type="number" unit="%" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                type="category"
                dataKey="feature"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded shadow text-xs">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{d.feature}</p>
                        <p className="text-blue-600 font-semibold mt-0.5">
                          Importance: {d.importance}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="importance" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mandatory Academic Caveat Note */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="italic">
            “Feature importance indicates how strongly each input contributed to the model's predictions. It does not establish causation.”
          </p>
        </div>
      </div>

      {/* Academic ML Experiment Workbench (Section 27) */}
      <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Academic ML Experiment Workbench
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
                Viva Feature
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamically select train/test split, model architecture, and feature subset to retrain and inspect programmatic metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Controls: Split & Model */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Train / Test Split Ratio
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.10"
                  max="0.40"
                  step="0.05"
                  value={testSplit}
                  onChange={(e) => setTestSplit(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-mono font-bold text-blue-600 w-16 text-right">
                  {Math.round((1 - testSplit) * 100)} / {Math.round(testSplit * 100)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Training: {Math.round((1 - testSplit) * 100)}% · Testing: {Math.round(testSplit * 100)}%
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Algorithm Selection
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Random Forest Regressor">Random Forest Regressor</option>
                <option value="Gradient Boosting Regressor">Gradient Boosting Regressor</option>
                <option value="Linear Regression">Linear Regression (OLS)</option>
                <option value="Ridge Regression">Ridge Regression (L2)</option>
              </select>
            </div>

            <button
              onClick={handleRunExperiment}
              disabled={runningExp}
              className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {runningExp ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fitting & Evaluating Model...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute ML Experiment</span>
                </>
              )}
            </button>
          </div>

          {/* Controls: Feature Checkbox Grid */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Features to Train ({selectedFeatures.length} active)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {availableFeatures.map((f) => {
                const checked = selectedFeatures.includes(f.id);
                return (
                  <label
                    key={f.id}
                    className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleFeature(f.id)}
                      className="rounded text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                    />
                    <span>{f.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Experiment Programmatic Output Display */}
          <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-950 dark:text-purple-200 text-xs">
                  Experiment Results
                </span>
                <MetricBadge type="PREDICTION" />
              </div>

              {expError && (
                <div className="p-2 rounded bg-rose-100 text-rose-800 text-[11px]">
                  {expError}
                </div>
              )}

              {expResult ? (
                <div className="space-y-2 mt-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Model Trained:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {expResult.model_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Training Records:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {expResult.training_records.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Testing Records:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {expResult.testing_records.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-800/80 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">MAE:</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        {expResult.mae.toFixed(2)} veh/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">RMSE:</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        {expResult.rmse.toFixed(2)} veh/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">R² Score:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {expResult.r2_score.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-center py-6 text-xs">
                  Adjust parameters and click <span className="font-semibold">“Execute ML Experiment”</span> to retrain and compute metrics live.
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-purple-100 dark:border-purple-900/40">
              All metrics programmatically computed in scikit-learn on the active test partition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
