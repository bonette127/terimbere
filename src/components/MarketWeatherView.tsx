import React, { useState } from "react";
import { Language, MarketPrice, WeatherForecast } from "../types";
import { marketPrices, weatherForecasts } from "../data/mockData";
import { getTranslation } from "../i18n";
import {
  CloudSun,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Droplets,
  Wind,
  Sparkles,
  Truck,
} from "lucide-react";

interface MarketWeatherViewProps {
  language: Language;
  marketPricesList?: MarketPrice[];
}

export const MarketWeatherView: React.FC<MarketWeatherViewProps> = ({ 
  language,
  marketPricesList,
}) => {
  const t = getTranslation(language);
  const [selectedDistrict, setSelectedDistrict] = useState("Musanze");
  const [marketSearch, setMarketSearch] = useState("");

  const activePrices = marketPricesList || marketPrices;

  const filteredPrices = activePrices.filter((p) => {
    if (!marketSearch.trim()) return true;
    const q = marketSearch.toLowerCase();
    return (
      p.crop.toLowerCase().includes(q) ||
      p.marketName.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  });

  const currentWeather =
    weatherForecasts.find((w) => w.district === selectedDistrict) || weatherForecasts[0];

  const getCondition = (w: WeatherForecast) => {
    if (language === "rw") return w.conditionRw;
    if (language === "fr") return w.conditionFr;
    return w.conditionEn;
  };

  const getAdvisory = (w: WeatherForecast) => {
    if (language === "rw") return w.agriAdvisoryRw;
    if (language === "fr") return w.agriAdvisoryFr;
    return w.agriAdvisoryEn;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">
          {t.marketTitle}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {t.marketSubtitle}
        </p>
      </div>

      {/* Weather Forecast Widget with District Filter */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white p-6 rounded-2xl border border-emerald-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-bold">
              {language === "rw" ? "Iteganyagihe ry'Ubuhinzi (Agro-Weather)" : "Agricultural Weather Forecast"}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-emerald-200">Akarere:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-emerald-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-600 outline-hidden"
            >
              {weatherForecasts.map((w) => (
                <option key={w.district} value={w.district}>
                  {w.district} ({w.province})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current District Weather Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xl">
              {currentWeather.tempC}°C
            </div>
            <div>
              <span className="text-xs font-bold text-stone-300 block">
                {currentWeather.district} ({currentWeather.province})
              </span>
              <p className="text-sm font-semibold text-white">{getCondition(currentWeather)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-300 block">Ingano y'Imvura</span>
              <p className="text-sm font-semibold text-white">{currentWeather.rainfallMm} mm</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-300 block">Ubuhehere (Humidity)</span>
              <p className="text-sm font-semibold text-white">{currentWeather.humidity}%</p>
            </div>
          </div>
        </div>

        {/* Agronomic Alert Banner */}
        <div className="p-4 rounded-xl bg-white/15 border border-white/20 text-xs flex items-start space-x-2.5">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-200 block mb-0.5">
              Inama y'Ubuhinzi muri {currentWeather.district}:
            </strong>
            <p className="text-stone-100 leading-relaxed">{getAdvisory(currentWeather)}</p>
          </div>
        </div>
      </div>

      {/* Market Prices Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {language === "rw" ? "Ibiciro byo mu Masoko Manini y'u Rwanda" : "Wholesale Market Price Ticker"}
            </h3>
            <p className="text-xs text-stone-500">
              Bishyirwa ku gihe buri gitondo n'abakusanyamakuru ba TERIMBERE
            </p>
          </div>

          <input
            type="text"
            placeholder={language === "rw" ? "Shakisha igihingwa cyangwa isoko..." : "Search crop or market..."}
            value={marketSearch}
            onChange={(e) => setMarketSearch(e.target.value)}
            className="px-3.5 py-2 border border-stone-300 rounded-xl text-xs w-full sm:w-64 outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Igihingwa (Crop)</th>
                <th className="px-5 py-3.5">Isoko (Market)</th>
                <th className="px-5 py-3.5">Akarere (District)</th>
                <th className="px-5 py-3.5 text-right">Igiciro (RWF/kg)</th>
                <th className="px-5 py-3.5 text-center">Ihindagurika (Trend)</th>
                <th className="px-5 py-3.5 text-right">Itariki (Updated)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPrices.map((mp) => (
                <tr key={mp.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-stone-900 text-xs">
                    {mp.crop}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-emerald-900">
                    {mp.marketName}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-stone-600">
                    {mp.district}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right font-black text-stone-900 text-sm">
                    {mp.priceAvg} <span className="text-[10px] font-bold text-stone-400">RWF/kg</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    {mp.trend === "up" ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                        <TrendingUp className="w-3 h-3" />
                        <span>Kuri hejuru</span>
                      </span>
                    ) : mp.trend === "down" ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200">
                        <TrendingDown className="w-3 h-3" />
                        <span>Bimanutse</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold text-stone-600 bg-stone-100">
                        <Minus className="w-3 h-3" />
                        <span>Bihagaze hamwe</span>
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right text-xs text-stone-400">
                    {mp.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transport & Arbitrage Calculator */}
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-emerald-800" />
          <h3 className="text-base font-bold text-stone-900">
            {language === "rw"
              ? "Kugurisha ku murima (Farm Gate) vs Kujyana i Kigali (Market Arbitrage)"
              : "Farm Gate vs Kigali City Delivery"}
          </h3>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          Ku birenge by'ibirayi bya Kinigi: Igiciro ku murima i Musanze ni <strong>280 RWF/kg</strong>. Ku isoko rya Kimironko/Nyabugogo i Kigali ni <strong>340 RWF/kg</strong>. Ikiguzi cyo gutwara ikilo kimwe ni <strong>25 RWF</strong>.
          <br />
          👉 Kujyana umusaruro w'ibirayi wa Toni 5 (5,000 kg) i Kigali byongera inyungu ya <strong>175,000 RWF</strong> nyuma yo gukuramo ikiguzi cy'imodoka!
        </p>
      </div>
    </div>
  );
};
