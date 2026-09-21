import React from "react";
import { Expense, HarvestRecord, Language, SaleRecord } from "../types";
import { getTranslation } from "../i18n";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Scale,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Coins,
} from "lucide-react";

interface ProfitAnalyticsViewProps {
  expenses: Expense[];
  harvests: HarvestRecord[];
  sales: SaleRecord[];
  language: Language;
}

export const ProfitAnalyticsView: React.FC<ProfitAnalyticsViewProps> = ({
  expenses,
  harvests,
  sales,
  language,
}) => {
  const t = getTranslation(language);

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmountRwf, 0);
  const netProfit = totalRevenue - totalExpenses;
  const roi = totalExpenses > 0 ? Math.round((netProfit / totalExpenses) * 100) : 0;

  const totalHarvestedKg = harvests.reduce((acc, h) => acc + h.quantityKg, 0);
  const totalSoldKg = sales.reduce((acc, s) => acc + s.quantityKg, 0);

  // Production cost per kg produced
  const costPerKg = totalHarvestedKg > 0 ? Math.round(totalExpenses / totalHarvestedKg) : 0;
  // Average selling price per kg sold
  const avgSellingPrice = totalSoldKg > 0 ? Math.round(totalRevenue / totalSoldKg) : 0;
  const marginPerKg = avgSellingPrice - costPerKg;

  // Expenses by category
  const categories = [
    { key: "seeds", label: t.expenseSeeds, color: "bg-emerald-600" },
    { key: "fertilizer", label: t.expenseFertilizer, color: "bg-teal-600" },
    { key: "labor", label: t.expenseLabor, color: "bg-amber-600" },
    { key: "pesticides", label: t.expensePesticides, color: "bg-blue-600" },
    { key: "transport", label: t.expenseTransport, color: "bg-purple-600" },
    { key: "other", label: t.expenseOther, color: "bg-stone-500" },
  ];

  const categoryTotals = categories.map((cat) => {
    const amount = expenses
      .filter((e) => e.category === cat.key)
      .reduce((acc, e) => acc + e.amount, 0);
    const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
    return { ...cat, amount, pct };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">
          {t.profitTitle}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {t.profitSubtitle}
        </p>
      </div>

      {/* Main P&L Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.grossRevenue}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            {totalSoldKg.toLocaleString()} Kg {t.sold}
          </span>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.totalInvestment}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {totalExpenses.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-stone-600 mt-2 bg-stone-100 px-2 py-0.5 rounded-md">
            {expenses.length} inyemezabwishyu
          </span>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.netProfit}
          </span>
          <div className={`text-2xl sm:text-3xl font-black mt-1 ${netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
            {netProfit >= 0 ? "+" : ""}{netProfit.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
          </div>
          <span
            className={`inline-flex items-center text-xs font-bold mt-2 px-2 py-0.5 rounded-md ${
              netProfit >= 0 ? "text-emerald-800 bg-emerald-50" : "text-rose-800 bg-rose-50"
            }`}
          >
            ROI: {roi}%
          </span>
        </div>

        {/* Profit per Kg */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Inyungu ku Kilo (Margin/Kg)
          </span>
          <div className={`text-2xl sm:text-3xl font-black mt-1 ${marginPerKg >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
            {marginPerKg >= 0 ? "+" : ""}{marginPerKg} <span className="text-xs font-bold text-stone-500">RWF/kg</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Ikiguzi: <strong>{costPerKg} RWF</strong> | Igurishwa: <strong>{avgSellingPrice} RWF</strong>
          </p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Structure & Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-stone-900">
              {language === "rw" ? "Uko amafaranga yakoreshejwe (Cost Breakdown)" : "Cost Distribution"}
            </h3>
          </div>

          <div className="space-y-3">
            {categoryTotals.map((cat) => (
              <div key={cat.key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-700">
                  <span>{cat.label}</span>
                  <span>
                    {cat.amount.toLocaleString()} RWF ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600 space-y-1">
            <span className="font-bold text-stone-900 block">💡 Isesengura rya TERIMBERE:</span>
            <p>
              Amafaranga menshi yagiye mu <strong>mbuto</strong> n'<strong>ifumbire</strong> (65%), ibi ni ibisanzwe kandi byiza mu buhinzi bw'umwuga buzahesha umusaruro mwinshi ugereranyije no gukoresha imbuto itizewe.
            </p>
          </div>
        </div>

        {/* Rwandan Agriculture Benchmarking */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-stone-900">
              {language === "rw" ? "Ugereranyije n'ibipimo bya RAB mu Rwanda" : "Rwanda Ag Benchmark"}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">
                  Ikiguzi cyo guhinga ikilo kimwe (Cost/Kg): {costPerKg} RWF
                </span>
                <p className="text-stone-600 mt-0.5">
                  Mu misozi miremire ya Musanze na Nyabihu, ikiguzi cy'ibirayi kiri hagati ya 120 - 160 RWF/kg. Ikiguzi cyawe cya {costPerKg} RWF kiri mu rugero rwiza rw'ubuhinzi butanga inyungu.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-teal-950 block">
                  Igiciro cyo kugurisha (Selling Price): {avgSellingPrice} RWF/kg
                </span>
                <p className="text-stone-600 mt-0.5">
                  Ugurisheje koperative cyangwa abacuruzi banini ku giciro cya {avgSellingPrice} RWF, usigarana inyungu ya {marginPerKg} RWF kuri buri kilo.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 block">
                  Inama yo kongera inyungu (Profit Maximization):
                </span>
                <p className="text-stone-700 mt-0.5">
                  Kugumisha igice cy'umusaruro mu bubiko (Cold storage cyangwa DPC) mu byumweru 3 kugeza kuri 4 nyuma y'isarura ry'abandi bose bishobora gutuma igiciro cyiyongeraho 40-70 RWF kuri buri kilo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
