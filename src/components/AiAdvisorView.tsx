import React, { useState, useRef, useEffect } from "react";
import { Farm, FarmPlan, Language } from "../types";
import { getTranslation } from "../i18n";
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  CheckCircle2,
  Calendar,
  DollarSign,
  PlusCircle,
  HelpCircle,
  Wheat,
  RotateCcw,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  structuredPlan?: Partial<FarmPlan>;
}

interface AiAdvisorViewProps {
  language: Language;
  farms: Farm[];
  onSavePlanFromAi: (plan: FarmPlan) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({
  language,
  farms,
  onSavePlanFromAi,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const t = getTranslation(language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text:
        language === "rw"
          ? "Muraho neza! Ndi Umujyanama w'Ubuhinzi muri TERIMBERE 🇷🇼🌱. Mfasha abahinzi gukora gahunda y'ubuhinzi, gupanga ingengo y'imari, kurwanya indwara n'ibyonnyi, no guhitamo imbuto n'ifumbire byemejwe na RAB.\n\nUshobora kumbaza ikibazo cyose, urugero:\n« Mfite amafaranga 500,000 RWF. Ndashaka guhinga ibirayi kuri hegitari 0.5. Mwamfasha gukora gahunda? »"
          : language === "fr"
          ? "Bonjour! Je suis le Conseiller Agricole IA de TERIMBERE 🇷🇼🌱. Je vous aide à élaborer des plans de culture réels, calculer votre budget d'intrants et maximiser vos rendements selon les normes du RAB.\n\nExemple: « J'ai 500 000 RWF. Je veux cultiver des pommes de terre sur 0,5 hectare. Pouvez-vous faire mon plan? »"
          : "Hello! I am your TERIMBERE AI Farm Advisor 🇷🇼🌱. I help Rwandan farmers create profitable farm plans, calculate fertilizer and seed budgets, and manage crop diseases backed by RAB standards.\n\nTry asking: “I have 500,000 RWF budget. I want to grow Irish potatoes on 0.5 hectares. Can you create my plan?”",
      timestamp: "08:00",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle passed initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const presetQuestions = [
    "Mfite amafaranga 500,000 RWF. Ndashaka guhinga ibirayi kuri hegitari 0.5. Mwamfasha gukora gahunda?",
    "Ni iyihe mbuto y'ibirayi irwanya urume (Late Blight) yakwera neza i Musanze?",
    "Ibigori byanjye byafashwe n'uruyenzi (Fall Armyworm). Nakoresha uwuhe muti kandi ryari?",
    "Nteganya guhinga hegitari 1 y'ibishyimbo i Nyagatare. Nkeneye ifumbire ingana iki?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const farmContext = farms.map((f) => `${f.name} (${f.district}, ${f.sizeHa}ha, ${f.soilType})`).join("; ");
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          language,
          farmContext,
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      const replyText = data.text || "Niteguye kugufasha mu buhinzi bwawe.";

      // Check if prompt was about creating a potato / crop plan with budget
      let structuredPlan: Partial<FarmPlan> | undefined = undefined;
      const lowerQ = query.toLowerCase();
      if (
        lowerQ.includes("gahunda") ||
        lowerQ.includes("hegitari") ||
        lowerQ.includes("rwf") ||
        lowerQ.includes("ibirayi") ||
        lowerQ.includes("plan")
      ) {
        // Build actionable plan object from the context
        const budgetMatch = query.match(/(\d[\d,\.]+)\s*(rwf|amafaranga)?/i);
        const budgetVal = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, "")) : 500000;
        const sizeMatch = query.match(/(\d+\.?\d*)\s*(hegitari|ha|are)/i);
        const sizeVal = sizeMatch ? parseFloat(sizeMatch[1]) : 0.5;

        structuredPlan = {
          crop: lowerQ.includes("ibigori") ? "Ibigori (H628)" : "Ibirayi (Kinigi)",
          landSize: sizeVal,
          unit: "hegitari",
          budget: budgetVal,
          expectedYieldKg: Math.round(sizeVal * 16000),
          expectedPricePerKg: 300,
          expectedGrossRevenue: Math.round(sizeVal * 16000 * 300),
          expectedNetProfit: Math.round(sizeVal * 16000 * 300) - budgetVal,
          budgetBreakdown: [
            { category: "Imbuto y'indobanure (RAB)", amount: Math.round(budgetVal * 0.45), notes: "Imbuto ya Kinigi kg 1,000" },
            { category: "Ifumbire (NPK 17-17-17 & DAP)", amount: Math.round(budgetVal * 0.25), notes: "Mifuka 2 ya NPK & ifumbire y'imborera" },
            { category: "Imiti yo kurwanya urume (Late blight)", amount: Math.round(budgetVal * 0.10), notes: "Mancozeb / Ridomil Gold" },
            { category: "Abakozi b'ibiraka", amount: Math.round(budgetVal * 0.15), notes: "Guharura, gutera no kubagara" },
            { category: "Ibindi bitunguranye", amount: Math.round(budgetVal * 0.05), notes: "Amasaho n'ibindi" },
          ],
          rabTips: "Tegura imirongo ya santimetero 75 hagati yayo na cm 30 hagati y'ibirayi bibiri.",
        };
      }

      const aiMessage: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structuredPlan,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // Fallback in case of server connection failure
      const fallbackReply =
        language === "rw"
          ? `Gahunda y'Ubuhinzi bwawe:\n\n1. **Imbuto**: Ku buso bwa hegitari 0.5, urakenera toni 1 (kg 1000) y'imbuto yemejwe ya Kinigi cyangwa Rwangume (~225,000 RWF).\n2. **Ifumbire**: NPK 17-17-17 (ibiro 150) hamwe n'ifumbire y'imborera iboze neza (~125,000 RWF).\n3. **Imiti**: Mancozeb na Ridomil Gold yo kurinda urume (Late Blight) mu gihe cy'imvura (~50,000 RWF).\n4. **Abakozi**: Gutunganya umurima no gutera (~75,000 RWF).\n5. **Umusaruro witezwe**: Toni 7 kugeza kuri 8 z'ibirayi. Ku giciro cya 300 RWF/kg, uzinjiza 2,250,000 RWF. Inyungu isukuye ni 1,750,000 RWF!`
          : `Farm Plan Outline:\n\n1. **Certified Seeds**: For 0.5 Ha, you will need 1,000 kg of certified potato seed (Kinigi variety) (~225,000 RWF).\n2. **Fertilizers**: 150 kg NPK 17-17-17 with well-decomposed manure (~125,000 RWF).\n3. **Crop Protection**: Mancozeb and Ridomil Gold for Late Blight (~50,000 RWF).\n4. **Labor**: Land prep and planting (~75,000 RWF).\n5. **Expected Harvest**: 7-8 tons, generating ~2,250,000 RWF with net profit around 1,750,000 RWF!`;

      const aiMessage: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structuredPlan: {
          crop: "Ibirayi (Kinigi)",
          landSize: 0.5,
          unit: "hegitari",
          budget: 500000,
          expectedYieldKg: 8000,
          expectedPricePerKg: 300,
          expectedGrossRevenue: 2400000,
          expectedNetProfit: 1900000,
          budgetBreakdown: [
            { category: "Imbuto yemejwe na RAB", amount: 225000, notes: "Kg 1,000 za Kinigi" },
            { category: "Ifumbire NPK na DAP", amount: 125000, notes: "NPK 17-17-17 na manure" },
            { category: "Imiti yo kurinda urume", amount: 50000, notes: "Mancozeb & Ridomil" },
            { category: "Abakozi b'ibiraka", amount: 75000, notes: "Guharura no gutera" },
            { category: "Ibindi bitunguranye", amount: 25000, notes: "Amasaho n'ibindi" },
          ],
          rabTips: "Gukoresha imbuto yizewe byongera umusaruro hejuru ya 40%.",
        },
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "rw" ? "sw-TZ" : language === "fr" ? "fr-FR" : "en-US";
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSavePlan = (planData: Partial<FarmPlan>) => {
    const farm = farms[0] || { id: "farm-1", name: "Umurima wanjye" };
    const fullPlan: FarmPlan = {
      id: "plan-ai-" + Date.now(),
      farmId: farm.id,
      farmName: farm.name,
      crop: planData.crop || "Ibirayi (Kinigi)",
      seasonCode: "2026A",
      landSize: planData.landSize || 0.5,
      unit: planData.unit || "hegitari",
      budget: planData.budget || 500000,
      expectedYieldKg: planData.expectedYieldKg || 8000,
      expectedPricePerKg: planData.expectedPricePerKg || 300,
      expectedGrossRevenue: planData.expectedGrossRevenue || 2400000,
      expectedNetProfit: planData.expectedNetProfit || 1900000,
      budgetBreakdown: planData.budgetBreakdown || [],
      timeline: [
        { step: 1, title: "Gutegura umurima no gucukura santimetero 30", timing: "Icyumweru 1", advice: "Shyiramo ifumbire y'imborera iboze neza" },
        { step: 2, title: "Gutera imbuto ya Kinigi (cm 75 x 30)", timing: "Icyumweru 2", advice: "Shyiramo ifumbire ya DAP cyangwa NPK" },
        { step: 3, title: "Kubagara no gusasira (Buttage)", timing: "Icyumweru 4", advice: "Gusasira bituma ibirayi byera byinshi bitazana icyatsi" },
        { step: 4, title: "Gutera umuti wa Mancozeb kurinda urume", timing: "Icyumweru 6", advice: "Gutera mu gitondo izuba rigisohoka" },
        { step: 5, title: "Gusarura no kwanika ahari umuyaga", timing: "Icyumweru 14-16", advice: "Kurobanura ibikomeretse mbere yo gupakira" },
      ],
      status: "active",
      rabTips: planData.rabTips || "Ubuhinge bukurikiza amabwiriza ya RAB bwongera inyungu.",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onSavePlanFromAi(fullPlan);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl border border-emerald-700 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Rwanda Agri Intelligence Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            {t.aiTitle}
          </h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            {t.aiSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleSendMessage(presetQuestions[0])}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kora Gahunda ya 500,000 RWF</span>
          </button>
        </div>
      </div>

      {/* Preset Farmer Questions Ticker */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <span className="text-xs font-bold text-stone-500 block mb-2">
          {language === "rw" ? "Baza ako kanya (Quick Questions):" : "Sample Inquiries:"}
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left text-xs bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 px-3 py-2 rounded-lg border border-stone-200 transition-colors"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 sm:p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
                msg.sender === "user"
                  ? "bg-stone-800"
                  : "bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xs"
              }`}
            >
              {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-emerald-800 text-white font-medium"
                  : "bg-stone-50 border border-stone-200 text-stone-800"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[11px] font-bold opacity-75">
                  {msg.sender === "user" ? "Wowe (Umuhinzi)" : "Umujyanama w'Ubuhinzi (TERIMBERE AI)"}
                </span>
                <span className="text-[10px] opacity-60">{msg.timestamp}</span>
              </div>

              {/* Message text formatted */}
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Interactive Structured Farm Plan Card if present */}
              {msg.structuredPlan && (
                <div className="mt-4 pt-4 border-t border-emerald-200/50 bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-3 text-stone-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-sm text-emerald-950">
                        Gahunda y'Ubuhinzi Yateguwe (Draft Plan)
                      </h4>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {msg.structuredPlan.crop}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-stone-50 p-2 rounded-lg">
                      <span className="text-stone-400 block font-medium">Ingengo y'imari</span>
                      <strong className="text-stone-900 text-sm">
                        {msg.structuredPlan.budget?.toLocaleString()} RWF
                      </strong>
                    </div>
                    <div className="bg-stone-50 p-2 rounded-lg">
                      <span className="text-stone-400 block font-medium">Ubuso</span>
                      <strong className="text-stone-900 text-sm">
                        {msg.structuredPlan.landSize} {msg.structuredPlan.unit}
                      </strong>
                    </div>
                    <div className="bg-stone-50 p-2 rounded-lg">
                      <span className="text-stone-400 block font-medium">Umusaruro witezwe</span>
                      <strong className="text-stone-900 text-sm">
                        {msg.structuredPlan.expectedYieldKg?.toLocaleString()} Kg
                      </strong>
                    </div>
                    <div className="bg-stone-50 p-2 rounded-lg">
                      <span className="text-stone-400 block font-medium">Inyungu isukuye</span>
                      <strong className="text-emerald-700 text-sm">
                        +{msg.structuredPlan.expectedNetProfit?.toLocaleString()} RWF
                      </strong>
                    </div>
                  </div>

                  {msg.structuredPlan.budgetBreakdown && (
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-stone-700 block">Igabana ry'amafaranga:</span>
                      {msg.structuredPlan.budgetBreakdown.slice(0, 4).map((b, i) => (
                        <div key={i} className="flex justify-between text-stone-600">
                          <span>• {b.category}</span>
                          <span className="font-semibold text-stone-900">{b.amount.toLocaleString()} RWF</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500">
                      Iyi gahunda iriteguye kubikwa mu mirima yawe!
                    </span>
                    <button
                      onClick={() => handleSavePlan(msg.structuredPlan!)}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>{language === "rw" ? "Bika muri Gahunda yanjye" : "Save as Farm Plan"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Audio Playback button */}
              {msg.sender === "ai" && (
                <div className="mt-2.5 flex justify-end">
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    className="flex items-center space-x-1 text-[11px] font-semibold text-stone-500 hover:text-emerald-800 transition-colors"
                    title="Umva ijwi (Soma mu ijwi)"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        <span>Hagarika ijwi</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{language === "rw" ? "Umva mu ijwi (Audio)" : "Listen to advice"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs font-semibold text-stone-600 flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full animate-ping" />
              <span>{language === "rw" ? "Umujyanama arimo gusesengura..." : "Agronomist analyzing..."}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            language === "rw"
              ? "Andika ikibazo cyangwa gahunda wifuza (urugero: Mfite 500,000 RWF ndashaka guhinga ibirayi...)"
              : "Type your farm question or budget query..."
          }
          className="flex-1 px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center space-x-1.5 transition-colors shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.send}</span>
        </button>
      </form>
    </div>
  );
};
