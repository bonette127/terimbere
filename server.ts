import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shared Gemini client setup
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "TERIMBERE",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Chat / Advisor endpoint
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { prompt, language = "rw", context } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback expert guidance if key is pending in dev
      const fallbackKinyarwanda = `Muraho! Ndishimiye kubafasha kuri gahunda y'ubuhinzi bwawe muri TERIMBERE. Kuri hegitari 0.5 y'ibirayi n'ingengo y'imari ya 500,000 RWF: 
1. Imbuto (Kinigi cyangwa Victoria): 1,000 kg (~250,000 RWF)
2. Ifumbire y'imborera n'iy'imvaruganda (NPK 17-17-17 & DAP): ~120,000 RWF
3. Imiti yo kurinda ibirayi (Ridomil/Mancozeb kurinda imvura n'urume): ~40,000 RWF
4. Abakozi (Guharura, gutera, kubagara & gusarura): ~90,000 RWF
Umusaruro uteganyijwe: Toni 7 kugeza kuri 9 (7,000 - 9,000 kg). Ku giciro cy'isoko cya 250 - 320 RWF/kg, inyungu isukuye ishobora kurenga 1,200,000 RWF!`;
      return res.json({
        reply: language === "rw" ? fallbackKinyarwanda : "Farm advisory active. Budget breakdown estimated based on Rwanda Agricultural Board standards.",
        suggestedPlan: {
          cropName: "Ibirayi (Irish Potatoes)",
          area: 0.5,
          unit: "hegitari",
          estimatedBudget: 500000,
          projectedYieldKg: 8000,
          targetPricePerKg: 280,
          expectedGrossRevenue: 2240000,
          expectedNetProfit: 1740000,
          durationDays: 105,
          phases: [
            { phase: "Gutegura umurima & gufumbira", days: "Icyumweru 1-2", cost: 130000 },
            { phase: "Gutera imbuto nziza yemejwe (Kinigi)", days: "Icyumweru 3", cost: 250000 },
            { phase: "Kubagara, gusasira & gutera umuti", days: "Icyumweru 5-8", cost: 70000 },
            { phase: "Gusarura & gushyira mu mifuka", days: "Icyumweru 14-15", cost: 50000 }
          ]
        }
      });
    }

    const systemInstruction = `You are "Umujyanama w'Ubuhinzi" (Agricultural Advisor) for TERIMBERE, an elite AI agronomist tailored specifically for Rwanda's farming realities.
You have deep expertise in:
- Rwandan soils (Volcanic soils in Musanze/Nyabihu/Burera, Clay in marshlands, Sandy loam in Eastern province Nyagatare/Kayonza, Acidic soils in Southern/Western hills).
- Rwandan seasonal agro-calendar:
  - Season A (Umuhindo: Sept - Jan) - Maize, Beans, Irish potatoes, Soybeans.
  - Season B (Itumba: Feb - June) - Sorghum, Beans, Vegetables, Potatoes.
  - Season C (Icyi / Marais / Kuhira: July - Sept) - Irish potatoes in valleys, vegetables, sweet potatoes, maize in irrigated swamps.
- Seeds certified by RAB (Rwanda Agriculture and Animal Resources Development Board):
  - Potatoes: Kinigi, Victoria, Kuruseke, Sangema, Rwangume, Cruza.
  - Maize: H628, H629, PAN 53, SC series.
  - Beans: RWR 2245, MAC 44 (Climbing), Colta (Bush beans).
- Real Rwandan market prices (RWF per kg) in Kimironko, Nyabugogo, Musanze, Rubavu, Huye, Nyagatare.
- Recommended fertilization rates: DAP at planting (100-150 kg/ha), Urea top-dressing (50-100 kg/ha), NPK 17-17-17, Organic compost/Ifumbire y'imborera (10-20 tons/ha).
- Pest and disease management: Fall Armyworm (Nkongwa ibyasi), Bacterial wilt (Kirabiranya), Late blight (Mirasire / Urume), Bean anthracnose.

Response Language Rule:
- If language is 'rw', respond in natural, respectful, and authoritative Kinyarwanda as spoken by Rwandan extension officers.
- If language is 'en', respond in clear professional English.
- If language is 'fr', respond in fluent French.

Always give realistic numbers in Rwandan Francs (RWF) and Rwandan units (hegitari, are, kg, toni).
Format your answer with clear structure:
1. Isesengura ry'ingengo y'imari (Budget breakdown)
2. Intambwe zo guhinga (Key Agronomic Steps)
3. Umusaruro n'Inyungu iteganyijwe (Expected yield, gross income, net profit)
4. Inama z'ingenzi z'ubuhinzi bwa kinyamwuga (Crucial agronomist tips for Rwanda)`;

    const userPrompt = `${prompt}
Selected Language: ${language}
${context ? `Farm Context: ${JSON.stringify(context)}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Ntabwo nashoboye gutanga igisubizo ako kanya. Ongera ugerageze.",
    });
  } catch (error: any) {
    console.error("Gemini advisor error:", error);
    res.status(500).json({
      error: "Habaye ikibazo mu kubona inama z'ubuhinzi. Reba interineti yawe cyangwa wongere ugerageze.",
      details: error?.message,
    });
  }
});

