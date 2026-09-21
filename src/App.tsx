import React, { useState, useEffect } from "react";
import {
  Language,
  Farm,
  FarmPlan,
  Expense,
  FarmActivity,
  HarvestRecord,
  SaleRecord,
  User,
  MarketPrice,
  TrainingCourse,
} from "./types";
import {
  initialFarms,
  initialPlans,
  initialExpenses,
  initialActivities,
  initialHarvests,
  initialSales,
  initialUsers,
  marketPrices as initialMarketPrices,
  weatherForecasts,
  initialTrainingCourses,
} from "./data/mockData";
import { getTranslation } from "./i18n";
import { Header } from "./components/Header";
import { Navigation, NavTab } from "./components/Navigation";
import { DashboardView } from "./components/DashboardView";
import { FarmsView } from "./components/FarmsView";
import { PlansView } from "./components/PlansView";
import { ExpensesView } from "./components/ExpensesView";
import { ActivitiesView } from "./components/ActivitiesView";
import { HarvestSalesView } from "./components/HarvestSalesView";
import { ProfitAnalyticsView } from "./components/ProfitAnalyticsView";
import { AiAdvisorView } from "./components/AiAdvisorView";
import { TrainingView } from "./components/TrainingView";
import { MarketWeatherView } from "./components/MarketWeatherView";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { SeasonReportView } from "./components/SeasonReportView";
import { AnalyticsSummaryView } from "./components/AnalyticsSummaryView";
import { PhoneMockupView } from "./components/PhoneMockupView";
import { AuthModal } from "./components/AuthModal";
import { ContactModal } from "./components/ContactModal";
import { Footer } from "./components/Footer";
import { CheckCircle2, ShieldCheck, Smartphone, Eye, Sparkles } from "lucide-react";

