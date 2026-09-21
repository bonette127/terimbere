export type Language = "rw" | "en" | "fr";

export type UserRole = "farmer" | "admin";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  district: string;
  sector: string;
  farmSizeHa: number;
  primaryCrop: string;
  avatarUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  district: string;
  sector: string;
  sizeHa: number;
  soilType: string;
  irrigationType: "rainfed" | "irrigated" | "swamp";
  mainCrops: string[];
  plantedDate?: string;
  status?: "In Progress" | "Completed" | "Planning";
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Season {
  id: string;
  name: string;
  code: "2025A" | "2025B" | "2025C" | "2026A" | "2026B" | "2026C";
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface BudgetBreakdownItem {
  category: string;
  amount: number;
  notes: string;
}

export interface PlanTimelineItem {
  step: number;
  title: string;
  timing: string;
  advice: string;
}

export interface FarmPlan {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  seasonCode: string;
  landSize: number;
  unit: string;
  budget: number;
  expectedYieldKg: number;
  expectedPricePerKg: number;
  expectedGrossRevenue: number;
  expectedNetProfit: number;
  budgetBreakdown: BudgetBreakdownItem[];
  timeline: PlanTimelineItem[];
  status: "planning" | "active" | "completed";
  rabTips?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | "seeds" 
  | "fertilizer" 
  | "pesticides" 
  | "labor" 
  | "irrigation" 
  | "transport" 
  | "equipment" 
  | "other";

export interface Expense {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  syncStatus: "synced" | "local_pending";
}

export type ActivityCategory = 
  | "land_prep" 
  | "planting" 
  | "fertilizing" 
  | "weeding" 
  | "spraying" 
  | "irrigation" 
  | "harvesting" 
  | "post_harvest";

export interface FarmActivity {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  title: string;
  category: ActivityCategory;
  dueDate: string;
  completedDate?: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo?: string;
  notes?: string;
}

export interface HarvestRecord {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  harvestDate: string;
  quantityKg: number;
  qualityGrade: "A" | "B" | "C";
  storageLocation: string;
  notes?: string;
}

export interface SaleRecord {
  id: string;
  farmId: string;
  crop: string;
  saleDate: string;
  buyerName: string;
  buyerType: "cooperative" | "wholesaler" | "local_market" | "retail";
  quantityKg: number;
  unitPriceRwf: number;
  totalAmountRwf: number;
  paymentMethod: "momo" | "airtel" | "cash" | "bank";
  notes?: string;
}

export interface CropDisease {
  name: string;
  symptoms: string;
  treatment: string;
}

export interface AgronomyGuide {
  id: string;
  cropKey: string;
  nameRw: string;
  nameEn: string;
  nameFr: string;
  bestVarieties: string[];
  soilRequirements: string;
  fertilizerGuide: string;
  spacing: string;
  maturityDays: number;
  averageYieldTonsHa: number;
  diseasesAndPests: CropDisease[];
  rabAdvice: string;
}

export interface MarketPrice {
  id: string;
  marketName: string;
  district: string;
  crop: string;
  priceMin: number;
  priceMax: number;
  priceAvg: number;
  unit: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

export interface WeatherForecast {
  district: string;
  province: string;
  tempC: number;
  conditionRw: string;
  conditionEn: string;
  conditionFr: string;
  rainfallMm: number;
  humidity: number;
  agriAdvisoryRw: string;
  agriAdvisoryEn: string;
  agriAdvisoryFr: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedPlan?: {
    cropName: string;
    area: number;
    unit: string;
    estimatedBudget: number;
    projectedYieldKg: number;
    targetPricePerKg: number;
    expectedGrossRevenue: number;
    expectedNetProfit: number;
    durationDays: number;
    phases: Array<{ phase: string; days: string; cost: number }>;
  };
}

export interface TrainingCourse {
  id: string;
  title: string;
  subtitle?: string;
  category: "potato" | "maize" | "fertilizer" | "modern" | "diseases" | "general";
  type: "course" | "video";
  durationMinutes: number;
  thumbnailUrl: string;
  description: string;
  instructor: string;
  rabCertified: boolean;
  videoUrl?: string;
}

export interface CultivationCycleStage {
  stageNumber: number;
  nameRw: string;
  nameEn: string;
  nameFr: string;
  periodWeeks: string;
  tasks: string[];
  keyInputs: string[];
  rabAdvice: string;
  status: "completed" | "current" | "upcoming";
}
