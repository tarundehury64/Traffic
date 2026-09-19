import React from "react";
import { ArrowRight, Sparkles, BarChart3, HelpCircle, ShieldCheck, Database, Sliders, ChevronRight } from "lucide-react";
import { MetricBadge } from "../components/MetricBadge";
import { NavTab } from "../components/Sidebar";

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto py-4">
      {/* Hero Section */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 overflow-hidden shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <MetricBadge type="DATASET" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            UCI Machine Learning Repository · Metro Interstate 94 Dataset
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight max-w-3xl leading-tight">
          TrafficFlow AI
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-slate-700 dark:text-slate-300 mt-2">
          “Predict traffic. Understand patterns. Make better transportation decisions.”
        </p>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 max-w-2xl leading-relaxed">
          An AI/ML platform for analyzing historical vehicle-flow data and generating data-driven traffic predictions. Engineered as a rigorous 2nd-year B.Tech academic project, designed with the precision of a municipal traffic management operations center.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate("about")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors"
          >
            <span>View Methodology</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Factual Transparency Policy Enforced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>48,204 Authenticated Records (2012–2018)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>4 Benchmarked Regression Architectures</span>
          </div>
        </div>
      </div>

      {/* What the system does Section */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            What the System Does
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bridging raw automated traffic recorder data with machine learning inference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Predict */}
          <div
            onClick={() => onNavigate("prediction")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs traffic-card cursor-pointer group"
          >
            <div className="p-3 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Predict</h3>
              <MetricBadge type="PREDICTION" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Forecast vehicle flow using trained machine-learning models (Random Forest, Gradient Boosting) for customizable date, time, and weather conditions.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Open Prediction Engine</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Analyze */}
          <div
            onClick={() => onNavigate("analytics")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs traffic-card cursor-pointer group"
          >
            <div className="p-3 w-fit rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Analyze</h3>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Discover traffic patterns across time and locations through hourly volume distributions, daily trends, peak-period windows, and 24x7 heatmaps.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Analytics</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Understand */}
          <div
            onClick={() => onNavigate("models")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs traffic-card cursor-pointer group"
          >
            <div className="p-3 w-fit rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Understand</h3>
              <MetricBadge type="PREDICTION" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Identify the factors associated with traffic variation via feature importance rankings, pipeline visualization, and interactive ML experiment retraining.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>View Model Insights</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* System Disclosure Banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-200">Factual Transparency Note: </span>
          <span>Predictions are ML-generated estimates derived from historical training data, not real-time live feeds or guaranteed real-world values.</span>
        </div>
        <button
          onClick={() => onNavigate("dataset")}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View Dataset Provenance →
        </button>
      </div>
    </div>
  );
};
