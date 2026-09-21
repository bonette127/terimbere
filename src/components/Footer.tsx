import React from "react";
import { Language } from "../types";
import { 
  Sprout, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  MessageCircle, 
  ShieldCheck, 
  PhoneCall, 
  Lock,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface FooterProps {
  language: Language;
  onOpenContact: () => void;
  onOpenAuth: () => void;
  isAdmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenContact,
  onOpenAuth,
  isAdmin,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white shadow-inner font-black">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight font-display">
                TERIMBERE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                Rwanda 🇷🇼
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {language === "rw"
                ? "Urubuga rw'ikoranabuhanga ryafasha abahinzi b'u Rwanda gukurikirana ibyatewe, kwinjiza amafaranga, kubara inyungu, no kubona ubufasha bw'ubwenge bukorano (AI)."
                : "Smart agriculture management platform empowering Rwandan farmers with end-to-end cultivation tracking, financial analytics, and AI agronomy advice."}
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Gishingiye ku mabwiriza ya RAB (Rwanda Agri Board)</span>
            </div>
          </div>

          {/* Col 2: Official Contact Information (From Prompt) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === "rw" ? "Aho Batubariza (Contact Us)" : "Official Contacts"}
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href="mailto:kibondoqueenmary2022@gmail.com"
                  className="hover:text-emerald-300 transition-colors break-all"
                >
                  kibondoqueenmary2022@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/250792259699"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: <strong>0792259699</strong>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-rose-400 shrink-0" />
                <a
                  href="https://instagram.com/bonette127"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-rose-300 transition-colors"
                >
                  Instagram: <strong>@bonette127</strong>
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Kigali Heights, 5th Floor, KG 7 Ave, Kigali & Musanze Hub</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Hotlines */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === "rw" ? "Ubufasha & Imihora (Support)" : "Agri Support & Lines"}
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700">
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Hotline y'Umuhinzi ya RAB: 4127</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Guhamagara ni ubuntu ku mirongo yose mu Rwanda
                </p>
              </div>

              <button
                onClick={onOpenContact}
                className="w-full py-2 px-3 rounded-xl bg-emerald-800/70 hover:bg-emerald-700 text-white font-bold transition-colors text-center block"
              >
                {language === "rw" ? "Fungura Ifishi yo Kutwandikira" : "Open Contact Dialog"}
              </button>
            </div>
          </div>

          {/* Col 4: Admin Portal & System Security */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === "rw" ? "Ubuyobozi (Admin Portal)" : "Administration"}
            </h4>
            <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/80 space-y-2">
              <div className="flex items-center space-x-2 text-stone-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Super User Control</span>
              </div>
              <p className="text-[11px] text-stone-400">
                {isAdmin
                  ? "Ubu winjiye nka Super Admin kibondoqueenmary2022@"
                  : "Injira nka Admin kugira ngo ugenzure ibiciro by'amasoko n'abahinzi"}
              </p>
              <button
                onClick={onOpenAuth}
                className="w-full py-1.5 px-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-[11px] font-bold transition-colors"
              >
                {isAdmin ? "Genzura Konti z'Abahinzi" : "Admin Login (kibondoqueenmary2022@)"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} TERIMBERE Rwanda. Uburenganzira bwose burabitswe (All Rights Reserved).
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/250792259699" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
              WhatsApp: 0792259699
            </a>
            <span>•</span>
            <a href="https://instagram.com/bonette127" target="_blank" rel="noreferrer" className="hover:text-rose-400">
              Instagram: @bonette127
            </a>
            <span>•</span>
            <a href="mailto:kibondoqueenmary2022@gmail.com" className="hover:text-teal-400">
              kibondoqueenmary2022@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
