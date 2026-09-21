import React from "react";
import { Language, User } from "../types";
import { getTranslation } from "../i18n";
import { 
  Sprout, 
  Wifi, 
  WifiOff, 
  Globe, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  MessageCircle,
  Phone
} from "lucide-react";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isPhoneView: boolean;
  onTogglePhoneView: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  currentUser,
  onOpenAuth,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  isPhoneView,
  onTogglePhoneView,
  onOpenContact,
}) => {
  const t = getTranslation(language);

  return (
    <header className="bg-emerald-900 dark:bg-stone-950 text-white border-b border-emerald-800 dark:border-stone-800 sticky top-0 z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-inner text-white font-bold shrink-0">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-white">
                  TERIMBERE
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700/50">
                  Rwanda 🇷🇼
                </span>
                {currentUser?.role === "admin" && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-stone-950 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>ADMIN</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200 dark:text-stone-400 hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Phone Mockup Toggle (Flyer Photo Mode) */}
            <button
              onClick={onTogglePhoneView}
              title={isPhoneView ? "Desktop Dashboard" : "10 Mobile Screens View (From Photo)"}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isPhoneView
                  ? "bg-amber-400 text-stone-950 border-amber-300 shadow-sm"
                  : "bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border-emerald-700/60"
              }`}
            >
              {isPhoneView ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Photo Mockup</span>
                </>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 transition-colors"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Contact / WhatsApp Quick Link */}
            <button
              onClick={onOpenContact}
              title="Contact / WhatsApp / Instagram"
              className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {/* Offline / Online state toggle button */}
            <button
              onClick={onToggleOnline}
              title={isOnline ? t.onlineMode : t.offlineMode}
              className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isOnline
                  ? "bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border-emerald-700/60"
                  : "bg-amber-900/80 hover:bg-amber-900 text-amber-200 border-amber-600 animate-pulse"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline</span>
                </>
              )}
              {pendingSyncCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full">
                  {pendingSyncCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-950/80 rounded-xl p-0.5 border border-emerald-700/50">
              <button
                type="button"
                onClick={() => onLanguageChange("rw")}
                className={`px-1.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "rw"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                }`}
                title="Kinyarwanda"
              >
                🇷🇼 RW
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`px-1.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("fr")}
                className={`px-1.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "fr"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                }`}
                title="Français"
              >
                🇫🇷 FR
              </button>
            </div>

            {/* User Account / Login State */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-emerald-800/80">
                <div className="flex items-center space-x-2">
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-emerald-400 object-cover"
                  />
                  <div className="hidden xl:block text-left">
                    <span className="text-xs font-bold text-white block leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-medium">
                      {currentUser.role === "admin" ? "Admin Control" : currentUser.district}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sohoka (Logout)"
                  className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-rose-900/80 text-stone-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Injira</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