export function App() {
  // 1. Language state (defaults to Kinyarwanda as requested!)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("terimbere_lang");
    return (saved as Language) || "rw";
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("terimbere_lang", lang);
  };

  const t = getTranslation(language);

  // 2. Active Tab state
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");

  // 3. User Authentication state (defaults to Admin user so admin dashboard is readily accessible)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("terimbere_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialUsers[0];
      }
    }
    return initialUsers[0]; // Admin: kibondoqueenmary2022@
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  // 4. Phone Mockup View Toggle (Flyer Photo Mode)
  const [isPhoneView, setIsPhoneView] = useState<boolean>(false);

  // 5. Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("terimbere_theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("terimbere_theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 6. Online/Offline simulation state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // 7. Core Entities state with LocalStorage persistence
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem("terimbere_farms");
    return saved ? JSON.parse(saved) : initialFarms;
  });

  const [plans, setPlans] = useState<FarmPlan[]>(() => {
    const saved = localStorage.getItem("terimbere_plans");
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("terimbere_expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [activities, setActivities] = useState<FarmActivity[]>(() => {
    const saved = localStorage.getItem("terimbere_activities");
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [harvests, setHarvests] = useState<HarvestRecord[]>(() => {
    const saved = localStorage.getItem("terimbere_harvests");
    return saved ? JSON.parse(saved) : initialHarvests;
  });

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem("terimbere_sales");
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [marketPricesList, setMarketPricesList] = useState<MarketPrice[]>(() => {
    const saved = localStorage.getItem("terimbere_market_prices");
    return saved ? JSON.parse(saved) : initialMarketPrices;
  });

  const [trainingCourseList, setTrainingCourseList] = useState<TrainingCourse[]>(() => {
    const saved = localStorage.getItem("terimbere_training_courses");
    return saved ? JSON.parse(saved) : initialTrainingCourses;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("terimbere_farms", JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem("terimbere_plans", JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem("terimbere_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("terimbere_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("terimbere_harvests", JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem("terimbere_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("terimbere_market_prices", JSON.stringify(marketPricesList));
  }, [marketPricesList]);

  useEffect(() => {
    localStorage.setItem("terimbere_training_courses", JSON.stringify(trainingCourseList));
  }, [trainingCourseList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("terimbere_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("terimbere_current_user");
    }
  }, [currentUser]);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // AI Prompt jump helper
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>();
  const handleQuickAiPrompt = (promptText: string) => {
    setAiInitialPrompt(promptText);
    setCurrentTab("aiAdvisor");
  };

  // Handlers for authentication
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(
      language === "rw"
        ? `Murakaza neza, ${user.name}! Winjiye neza.`
        : `Welcome back, ${user.name}!`
    );
    if (user.role === "admin") {
      setCurrentTab("admin");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast(
      language === "rw" ? "Mwavuye muri konti neza." : "Logged out successfully."
    );
  };

  const handleSwitchToFarmer = () => {
    const farmerUser = initialUsers.find((u) => u.role === "farmer") || initialUsers[1];
    setCurrentUser(farmerUser);
    setCurrentTab("dashboard");
    showToast(
      language === "rw"
        ? "Winjiye nka Jean Baptiste (Farmer View)"
        : "Switched to Farmer View (Jean Baptiste)"
    );
  };

  // Data Operations
  const handleAddFarm = (farmData: Omit<Farm, "id" | "createdAt">) => {
    const newFarm: Farm = {
      ...farmData,
      id: "farm-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFarms((prev) => [newFarm, ...prev]);
    showToast(language === "rw" ? "Umurima mushya wanditswe neza!" : "New farm parcel added!");
  };

  const handleDeleteFarm = (id: string) => {
    setFarms((prev) => prev.filter((f) => f.id !== id));
    showToast(language === "rw" ? "Umurima wasibwe." : "Farm parcel removed.");
  };

  const handleAddPlan = (newPlan: FarmPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    showToast(language === "rw" ? "Gahunda y'ubuhinzi yabitswe neza!" : "Farm plan created successfully!");
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    showToast(language === "rw" ? "Gahunda yasibwe." : "Farm plan deleted.");
  };

  const handleAddExpense = (expData: Omit<Expense, "id" | "syncStatus">) => {
    const newExp: Expense = {
      ...expData,
      id: "exp-" + Date.now(),
      syncStatus: isOnline ? "synced" : "local_pending",
    };
    setExpenses((prev) => [newExp, ...prev]);
    if (!isOnline) {
      setPendingSyncCount((c) => c + 1);
    }
    showToast(language === "rw" ? "Amafaranga yakoreshejwe yanditswe!" : "Expense recorded!");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast(language === "rw" ? "Amafaranga yasibwe." : "Expense deleted.");
  };

  const handleAddActivity = (actData: Omit<FarmActivity, "id">) => {
    const newAct: FarmActivity = {
      ...actData,
      id: "act-" + Date.now(),
    };
    setActivities((prev) => [newAct, ...prev]);
    showToast(language === "rw" ? "Igikorwa gishya cyashyizwe kuri gahunda!" : "Field activity scheduled!");
  };

  const handleUpdateActivityStatus = (id: string, status: "pending" | "in_progress" | "completed") => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(
      status === "completed"
        ? language === "rw"
          ? "Igikorwa cyarangiye neza!"
          : "Activity marked as completed!"
        : language === "rw"
        ? "Uko igikorwa gihagaze byahinduwe."
        : "Activity status updated."
    );
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast(language === "rw" ? "Igikorwa cyasibwe." : "Activity removed.");
  };

  const handleAddHarvest = (hData: Omit<HarvestRecord, "id">) => {
    const newH: HarvestRecord = {
      ...hData,
      id: "harv-" + Date.now(),
    };
    setHarvests((prev) => [newH, ...prev]);
    showToast(language === "rw" ? "Umusaruro winjiye mu bubiko neza!" : "Harvest recorded into storage!");
  };

  const handleDeleteHarvest = (id: string) => {
    setHarvests((prev) => prev.filter((h) => h.id !== id));
    showToast(language === "rw" ? "Umusaruro wasibwe." : "Harvest record deleted.");
  };

  const handleAddSale = (sData: Omit<SaleRecord, "id">) => {
    const newSale: SaleRecord = {
      ...sData,
      id: "sale-" + Date.now(),
    };
    setSales((prev) => [newSale, ...prev]);
    showToast(language === "rw" ? "Ubucuruzi bw'umusaruro bwanditswe neza!" : "Sale recorded successfully!");
  };

  const handleDeleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    showToast(language === "rw" ? "Ubucuruzi bwasibwe." : "Sale record removed.");
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState && pendingSyncCount > 0) {
      setExpenses((prev) =>
        prev.map((e) => (e.syncStatus === "local_pending" ? { ...e, syncStatus: "synced" } : e))
      );
      setPendingSyncCount(0);
      showToast(language === "rw" ? "Amakuru yose ya offline yahujwe neza!" : "All offline records synced!");
    } else {
      showToast(
        nextState
          ? language === "rw"
            ? "Wongeye kwinjira kuri murandasi (Online)."
            : "Back online."
          : language === "rw"
          ? "Uhagaritse murandasi (Offline Mode). Ushobora gukomeza kwandika."
          : "Offline mode active. You can keep logging."
      );
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-stone-950 text-stone-100" : "bg-stone-100/80 text-stone-900"
      } flex flex-col font-sans transition-colors duration-200 relative`}
      style={{
        backgroundImage: isDarkMode
          ? 'radial-gradient(circle at 50% 5%, rgba(16, 185, 129, 0.08), transparent 45%), linear-gradient(rgba(12, 10, 9, 0.94), rgba(12, 10, 9, 0.97)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&auto=format&fit=crop&q=80")'
          : 'radial-gradient(circle at 50% 5%, rgba(16, 185, 129, 0.06), transparent 45%), linear-gradient(rgba(245, 245, 244, 0.92), rgba(245, 245, 244, 0.95)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&auto=format&fit=crop&q=80")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-950 dark:bg-emerald-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-stone-800 dark:border-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Quick Notification Bar when Admin is logged in */}
      {currentUser?.role === "admin" && (
        <div className="bg-stone-900 border-b border-amber-600/40 py-1.5 px-4 text-xs text-stone-300 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-amber-400">ADMINISTRATOR SESSION:</span>
              <span className="hidden sm:inline">kibondoqueenmary2022@ • Full Access</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <button
                onClick={() => setCurrentTab("admin")}
                className="font-bold text-amber-300 hover:underline"
              >
                Control Center →
              </button>
              <span>|</span>
              <button
                onClick={handleSwitchToFarmer}
                className="text-stone-400 hover:text-white"
              >
                Switch to Jean's Farm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        pendingSyncCount={pendingSyncCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isPhoneView={isPhoneView}
        onTogglePhoneView={() => setIsPhoneView(!isPhoneView)}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* 2. Navigation bar with tabs */}
      {!isPhoneView && (
        <Navigation
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          language={language}
          currentUser={currentUser}
        />
      )}

      {/* 3. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PHONE MOCKUP VIEW (When toggled to inspect the 10 mobile screens from flyer photo) */}
        {isPhoneView ? (
          <PhoneMockupView
            language={language}
            farms={farms}
            plans={plans}
            expenses={expenses}
            activities={activities}
            harvests={harvests}
            sales={sales}
            onClosePhoneView={() => setIsPhoneView(false)}
          />
        ) : (
          <>
            {currentTab === "dashboard" && (
              <DashboardView
                farms={farms}
                plans={plans}
                expenses={expenses}
                activities={activities}
                harvests={harvests}
                sales={sales}
                language={language}
                onNavigate={(tab) => setCurrentTab(tab)}
                onQuickAiPrompt={handleQuickAiPrompt}
                onCompleteActivity={(id) => handleUpdateActivityStatus(id, "completed")}
              />
            )}

            {currentTab === "farms" && (
              <FarmsView
                farms={farms}
                language={language}
                onAddFarm={handleAddFarm}
                onDeleteFarm={handleDeleteFarm}
              />
            )}

            {currentTab === "plans" && (
              <PlansView
                plans={plans}
                farms={farms}
                language={language}
                onAddPlan={handleAddPlan}
                onDeletePlan={handleDeletePlan}
              />
            )}

            {currentTab === "expenses" && (
              <ExpensesView
                expenses={expenses}
                farms={farms}
                language={language}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                isOnline={isOnline}
              />
            )}

            {currentTab === "activities" && (
              <ActivitiesView
                activities={activities}
                farms={farms}
                language={language}
                onAddActivity={handleAddActivity}
                onUpdateStatus={handleUpdateActivityStatus}
                onDeleteActivity={handleDeleteActivity}
              />
            )}

            {currentTab === "harvestSales" && (
              <HarvestSalesView
                harvests={harvests}
                sales={sales}
                farms={farms}
                language={language}
                onAddHarvest={handleAddHarvest}
                onAddSale={handleAddSale}
                onDeleteHarvest={handleDeleteHarvest}
                onDeleteSale={handleDeleteSale}
              />
            )}

            {currentTab === "profit" && (
              <ProfitAnalyticsView
                expenses={expenses}
                harvests={harvests}
                sales={sales}
                language={language}
              />
            )}

            {currentTab === "cycleReport" && (
              <SeasonReportView
                farms={farms}
                plans={plans}
                expenses={expenses}
                activities={activities}
                harvests={harvests}
                sales={sales}
                language={language}
              />
            )}

            {currentTab === "analytics" && (
              <AnalyticsSummaryView
                plans={plans}
                expenses={expenses}
                harvests={harvests}
                sales={sales}
                language={language}
              />
            )}

            {currentTab === "aiAdvisor" && (
              <AiAdvisorView
                language={language}
                farms={farms}
                onSavePlanFromAi={handleAddPlan}
                initialPrompt={aiInitialPrompt}
                onClearInitialPrompt={() => setAiInitialPrompt(undefined)}
              />
            )}

            {currentTab === "training" && <TrainingView language={language} />}

            {currentTab === "marketWeather" && (
              <MarketWeatherView
                language={language}
                marketPricesList={marketPricesList}
              />
            )}

            {currentTab === "admin" && (
              <AdminDashboardView
                currentUser={currentUser}
                language={language}
                farms={farms}
                plans={plans}
                expenses={expenses}
                harvests={harvests}
                sales={sales}
                marketPrices={marketPricesList}
                onUpdateMarketPrices={(prices) => setMarketPricesList(prices)}
                weatherForecasts={weatherForecasts}
                trainingCourses={trainingCourseList}
                onAddTrainingCourse={(course) => setTrainingCourseList([course, ...trainingCourseList])}
                onSwitchToFarmer={handleSwitchToFarmer}
              />
            )}
          </>
        )}
      </main>

      {/* 4. Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        language={language}
      />

      {/* 5. Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLoginSuccess}
        language={language}
      />

      {/* 6. Footer */}
      <Footer
        language={language}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAdmin={currentUser?.role === "admin"}
      />
    </div>
  );
}

export default App;
