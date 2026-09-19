import React from "react";
import { NavTab } from "./Sidebar";
import { ExternalLink, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenLiveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLiveModal }) => {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 px-4 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">
            TrafficFlow AI · Academic AI/ML Project
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            2nd-Year B.Tech Viva Demonstration Platform · Not affiliated with municipal traffic authorities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 font-medium text-[11px]">
          <button
            onClick={() => onNavigate("dataset")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Dataset Source
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate("about")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Methodology
          </button>
          <span>·</span>
          <a
            href="https://archive.ics.uci.edu/dataset/492/metro+interstate+traffic+volume"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
          >
            <span>UCI Provenance</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>·</span>
          <button
            onClick={() => onNavigate("about")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            About
          </button>
        </div>
      </div>
    </footer>
  );
};
