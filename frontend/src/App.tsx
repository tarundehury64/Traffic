import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar, NavTab } from "./components/Sidebar";
import { LiveFeedModal } from "./components/LiveFeedModal";
import { Footer } from "./components/Footer";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PredictionPage } from "./pages/PredictionPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { LocationsPage } from "./pages/LocationsPage";
import { ModelPerformancePage } from "./pages/ModelPerformancePage";
import { DatasetPage } from "./pages/DatasetPage";
import { AnomaliesPage } from "./pages/AnomaliesPage";
import { AboutPage } from "./pages/AboutPage";

// Icons for Mobile Bottom Navigation Bar
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  MapPin,
  Cpu,
  Database,
  Compass
} from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(false);

  // Sync theme with DOM class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const renderActivePage = () => {
    switch (activeTab) {
      case "landing":
        return <LandingPage onNavigate={setActiveTab} />;
      case "dashboard":
        return <DashboardPage onNavigate={setActiveTab} />;
      case "prediction":
        return <PredictionPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "locations":
        return <LocationsPage />;
      case "models":
        return <ModelPerformancePage />;
      case "dataset":
        return <DatasetPage />;
      case "anomalies":
        return <AnomaliesPage />;
      case "about":
        return <AboutPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        modelStatus="Ready"
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenLiveModal={() => setIsLiveModalOpen(true)}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />

      {/* Main Body Container: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isMobileNavOpen={isMobileNavOpen}
          onCloseMobileNav={() => setIsMobileNavOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 flex items-center justify-around text-[10px]">
        {[
          { id: "dashboard" as NavTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "prediction" as NavTab, label: "Predict", icon: <Sparkles className="w-4 h-4" /> },
          { id: "analytics" as NavTab, label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "models" as NavTab, label: "Models", icon: <Cpu className="w-4 h-4" /> },
          { id: "dataset" as NavTab, label: "Data", icon: <Database className="w-4 h-4" /> }
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1 rounded font-medium transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Feed Status Modal */}
      <LiveFeedModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} onOpenLiveModal={() => setIsLiveModalOpen(true)} />
    </div>
  );
}

export default App;
