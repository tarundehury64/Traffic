import React, { useEffect, useState } from "react";
import { MapPin, MapPinOff, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, RefreshCw, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MetricBadge } from "../components/MetricBadge";
import { api } from "../api/client";
import { LocationCard } from "../types";

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<LocationCard[]>([]);
  const [geoInfo, setGeoInfo] = useState<{ available: boolean; message: string; detail: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getLocations()
      .then((data) => {
        setLocations(data.locations);
        setGeoInfo(data.geographic_data);
      })
      .catch((err) => console.error("Could not load locations", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading monitored location profiles...</p>
      </div>
    );
  }

  const chartData = locations.map((loc) => ({
    name: loc.name.split("(")[0].trim(),
    fullName: loc.name,
    average: loc.average_traffic,
    peak: loc.peak_traffic,
    lowest: loc.lowest_traffic
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Monitored Locations & Corridor Segments
          </h1>
          <MetricBadge type="DATASET" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comparative volume, operational capacity, and historical metrics across monitored stations and arterial branches.
        </p>
      </div>

      {/* Mandatory Geographic Notice Banner (Section 9 & 10) */}
      <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <MapPinOff className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Map unavailable — this dataset does not contain geographic coordinates.
              </h2>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
              In accordance with scientific and factual transparency policies, this system will NOT invent or plot fabricated GPS coordinates on a simulated map. The authentic UCI Metro Interstate Traffic Volume dataset provides temporal vehicle loop counts from Minnesota DOT ATR Station 301 on westbound I-94, but does not provide row-level latitude and longitude coordinates.
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
              Below is the verified non-geographical location comparison chart and detailed telemetry profile cards.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Geographical Location Comparison Chart (Section 9) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Non-Geographical Location Comparison Chart
              </h3>
              <MetricBadge type="DATASET" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical and derived average vs peak volume comparison across segments
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                angle={-10}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow text-xs space-y-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{d.fullName}</p>
                        <p className="text-blue-600 font-semibold">
                          Average Flow: {d.average.toLocaleString()} vehicles/hr
                        </p>
                        <p className="text-rose-600 font-semibold">
                          Peak Capacity: {d.peak.toLocaleString()} vehicles/hr
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="average" name="Average Flow" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="peak" name="Peak Volume" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Cards Grid (Section 9) */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
          Individual Corridor Profiles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs traffic-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <MetricBadge type="DATASET" />
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {loc.name}
                </h4>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  {loc.type}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {loc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Records:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      {loc.total_records.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Average Traffic:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {loc.average_traffic.toLocaleString()} veh/hr
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Peak Traffic:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {loc.peak_traffic.toLocaleString()} veh/hr
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lowest Traffic:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {loc.lowest_traffic.toLocaleString()} veh/hr
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Traffic Trend:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {loc.traffic_trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
