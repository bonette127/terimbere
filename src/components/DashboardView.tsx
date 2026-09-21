import React from "react";
import {
  Farm,
  FarmPlan,
  Expense,
  FarmActivity,
  HarvestRecord,
  SaleRecord,
  Language,
} from "../types";
import { getTranslation } from "../i18n";
import {
  MapPin,
  TrendingUp,
  Receipt,
  CalendarCheck,
  Bot,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  CloudSun,
  Banknote,
} from "lucide-react";
import { NavTab } from "./Navigation";

interface DashboardViewProps {
  farms: Farm[];
  plans: FarmPlan[];
  expenses: Expense[];
  activities: FarmActivity[];
  harvests: HarvestRecord[];
  sales: SaleRecord[];
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onQuickAiPrompt: (promptText: string) => void;
  onCompleteActivity: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farms,
  plans,
  expenses,
  activities,
  harvests,
  sales,
  language,
  onNavigate,
  onQuickAiPrompt,
  onCompleteActivity,
}) => {
  const t = getTranslation(language);

  // Calculations
  const totalAreaHa = farms.reduce((acc, f) => acc + f.sizeHa, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmountRwf, 0);
  const totalExpectedRevenue = plans.reduce((acc, p) => acc + p.expectedGrossRevenue, 0);
  const netProfitRealized = totalSalesRevenue - totalExpenses;
  const roi = totalExpenses > 0 ? Math.round((netProfitRealized / totalExpenses) * 100) : 0;

  const urgentActivities = activities.filter((a) => a.status !== "completed").slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-emerald-700/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-700/20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Rwanda Agri Intelligence • {t.currentSeasonBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.overviewTitle}
              </h1>
              <p className="mt-2 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                {t.overviewSubtitle}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => onNavigate("expenses")}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-xs"
              >
                <Receipt className="w-4 h-4 text-emerald-700" />
                <span>{t.quickAddExpense}</span>
              </button>
              <button
                onClick={() => onNavigate("activities")}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border border-emerald-500/50 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-amber-300" />
                <span>{t.quickLogActivity}</span>
              </button>
              <button
                onClick={() => onNavigate("harvestSales")}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                <Banknote className="w-4 h-4 text-stone-950" />
                <span>{t.quickRecordHarvest}</span>
              </button>
            </div>
          </div>

          {/* AI Agronomist Instant Prompt Bar */}
          <div className="mt-6 pt-6 border-t border-emerald-700/50">
            <div className="bg-emerald-950/70 border border-emerald-600/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Umujyanama w'Ubuhinzi (AI)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-800 text-emerald-200">
                      RAB Certified
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 font-medium">
                    “Mfite amafaranga 500,000 RWF. Ndashaka guhinga ibirayi kuri hegitari 0.5. Mwamfasha gukora gahunda?”
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  onQuickAiPrompt(
                    "Mfite amafaranga 500,000 RWF. Ndashaka guhinga ibirayi kuri hegitari 0.5. Mwamfasha gukora gahunda?"
                  )
                }
                className="shrink-0 w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === "rw" ? "Tegura iyi gahunda ubu" : "Generate this Farm Plan"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Farm Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Farms */}
        <div 
          onClick={() => onNavigate("farms")}
          className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t.activeFarmsCount}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-stone-900">
            {farms.length}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {totalAreaHa.toFixed(1)} {t.hectares} {t.total}
          </p>
        </div>

        {/* Expenses Spent */}
        <div 
          onClick={() => onNavigate("expenses")}
          className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t.totalInvestment}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-stone-900">
            {totalExpenses.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
          </div>
          <p className="text-xs text-amber-700 font-medium mt-1">
            {expenses.length} {language === "rw" ? "ibyakozwe byanditswe" : "entries logged"}
          </p>
        </div>

        {/* Realized Sales */}
        <div 
          onClick={() => onNavigate("harvestSales")}
          className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t.actualSales}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-stone-900">
            {totalSalesRevenue.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {language === "rw" ? "Yinjiye kuri MoMo & Cash" : "Cash & MoMo received"}
          </p>
        </div>

        {/* Net Profit / Margin */}
        <div 
          onClick={() => onNavigate("profit")}
          className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t.netProfit}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-xl sm:text-2xl font-black ${netProfitRealized >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {netProfitRealized > 0 ? "+" : ""}{netProfitRealized.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
          </div>
          <p className="text-xs font-bold text-emerald-800 mt-1">
            ROI: {roi}%
          </p>
        </div>
      </div>

      {/* Main Grid: Urgent Tasks + Market & Weather Quick Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Activities (2 columns on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {t.urgentTasks}
              </h2>
            </div>
            <button
              onClick={() => onNavigate("activities")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              {t.all} ({activities.length}) →
            </button>
          </div>

          {urgentActivities.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">
              Nta gikorwa cyihutirwa gitegerejwe muri uyu murima!
            </div>
          ) : (
            <div className="space-y-2.5">
              {urgentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onCompleteActivity(act.id)}
                      title={act.status === "completed" ? "Completed" : "Mark complete"}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        act.status === "completed"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-stone-300 hover:border-emerald-600 text-transparent"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                        {act.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500">
                        <span className="font-medium text-emerald-800">{act.farmName}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{act.dueDate}</span>
                        </span>
                        {act.assignedTo && (
                          <>
                            <span>•</span>
                            <span>{act.assignedTo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      act.status === "in_progress"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {act.status === "in_progress" ? t.statusInProgress : t.statusPending}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Rwandan Weather & Market snippet */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-5">
          {/* Weather Widget */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  {t.weatherTitle}
                </h3>
              </div>
              <button
                onClick={() => onNavigate("marketWeather")}
                className="text-xs font-bold text-emerald-700"
              >
                {t.all} →
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900">Musanze (Amajyaruguru)</span>
                  <div className="text-2xl font-black text-stone-900 mt-0.5">19°C</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                    Imvura 14mm
                  </span>
                  <p className="text-xs text-stone-600 mt-1">Ubukonje: 82%</p>
                </div>
              </div>
              <p className="text-xs text-emerald-900 mt-2 font-medium bg-white/70 p-2 rounded-lg border border-emerald-100">
                🌱 Inama: Ikirere cyiza cyo gutera imbuto y'ibirayi. Irinde gutera imiti mbere y'imvura.
              </p>
            </div>
          </div>

          {/* Market Price Snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900">
                {language === "rw" ? "Ibiciro by'uyu munsi" : "Today's Market Prices"}
              </h3>
              <span className="text-[10px] text-stone-400">Kimironko & Musanze</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-semibold text-stone-800">Ibirayi (Kinigi) - Kigali</span>
                <span className="font-bold text-emerald-700">340 RWF/kg ↑</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-semibold text-stone-800">Ibigori byumye - Nyabugogo</span>
                <span className="font-bold text-emerald-700">420 RWF/kg ↑</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-semibold text-stone-800">Ibishyimbo bitukura - Huye</span>
                <span className="font-bold text-emerald-700">920 RWF/kg ↑</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
