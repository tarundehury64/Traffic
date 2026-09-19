import React from "react";
import {
  GraduationCap,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Server,
  Layers,
  ArrowRight
} from "lucide-react";
import { MetricBadge } from "../components/MetricBadge";

export const AboutPage: React.FC = () => {
  const vivaQuestions = [
    {
      q: "Why is Random Forest or Gradient Boosting preferred over simple Linear Regression for traffic flow prediction?",
      a: "Traffic volume exhibits intense non-linear temporal dynamics: sharp morning and evening rush hour surges followed by sudden nighttime drops, along with non-linear weather interactions (e.g. rain affects rush hours differently than 3 AM). Decision-tree ensembles capture non-linear feature splits and cyclical interactions with significantly lower RMSE and higher R² (0.98 vs 0.95)."
    },
    {
      q: "How does the system quantify uncertainty instead of guessing fake confidence percentages?",
      a: "The system computes the residual standard error s_e = sqrt(sum(y - y_hat)^2 / (n - p)) on the independent test partition. The 95% prediction interval is calculated as y_hat ± 1.96 * s_e. This gives a mathematically grounded interval where future observations are statistically expected to fall under normal conditions."
    },
    {
      q: "Why does the platform distinguish between historical data and live data?",
      a: "In real-world transportation management, confusing ML predictions or historical datasets with live sensor telemetry violates safety and operational integrity. The platform enforces explicit badges ([DATASET], [PREDICTION], [ESTIMATE], [LIVE API]) to guarantee scientific transparency."
    },
    {
      q: "How were extreme sensor anomalies handled in preprocessing?",
      a: "The raw UCI dataset contains sensor failure artifacts, notably temperatures recorded as 0 Kelvin (-273.15°C) and impossible rain gauge spikes (9,831 mm). These were systematically detected during exploratory data analysis and imputed with historical medians or capped to realistic meteorological physical bounds."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <GraduationCap className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              About TrafficFlow AI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Academic 2nd-Year B.Tech AI/ML Project Documentation & System Methodology
            </p>
          </div>
        </div>
      </div>

      {/* Problem Statement & Objective Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Problem Statement
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Traffic congestion creates severe bottlenecks for urban transportation planning, increases carbon emissions, and results in inefficient road capacity usage. Historical vehicle-flow data collected by highway loop sensors contains valuable cyclical and weather-correlated signatures. By analyzing these multi-year records with machine learning, transportation engineers can anticipate vehicle flow, identify recurring rush hours, and make data-driven infrastructure decisions.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Project Objective
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Develop an end-to-end, production-style machine learning system capable of ingesting 48,204 historical hourly vehicle flow observations, cleaning sensor anomalies, engineering cyclical and meteorological features, training benchmark regression models, and deploying a responsive city traffic analytics platform with explicit factual transparency.
          </p>
        </div>
      </div>

      {/* Methodology Flowchart (Section 26) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
          End-to-End Methodology Flowchart
        </h2>

        <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 text-xs">
          {[
            { step: "Data Collection", desc: "48K UCI records from I-94 ATR 301" },
            { step: "Data Cleaning", desc: "Impute 0°K temps, cap rain outliers" },
            { step: "Exploratory EDA", desc: "Rush hours & weekday baselines" },
            { step: "Feature Engineering", desc: "Sin/cos cyclics, lags, weather" },
            { step: "Model Training", desc: "RF, Gradient Boost, Ridge, OLS" },
            { step: "Model Evaluation", desc: "MAE, RMSE, R², residual error" },
            { step: "Inference Engine", desc: "Forecast with 95% uncertainty CI" },
            { step: "Web Dashboard", desc: "React + TS + Tailwind + FastAPI" }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-1 flex flex-col justify-between text-center"
            >
              <div>
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] mx-auto flex items-center justify-center mb-2">
                  {idx + 1}
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-[11px] mb-1">
                  {item.step}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Limitations (Section 26) */}
      <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-rose-900 dark:text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            System Limitations & Academic Disclosures
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-rose-900/90 dark:text-rose-300/90 list-disc list-inside leading-relaxed">
          <li>
            <span className="font-semibold">Dataset Quality:</span> Predictions strictly depend on the historical dataset distribution and sensor fidelity.
          </li>
          <li>
            <span className="font-semibold">Unforeseen Events:</span> Unprecedented road construction, major sporting events, or bridge closures are not represented in historical patterns.
          </li>
          <li>
            <span className="font-semibold">Estimates, Not Guarantees:</span> All model predictions are statistical estimations with associated residual standard errors.
          </li>
          <li>
            <span className="font-semibold">Live Monitoring Requires Live Feeds:</span> Live telemetry monitoring requires authorized real-time streaming connections (MQTT/Kafka).
          </li>
          <li>
            <span className="font-semibold">Corridor Variation:</span> Multi-junction predictions use empirical branch calibration based on ATR 301.
          </li>
          <li>
            <span className="font-semibold">Geographic Coordinates:</span> The raw UCI dataset does not include row-level GPS coordinates; therefore maps are not fabricated.
          </li>
        </ul>
      </div>

      {/* Viva / Academic Defense Q&A */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Academic Viva & Defense Reference Q&A
          </h2>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((vq, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs"
            >
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Q{i + 1}: {vq.q}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{vq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
          Engineering & Technology Stack
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              Frontend Client
            </span>
            <ul className="text-slate-500 space-y-0.5 text-[11px]">
              <li>React 18 & TypeScript</li>
              <li>Tailwind CSS Design Tokens</li>
              <li>Recharts Visualization</li>
              <li>Lucide Icons</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              Backend REST API
            </span>
            <ul className="text-slate-500 space-y-0.5 text-[11px]">
              <li>FastAPI (Python 3.13)</li>
              <li>Pydantic Input Validation</li>
              <li>CORS & Structured Routing</li>
              <li>Joblib Model Serialization</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              Machine Learning Core
            </span>
            <ul className="text-slate-500 space-y-0.5 text-[11px]">
              <li>Scikit-learn Regressors</li>
              <li>Pandas & NumPy Preprocessing</li>
              <li>Residual Uncertainty Modeling</li>
              <li>Statistical Anomaly Detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
