import React, { useState } from "react";
import { Farm, Language } from "../types";
import { getTranslation } from "../i18n";
import {
  MapPin,
  Plus,
  Trash2,
  Sprout,
  Droplets,
  Layers,
  X,
  Check,
} from "lucide-react";

interface FarmsViewProps {
  farms: Farm[];
  language: Language;
  onAddFarm: (farm: Omit<Farm, "id" | "createdAt">) => void;
  onDeleteFarm: (id: string) => void;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  farms,
  language,
  onAddFarm,
  onDeleteFarm,
}) => {
  const t = getTranslation(language);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("Musanze");
  const [sector, setSector] = useState("Kinigi");
  const [sizeHa, setSizeHa] = useState("0.5");
  const [soilType, setSoilType] = useState("Ubutaka bw'Amakoro (Volcanic)");
  const [irrigationType, setIrrigationType] = useState<"rainfed" | "irrigated" | "swamp">("rainfed");
  const [mainCropsInput, setMainCropsInput] = useState("Ibirayi, Ibishyimbo");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const crops = mainCropsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    onAddFarm({
      name: name.trim(),
      district,
      sector: sector.trim(),
      sizeHa: parseFloat(sizeHa) || 0.5,
      soilType,
      irrigationType,
      mainCrops: crops.length > 0 ? crops : ["Ibirayi"],
      notes: notes.trim(),
    });

    setName("");
    setNotes("");
    setIsModalOpen(false);
  };

  const rwandanDistricts = [
    "Musanze", "Nyabihu", "Rubavu", "Burera", "Gicumbi", "Rulindo", 
    "Nyagatare", "Gatsibo", "Kayonza", "Rwamagana", "Kirehe", "Ngoma", "Bugesera",
    "Huye", "Nyamagabe", "Nyanza", "Ruhango", "Muhanga", "Kamonyi", "Gisagara",
    "Gasabo", "Kicukiro", "Nyarugenge", "Karongi", "Rutsiro", "Nyamasheke", "Rusizi"
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.farmsTitle}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {t.farmsSubtitle}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addFarm}</span>
        </button>
      </div>

      {/* Farms Grid */}
      {farms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300">
          <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-600 font-medium text-base">{t.noFarmsYet}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-sm font-bold"
          >
            {t.addFarm}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 leading-tight">
                        {farm.name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {farm.district}, Umurenge wa {farm.sector}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteFarm(farm.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Pills */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block font-medium">{t.landSize}</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {farm.sizeHa} {t.hectares}
                    </span>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block font-medium">{t.irrigation}</span>
                    <span className="font-bold text-emerald-800 flex items-center space-x-1 mt-0.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span className="truncate">
                        {farm.irrigationType === "rainfed"
                          ? t.rainfed
                          : farm.irrigationType === "irrigated"
                          ? t.irrigated
                          : t.swamp}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Soil type */}
                <div className="mt-3 flex items-center space-x-1.5 text-xs text-stone-600 bg-stone-50/80 px-2.5 py-1.5 rounded-lg border border-stone-100">
                  <Layers className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate font-medium">{farm.soilType}</span>
                </div>

                {/* Main Crops */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    {t.mainCrops}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {farm.mainCrops.map((crop, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60"
                      >
                        <Sprout className="w-3 h-3 text-emerald-600" />
                        <span>{crop}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {farm.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic bg-stone-50 p-2 rounded-lg">
                    "{farm.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                {language === "rw" ? "Yanditswe:" : "Created:"} {farm.createdAt}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Farm Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">{t.addFarm}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.farmName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Urugero: Umurima wa Kinigi Center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.district}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden bg-white"
                  >
                    {rwandanDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.sector}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kinigi"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.landSize}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.05"
                    required
                    value={sizeHa}
                    onChange={(e) => setSizeHa(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.irrigation}
                  </label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden bg-white"
                  >
                    <option value="rainfed">{t.rainfed}</option>
                    <option value="irrigated">{t.irrigated}</option>
                    <option value="swamp">{t.swamp}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.soilType}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden bg-white"
                >
                  <option value="Ubutaka bw'Amakoro (Volcanic)">{t.soilVolcanic}</option>
                  <option value="Urwondo rwo mu gishanga (Clay / Wetland)">{t.soilClay}</option>
                  <option value="Umusenyi n'urusyo (Sandy Loam)">{t.soilSandy}</option>
                  <option value="Ifumbire y'ishyamba n'uruvange (Rich Loam)">{t.soilLoam}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.mainCrops} (Gabanya n'akamenyetso ka vergire ',')
                </label>
                <input
                  type="text"
                  placeholder="Ibirayi (Kinigi), Ibishyimbo"
                  value={mainCropsInput}
                  onChange={(e) => setMainCropsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ibyongeweho (Notes)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Urugero: Ubutaka bwegereye umugezi, bufite amaterasi y'indinganire..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-colors"
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
