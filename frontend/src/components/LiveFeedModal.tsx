import React from "react";
import { X, Radio, AlertTriangle, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { MetricBadge } from "./MetricBadge";

interface LiveFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveFeedModal: React.FC<LiveFeedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                LIVE DATA NOT CONNECTED
              </h3>
              <MetricBadge type="LIVE API" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live Sensor Feed Telemetry Status
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 leading-relaxed mb-5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Factual Integrity Policy</p>
            <p>
              “This deployment currently operates using historical datasets. Connect an authorized real-time traffic data source to enable live monitoring.”
            </p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-400">
              The system strictly avoids fabricating live telemetry streams or simulating random mock cars as "live".
            </p>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-950 mb-5">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Production Integration Pipeline Architecture
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center w-full sm:w-auto">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Municipal ATR / CCTV</p>
              <p className="text-[10px] text-slate-500">Sensor Loop Hardware</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center w-full sm:w-auto">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Kafka / MQTT Broker</p>
              <p className="text-[10px] text-slate-500">5-min Telemetry Stream</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="p-2.5 rounded border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-center w-full sm:w-auto">
              <p className="font-semibold text-blue-700 dark:text-blue-300">TrafficFlow AI Engine</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400">Model Inference / Alert</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Authentic UCI Historical Engine Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-md font-medium text-xs transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