// Structured Farm Plan generator
app.post("/api/gemini/generate-plan", async (req, res) => {
  try {
    const { crop, landSize, unit = "hegitari", budget, district, season, language = "rw" } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Mock structured plan for dev preview if key not present
      return res.json({
        plan: {
          title: `Gahunda y'ubuhinzi bwa ${crop} kuri ${landSize} ${unit}`,
          crop,
          landSize: Number(landSize),
          unit,
          budget: Number(budget) || 500000,
          expectedYieldKg: Math.round(Number(landSize) * (crop.toLowerCase().includes("ibirayi") ? 16000 : 3500)),
          expectedPricePerKg: crop.toLowerCase().includes("ibirayi") ? 270 : 350,
          expectedGrossRevenue: Math.round(Number(landSize) * (crop.toLowerCase().includes("ibirayi") ? 16000 * 270 : 3500 * 350)),
          expectedNetProfit: Math.round(Number(landSize) * (crop.toLowerCase().includes("ibirayi") ? 16000 * 270 : 3500 * 350)) - (Number(budget) || 500000),
          budgetBreakdown: [
            { category: "Imbuto (Seeds)", amount: Math.round(Number(budget || 500000) * 0.45), notes: "Imbuto yemejwe na RAB" },
            { category: "Ifumbire (Fertilizers)", amount: Math.round(Number(budget || 500000) * 0.25), notes: "DAP, NPK na Urea" },
            { category: "Imiti (Crop protection)", amount: Math.round(Number(budget || 500000) * 0.10), notes: "Imiti y'ibyonnyi n'indwara" },
            { category: "Abakozi (Labor)", amount: Math.round(Number(budget || 500000) * 0.15), notes: "Guharura, gutera, kubagara" },
            { category: "Ibindi bitunguranye (Contingency)", amount: Math.round(Number(budget || 500000) * 0.05), notes: "Ibikoresho no gutwara" },
          ],
          timeline: [
            { step: 1, title: "Gutegura ubutaka no gusasira ifumbire", timing: "Icyumweru 1-2 mbere yo gutera", advice: "Kora imirwanyasuri niba uri ku musozi" },
            { step: 2, title: "Gutera imbuto nziza yatoranyijwe", timing: "Ku munsi wo gutera", advice: "Hana intera ya cm 75x30 cm" },
            { step: 3, title: "Kubagara no gusasira bwa mbere", timing: "Ibyumweru 3 nyuma yo gutera", advice: "Shyiramo Urea ku rugero ruri ku bipimo" },
            { step: 4, title: "Kurinda indwara (urume / kirabiranya)", timing: "Ibyumweru 5-8", advice: "Tera umuti mbere yuko imvura nyinshi igwa" },
            { step: 5, title: "Gusarura no kwanika ahari umwuka", timing: "Icyumweru cya 14-16", advice: "Rinda ibishyimbo/ibirayi kwangirika no kubora" },
          ],
          rabTips: "Gukoresha imbuto yemejwe na RAB byongera umusaruro hejuru ya 40%.",
        },
      });
    }

    const prompt = `Generate a precise, realistic agricultural business plan for a Rwandan farmer with the following specs:
Crop: ${crop}
Land Size: ${landSize} ${unit}
Budget Available: ${budget} RWF
District in Rwanda: ${district || "Musanze"}
Season: ${season || "Season A 2026"}
Output Language: ${language}

Return a valid JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Rwandan agricultural economist and agronomist. Output only valid JSON without markdown wrapping. Calculate exact numbers in RWF based on real Rwandan market conditions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            crop: { type: Type.STRING },
            landSize: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            budget: { type: Type.NUMBER },
            expectedYieldKg: { type: Type.NUMBER },
            expectedPricePerKg: { type: Type.NUMBER },
            expectedGrossRevenue: { type: Type.NUMBER },
            expectedNetProfit: { type: Type.NUMBER },
            budgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  notes: { type: Type.STRING },
                },
                required: ["category", "amount", "notes"],
              },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  advice: { type: Type.STRING },
                },
                required: ["step", "title", "timing", "advice"],
              },
            },
            rabTips: { type: Type.STRING },
          },
          required: [
            "title",
            "crop",
            "landSize",
            "unit",
            "budget",
            "expectedYieldKg",
            "expectedPricePerKg",
            "expectedGrossRevenue",
            "expectedNetProfit",
            "budgetBreakdown",
            "timeline",
            "rabTips",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({ plan: parsed });
  } catch (error: any) {
    console.error("Plan generation error:", error);
    res.status(500).json({ error: "Failed to generate agricultural plan", details: error?.message });
  }
});

// Vite Middleware for client serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TERIMBERE Platform server running on http://0.0.0.0:${PORT}`);
  });
}

start();
