import React from "react";
import { Radio, Moon, Sun, Menu, X, ShieldCheck, Activity } from "lucide-react";

interface NavbarProps {
  modelStatus: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenLiveModal: () => void;
  isMobileNavOpen: boolean;
  onToggleMobileNav: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  modelStatus,
  isDark,
  onToggleTheme,
  onOpenLiveModal,
  isMobileNavOpen,
  onToggleMobileNav
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  TrafficFlow AI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                  v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                AI-powered vehicle flow analysis and prediction
              </p>
            </div>
          </div>
        </div>

        {/* Right: Status indicator, Live feed button, Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Model Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Model Status: <span className="font-semibold text-slate-900 dark:text-white">{modelStatus}</span>
            </span>
          </div>

          {/* Live Feed Status Button */}
          <button
            onClick={onOpenLiveModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs font-medium transition-colors"
            title="Inspect Live Feed Connection Status"
          >
            <Radio className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden xs:inline font-mono">LIVE FEED:</span>
            <span className="font-semibold text-[11px]">DISCONNECTED</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
