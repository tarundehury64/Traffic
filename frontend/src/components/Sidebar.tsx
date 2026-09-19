import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  MapPin,
  Cpu,
  Database,
  AlertOctagon,
  Info,
  Compass,
  GraduationCap
} from "lucide-react";

export type NavTab =
  | "landing"
  | "dashboard"
  | "prediction"
  | "analytics"
  | "locations"
  | "models"
  | "dataset"
  | "anomalies"
  | "about";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileNavOpen,
  onCloseMobileNav
}) => {
  const navItems: NavItem[] = [
    { id: "landing", label: "Overview", icon: <Compass className="w-4 h-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "prediction", label: "Traffic Prediction", icon: <Sparkles className="w-4 h-4" /> },
    { id: "analytics", label: "Traffic Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "locations", label: "Locations", icon: <MapPin className="w-4 h-4" /> },
    { id: "models", label: "Model Performance", icon: <Cpu className="w-4 h-4" /> },
    { id: "dataset", label: "Dataset", icon: <Database className="w-4 h-4" />, badge: "48K" },
    { id: "anomalies", label: "Unusual Patterns", icon: <AlertOctagon className="w-4 h-4" /> },
    { id: "about", label: "About Project", icon: <Info className="w-4 h-4" /> }
  ];

  const handleNav = (id: NavTab) => {
    onSelectTab(id);
    onCloseMobileNav();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors">
        <div className="space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Navigation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Academic Project Footnote */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Academic AI/ML Project</span>
          </div>
          <p className="leading-tight">
            2nd-Year B.Tech Viva Demonstration. Data sourced from authentic UCI Repository.
          </p>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileNavOpen && (
        <div
          onClick={onCloseMobileNav}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col justify-between ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 dark:text-slate-300">TrafficFlow AI</p>
          <p className="text-[10px]">Academic Machine Learning System</p>
        </div>
      </div>
    </>
  );
};
