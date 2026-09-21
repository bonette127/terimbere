import React from "react";
import { Language, User } from "../types";
import { getTranslation } from "../i18n";
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  Receipt,
  CalendarCheck,
  TrendingUp,
  Bot,
  GraduationCap,
  LineChart,
  ShoppingBag,
  Layers,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export type NavTab = 
  | "dashboard" 
  | "farms" 
  | "plans" 
  | "expenses" 
  | "activities" 
  | "harvestSales" 
  | "profit" 
  | "cycleReport"
  | "analytics"
  | "aiAdvisor" 
  | "training" 
  | "marketWeather"
  | "admin";

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  currentUser: User | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  language,
  currentUser,
}) => {
  const t = getTranslation(language);

  const tabs: Array<{ id: NavTab; label: string; icon: React.ReactNode; highlight?: boolean; adminOnly?: boolean }> = [
    { id: "dashboard", label: t.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "farms", label: t.myFarms, icon: <MapPin className="w-4 h-4" /> },
    { id: "plans", label: t.farmPlan, icon: <ClipboardList className="w-4 h-4" /> },
    { id: "expenses", label: t.expenses, icon: <Receipt className="w-4 h-4" /> },
    { id: "activities", label: t.activities, icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "harvestSales", label: t.harvestSales, icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "profit", label: t.profit, icon: <TrendingUp className="w-4 h-4" /> },
    { 
      id: "cycleReport", 
      label: language === "rw" ? "Inzira & Ibihembwe" : "Cycle & Seasons", 
      icon: <Layers className="w-4 h-4" /> 
    },
    { 
      id: "analytics", 
      label: language === "rw" ? "Isesengura" : "Analytics", 
      icon: <BarChart3 className="w-4 h-4" /> 
    },
    { id: "aiAdvisor", label: t.aiAdvisor, icon: <Bot className="w-4 h-4" />, highlight: true },
    { id: "training", label: t.training, icon: <GraduationCap className="w-4 h-4" /> },
    { id: "marketWeather", label: t.marketWeather, icon: <LineChart className="w-4 h-4" /> },
    { 
      id: "admin", 
      label: language === "rw" ? "Ubuyobozi (Admin)" : "Admin Dashboard", 
      icon: <ShieldCheck className="w-4 h-4" />,
      adminOnly: false 
    },
  ];

  return (
    <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-16 sm:top-20 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const isAdminTab = tab.id === "admin";
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? isAdminTab
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs"
                      : tab.highlight
                      ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm"
                      : "bg-emerald-800 text-white shadow-xs"
                    : isAdminTab
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300/80 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                    : tab.highlight
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 hover:bg-emerald-100"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {isAdminTab && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-stone-950 font-black rounded-sm">
                    KEY
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
