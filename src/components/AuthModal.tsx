import React, { useState } from "react";
import { User, Language } from "../types";
import { initialUsers } from "../data/mockData";
import { 
  Lock, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Sprout, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  language,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPhone, setRegPhone] = useState("0788");
  const [regEmail, setRegEmail] = useState("");
  const [regDistrict, setRegDistrict] = useState("Musanze");
  const [regSector, setRegSector] = useState("Kinigi");
  const [regCrop, setRegCrop] = useState("Ibirayi");
  const [regSize, setRegSize] = useState("0.5");
  const [regPassword, setRegPassword] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check for admin credentials
    if (
      (cleanInput === "kibondoqueenmary2022@" || cleanInput === "kibondoqueenmary2022@gmail.com") &&
      cleanPass === "samu1102005@"
    ) {
      const admin = initialUsers.find((u) => u.role === "admin") || {
        id: "user-admin",
        username: "kibondoqueenmary2022@",
        name: "Queen Mary (Admin)",
        email: "kibondoqueenmary2022@gmail.com",
        phone: "0792259699",
        role: "admin",
        district: "Kigali (Nyarugenge)",
        sector: "Kiyovu",
        farmSizeHa: 0,
        primaryCrop: "National Agri Oversight",
        verified: true,
        createdAt: "2025-01-01",
      };
      setSuccessMsg(language === "rw" ? "Mwakiriwe neza Admin Queen Mary!" : "Welcome Queen Mary (Admin)!");
      setTimeout(() => {
        onLogin(admin);
        onClose();
      }, 500);
      return;
    }

    // Check standard farmers or match username
    const found = initialUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput ||
        u.phone.includes(cleanInput)
    );

    if (found) {
      setSuccessMsg(
        language === "rw" ? `Muraho neza ${found.name}!` : `Welcome back, ${found.name}!`
      );
      setTimeout(() => {
        onLogin(found);
        onClose();
      }, 500);
      return;
    }

    // Allow flexible farmer login for demo if entered something
    if (cleanInput.length > 2) {
      const genericFarmer: User = {
        id: `user-${Date.now()}`,
        username: cleanInput,
        name: cleanInput.includes("@") ? cleanInput.split("@")[0] : cleanInput,
        email: cleanInput.includes("@") ? cleanInput : `${cleanInput}@terimbere.rw`,
        phone: "0788123456",
        role: "farmer",
        district: "Musanze",
        sector: "Kinigi",
        farmSizeHa: 1.0,
        primaryCrop: "Ibirayi",
        verified: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setSuccessMsg(language === "rw" ? `Muraho ${genericFarmer.name}!` : `Welcome, ${genericFarmer.name}!`);
      setTimeout(() => {
        onLogin(genericFarmer);
        onClose();
      }, 500);
      return;
    }

    setError(
      language === "rw"
        ? "Izina ry'ukoresha cyangwa ijambo ry'ibanga ntabwo bihuye. Reba neza cyangwa ukande kuri 'Quick Login'."
        : "Invalid username or password. Please verify or use the Quick Fill buttons below."
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regPhone.trim()) {
      setError(language === "rw" ? "Uzuza amazina yawe na numero ya telefone." : "Please fill in your name and phone number.");
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: regUsername.trim() || regPhone.replace(/\s+/g, ""),
      name: regName.trim(),
      email: regEmail.trim() || `${regPhone}@terimbere.rw`,
      phone: regPhone.trim(),
      role: "farmer",
      district: regDistrict,
      sector: regSector,
      farmSizeHa: parseFloat(regSize) || 0.5,
      primaryCrop: regCrop,
      verified: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setSuccessMsg(
      language === "rw"
        ? `Konte ya ${newUser.name} yafunguwe neza! Mwakiriwe muri Terimbere.`
        : `Account created for ${newUser.name}! Welcome to Terimbere.`
    );

    setTimeout(() => {
      onLogin(newUser);
      onClose();
    }, 600);
  };

  const fillAdmin = () => {
    setUsernameOrEmail("kibondoqueenmary2022@");
    setPassword("samu1102005@");
    setError(null);
  };

  const fillFarmer = () => {
    setUsernameOrEmail("jean@terimbere.rw");
    setPassword("jean123");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-bold shadow-inner">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight font-display">
                {isRegisterMode
                  ? language === "rw"
                    ? "Kwiyandikisha (Sign Up)"
                    : "Create Farmer Account"
                  : language === "rw"
                  ? "Kwinjira muri TERIMBERE"
                  : "Sign In to TERIMBERE"}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {isRegisterMode
                  ? language === "rw"
                    ? "Kora konti nshya yo gukurikirana umurima wawe"
                    : "Register to manage your crops & profits"
                  : language === "rw"
                  ? "Injira nka Umuhinzi cyangwa Admin wa Terimbere"
                  : "Sign in as Farmer or System Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isRegisterMode ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  {language === "rw" ? "Izina ry'ukoresha / Email / Telefone" : "Username / Email / Phone"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="kibondoqueenmary2022@ cyangwa jean@terimbere.rw"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  {language === "rw" ? "Ijambo ry'ibanga (Password)" : "Password"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="samu1102005@"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm"
              >
                {language === "rw" ? "Injira ubu" : "Sign In"}
              </button>

              {/* Fast 1-Click Fill Buttons for Evaluators & Users */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-2 text-center uppercase tracking-wider">
                  {language === "rw" ? "Kanda hano winjire vuba (Quick Access)" : "1-Click Quick Access"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillAdmin}
                    className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-left hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                  >
                    <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Queen Mary</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block truncate">
                      kibondoqueenmary2022@
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={fillFarmer}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-left hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-bold text-xs">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Jean (Umuhinzi)</span>
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                      jean@terimbere.rw
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === "rw" ? "Amazina yawe yose (Full Name)" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="urugero: Ndahiro Jean Baptiste"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {language === "rw" ? "Telefone (MTN/Airtel)" : "Phone"} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0788123456"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {language === "rw" ? "Akarere (District)" : "District"}
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="Musanze">Musanze</option>
                    <option value="Nyagatare">Nyagatare</option>
                    <option value="Huye">Huye</option>
                    <option value="Rubavu">Rubavu</option>
                    <option value="Gicumbi">Gicumbi</option>
                    <option value="Bugesera">Bugesera</option>
                    <option value="Nyamagabe">Nyamagabe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {language === "rw" ? "Igihingwa cya mbere" : "Main Crop"}
                  </label>
                  <select
                    value={regCrop}
                    onChange={(e) => setRegCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="Ibirayi (Kinigi)">Ibirayi (Potatoes)</option>
                    <option value="Ibigori (Maize)">Ibigori (Maize)</option>
                    <option value="Inyanya (Tomatoes)">Inyanya (Tomatoes)</option>
                    <option value="Ibishyimbo (Beans)">Ibishyimbo (Beans)</option>
                    <option value="Soya">Soya</option>
                    <option value="Imboga">Imboga (Vegetables)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {language === "rw" ? "Ingano y'Ubutaka (Ha)" : "Land Size (Ha)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={regSize}
                    onChange={(e) => setRegSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === "rw" ? "Ijambo ry'ibanga rishya" : "New Password"}
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="******"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm"
              >
                {language === "rw" ? "Kora Konte y'Ubuhinzi" : "Create My Account"}
              </button>
            </form>
          )}

          {/* Toggle between login and registration */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              {isRegisterMode
                ? language === "rw"
                  ? "Ufite konte usanzwe? Kanda hano winjire"
                  : "Already have an account? Sign in here"
                : language === "rw"
                ? "Nta konte uragira? Iyandikishe hano nk'umuhinzi mushya"
                : "New farmer? Register for an account here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
