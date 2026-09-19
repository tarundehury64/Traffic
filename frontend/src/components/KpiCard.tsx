import React from "react";
import { MetricBadge } from "./MetricBadge";
import { BadgeType } from "../types";

interface KpiCardProps {
  title: string;
  value: string;
  badge: BadgeType;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  badge,
  subtitle,
  icon,
  trend,
  trendPositive
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs traffic-card flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {icon}
        </div>
        <MetricBadge type={badge} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1 tracking-tight">
          {value}
        </h3>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{subtitle}</span>
        {trend && (
          <span
            className={`font-semibold ${
              trendPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
