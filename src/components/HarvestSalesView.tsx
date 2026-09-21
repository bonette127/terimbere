import React, { useState } from "react";
import { Farm, HarvestRecord, Language, SaleRecord } from "../types";
import { getTranslation } from "../i18n";
import {
  ShoppingBag,
  Plus,
  Trash2,
  TrendingUp,
  PackageCheck,
  CreditCard,
  Building2,
  Coins,
  Warehouse,
} from "lucide-react";

interface HarvestSalesViewProps {
  harvests: HarvestRecord[];
  sales: SaleRecord[];
  farms: Farm[];
  language: Language;
  onAddHarvest: (harvest: Omit<HarvestRecord, "id">) => void;
  onAddSale: (sale: Omit<SaleRecord, "id">) => void;
  onDeleteHarvest: (id: string) => void;
  onDeleteSale: (id: string) => void;
}

export const HarvestSalesView: React.FC<HarvestSalesViewProps> = ({
  harvests,
  sales,
  farms,
  language,
  onAddHarvest,
  onAddSale,
  onDeleteHarvest,
  onDeleteSale,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<"sales" | "harvests">("sales");
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Harvest form
  const [hFarmId, setHFarmId] = useState(farms[0]?.id || "");
  const [hCrop, setHCrop] = useState("Ibirayi (Kinigi)");
  const [hDate, setHDate] = useState(new Date().toISOString().split("T")[0]);
  const [hQty, setHQty] = useState("");
  const [hGrade, setHGrade] = useState<"A" | "B" | "C">("A");
  const [hLocation, setHLocation] = useState("Ububiko bwa Kinigi Center");

  // Sale form
  const [sFarmId, setSFarmId] = useState(farms[0]?.id || "");
  const [sCrop, setSCrop] = useState("Ibirayi (Kinigi)");
  const [sDate, setSDate] = useState(new Date().toISOString().split("T")[0]);
  const [sBuyerName, setSBuyerName] = useState("");
  const [sBuyerType, setSBuyerType] = useState<"cooperative" | "wholesaler" | "local_market" | "retail">("wholesaler");
  const [sQty, setSQty] = useState("");
  const [sPrice, setSPrice] = useState("300");
  const [sPayment, setSPayment] = useState<"momo" | "airtel" | "cash" | "bank">("momo");
  const [sNotes, setSNotes] = useState("");

  // Inventory & Totals
  const totalHarvestedKg = harvests.reduce((acc, h) => acc + h.quantityKg, 0);
  const totalSoldKg = sales.reduce((acc, s) => acc + s.quantityKg, 0);
  const inStockKg = Math.max(0, totalHarvestedKg - totalSoldKg);
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmountRwf, 0);
  const avgSellingPrice = totalSoldKg > 0 ? Math.round(totalSalesRevenue / totalSoldKg) : 0;

  const handleHarvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hQty || isNaN(Number(hQty))) return;

    const farm = farms.find((f) => f.id === hFarmId) || farms[0];
    onAddHarvest({
      farmId: farm ? farm.id : "farm-1",
      farmName: farm ? farm.name : "Umurima",
      crop: hCrop,
      harvestDate: hDate,
      quantityKg: parseFloat(hQty),
      qualityGrade: hGrade,
      storageLocation: hLocation.trim() || "Ububiko",
    });

    setHQty("");
    setIsHarvestModalOpen(false);
  };

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(sQty);
    const price = parseFloat(sPrice);
    if (isNaN(qty) || isNaN(price)) return;

    onAddSale({
      farmId: sFarmId || (farms[0]?.id ?? "farm-1"),
      crop: sCrop,
      saleDate: sDate,
      buyerName: sBuyerName.trim() || "Umuguzi",
      buyerType: sBuyerType,
      quantityKg: qty,
      unitPriceRwf: price,
      totalAmountRwf: Math.round(qty * price),
      paymentMethod: sPayment,
      notes: sNotes.trim() || undefined,
    });

    setSBuyerName("");
    setSQty("");
    setIsSaleModalOpen(false);
  };

  const buyerLabels = {
    cooperative: t.buyerCoop,
    wholesaler: t.buyerWholesale,
    local_market: t.buyerMarket,
    retail: t.buyerRetail,
  };

  const paymentLabels = {
    momo: t.momo,
    airtel: t.airtel,
    cash: t.cash,
    bank: t.bank,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.harvestTitle}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {t.harvestSubtitle}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsHarvestModalOpen(true)}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-colors"
          >
            <PackageCheck className="w-4 h-4 text-emerald-800" />
            <span>{t.recordHarvest}</span>
          </button>
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>{t.recordSale}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.harvestedQty}
          </span>
          <div className="text-2xl font-black text-stone-900 mt-1">
            {totalHarvestedKg.toLocaleString()} <span className="text-sm font-bold text-stone-500">Kg</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {(totalHarvestedKg / 1000).toFixed(1)} {t.tons} yasaruwe yose
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.soldQty}
          </span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {totalSoldKg.toLocaleString()} <span className="text-sm font-bold text-stone-500">Kg</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Mpuzandengo: {avgSellingPrice} RWF/kg
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.remainingStock}
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1 flex items-center space-x-1.5">
            <Warehouse className="w-5 h-5 text-amber-600" />
            <span>{inStockKg.toLocaleString()}</span>
            <span className="text-sm font-bold text-stone-500">Kg</span>
          </div>
          <p className="text-xs text-amber-800 mt-1 font-medium">
            Bitegereje kugurishwa mu bubiko
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            {t.revenueTotal}
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {totalSalesRevenue.toLocaleString()} <span className="text-sm font-bold text-stone-500">RWF</span>
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-1">
            Amafaranga yinjiye kuri MoMo & Cash
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "sales"
              ? "border-emerald-800 text-emerald-900"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {language === "rw" ? "Ibicuruzwa Byagurishijwe (Sales)" : "Sales Transactions"} ({sales.length})
        </button>
        <button
          onClick={() => setActiveTab("harvests")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "harvests"
              ? "border-emerald-800 text-emerald-900"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {language === "rw" ? "Umusaruro Wasaruwe (Harvests)" : "Harvest Log"} ({harvests.length})
        </button>
      </div>

      {/* Sales Tab Content */}
      {activeTab === "sales" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {sales.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              Nta kintu kiragurishwa muri iki gihembwe.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">{t.date}</th>
                    <th className="px-5 py-3.5">{t.buyer}</th>
                    <th className="px-5 py-3.5">{t.cropName}</th>
                    <th className="px-5 py-3.5 text-right">{t.soldQty}</th>
                    <th className="px-5 py-3.5 text-right">Igiciro (RWF/kg)</th>
                    <th className="px-5 py-3.5 text-right">{t.total} (RWF)</th>
                    <th className="px-5 py-3.5 text-center">{t.paymentMethod}</th>
                    <th className="px-5 py-3.5 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-stone-600">
                        {sale.saleDate}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-stone-900 text-xs">{sale.buyerName}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600">
                          {buyerLabels[sale.buyerType] || sale.buyerType}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-emerald-900 text-xs">
                        {sale.crop}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right font-bold text-stone-800">
                        {sale.quantityKg.toLocaleString()} {t.kg}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right font-medium text-stone-600">
                        {sale.unitPriceRwf} RWF
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right font-black text-emerald-800">
                        {sale.totalAmountRwf.toLocaleString()} RWF
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <Coins className="w-3 h-3 text-amber-600" />
                          <span>{paymentLabels[sale.paymentMethod] || sale.paymentMethod}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => onDeleteSale(sale.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Harvests Tab Content */}
      {activeTab === "harvests" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {harvests.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              Nta musaruro urandikwa.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">{t.date}</th>
                    <th className="px-5 py-3.5">{t.farmName}</th>
                    <th className="px-5 py-3.5">{t.cropName}</th>
                    <th className="px-5 py-3.5 text-right">{t.harvestedQty}</th>
                    <th className="px-5 py-3.5 text-center">Icyiciro (Grade)</th>
                    <th className="px-5 py-3.5">Aho bihunitse (Location)</th>
                    <th className="px-5 py-3.5 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {harvests.map((h) => (
                    <tr key={h.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-stone-600">
                        {h.harvestDate}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-xs text-stone-900">
                        {h.farmName}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-emerald-900 text-xs">
                        {h.crop}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right font-black text-stone-900">
                        {h.quantityKg.toLocaleString()} {t.kg}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                          Grade {h.qualityGrade}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-stone-600 font-medium">
                        {h.storageLocation}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => onDeleteHarvest(h.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Record Harvest Modal */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">{t.recordHarvest}</h3>
              <button
                onClick={() => setIsHarvestModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHarvestSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Umurima (Farm)
                </label>
                <select
                  value={hFarmId}
                  onChange={(e) => setHFarmId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white outline-hidden"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Igihingwa (Crop)
                  </label>
                  <input
                    type="text"
                    required
                    value={hCrop}
                    onChange={(e) => setHCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Itariki yo gusarura
                  </label>
                  <input
                    type="date"
                    required
                    value={hDate}
                    onChange={(e) => setHDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ibiro byasaruwe (Kg) *
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    placeholder="8000"
                    value={hQty}
                    onChange={(e) => setHQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ubuziranenge (Grade)
                  </label>
                  <select
                    value={hGrade}
                    onChange={(e) => setHGrade(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white outline-hidden font-bold"
                  >
                    <option value="A">Grade A (Ibyiza cyane - Premium)</option>
                    <option value="B">Grade B (Biringaniye - Standard)</option>
                    <option value="C">Grade C (Bitoya - Small)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Aho bihunitswe (Storage facility)
                </label>
                <input
                  type="text"
                  value={hLocation}
                  onChange={(e) => setHLocation(e.target.value)}
                  placeholder="Urugero: Ububiko bwa Kinigi Center"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Sale Modal */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">{t.recordSale}</h3>
              <button
                onClick={() => setIsSaleModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.buyer} (Izina ry'umuguzi cyangwa Koperative) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Urugero: Koperative y'Abacuruzi b'Ibirayi i Kigali"
                  value={sBuyerName}
                  onChange={(e) => setSBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ubwoko bw'umuguzi
                  </label>
                  <select
                    value={sBuyerType}
                    onChange={(e) => setSBuyerType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white outline-hidden"
                  >
                    <option value="wholesaler">{t.buyerWholesale}</option>
                    <option value="cooperative">{t.buyerCoop}</option>
                    <option value="local_market">{t.buyerMarket}</option>
                    <option value="retail">{t.buyerRetail}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Igihingwa (Crop)
                  </label>
                  <input
                    type="text"
                    required
                    value={sCrop}
                    onChange={(e) => setSCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ibiro byagurishijwe (Kg) *
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    placeholder="3000"
                    value={sQty}
                    onChange={(e) => setSQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Igiciro ku kilo (RWF/kg) *
                  </label>
                  <input
                    type="number"
                    step="5"
                    required
                    placeholder="300"
                    value={sPrice}
                    onChange={(e) => setSPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl font-bold outline-hidden text-emerald-800"
                  />
                </div>
              </div>

              {sQty && sPrice && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                  <span className="font-semibold text-emerald-900">Amafaranga yose yakiriwe:</span>
                  <span className="font-black text-sm text-emerald-900">
                    {(parseFloat(sQty) * parseFloat(sPrice)).toLocaleString()} RWF
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.paymentMethod}
                  </label>
                  <select
                    value={sPayment}
                    onChange={(e) => setSPayment(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white outline-hidden"
                  >
                    <option value="momo">{t.momo}</option>
                    <option value="airtel">{t.airtel}</option>
                    <option value="cash">{t.cash}</option>
                    <option value="bank">{t.bank}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.date}
                  </label>
                  <input
                    type="date"
                    required
                    value={sDate}
                    onChange={(e) => setSDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsSaleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
