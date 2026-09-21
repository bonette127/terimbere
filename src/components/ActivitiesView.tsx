import React, { useState } from "react";
import { ActivityCategory, Farm, FarmActivity, Language } from "../types";
import { getTranslation } from "../i18n";
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  User,
  AlertCircle,
} from "lucide-react";

interface ActivitiesViewProps {
  activities: FarmActivity[];
  farms: Farm[];
  language: Language;
  onAddActivity: (activity: Omit<FarmActivity, "id">) => void;
  onUpdateStatus: (id: string, status: "pending" | "in_progress" | "completed") => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  farms,
  language,
  onAddActivity,
  onUpdateStatus,
  onDeleteActivity,
}) => {
  const t = getTranslation(language);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form state
  const [farmId, setFarmId] = useState(farms[0]?.id || "");
  const [crop, setCrop] = useState("Ibirayi (Kinigi)");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("weeding");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const farm = farms.find((f) => f.id === farmId) || farms[0];
    onAddActivity({
      farmId: farm ? farm.id : "farm-1",
      farmName: farm ? farm.name : "Umurima",
      crop,
      title: title.trim(),
      category,
      dueDate,
      status: "pending",
      assignedTo: assignedTo.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle("");
    setNotes("");
    setAssignedTo("");
    setIsModalOpen(false);
  };

  const filtered = activities.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const categoryLabels: Record<ActivityCategory, string> = {
    land_prep: t.actLandPrep,
    planting: t.actPlanting,
    fertilizing: t.actFertilizing,
    weeding: t.actWeeding,
    spraying: t.actSpraying,
    irrigation: t.actIrrigation,
    harvesting: t.actHarvesting,
    post_harvest: t.actPostHarvest,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.activitiesTitle}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {t.activitiesSubtitle}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addActivity}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-stone-200 text-xs font-bold">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3.5 py-2 rounded-lg transition-all ${
            statusFilter === "all"
              ? "bg-emerald-800 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {t.all} ({activities.length})
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-3.5 py-2 rounded-lg transition-all ${
            statusFilter === "pending"
              ? "bg-stone-800 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {t.statusPending} ({activities.filter((a) => a.status === "pending").length})
        </button>
        <button
          onClick={() => setStatusFilter("in_progress")}
          className={`px-3.5 py-2 rounded-lg transition-all ${
            statusFilter === "in_progress"
              ? "bg-amber-600 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {t.statusInProgress} ({activities.filter((a) => a.status === "in_progress").length})
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3.5 py-2 rounded-lg transition-all ${
            statusFilter === "completed"
              ? "bg-emerald-600 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {t.statusCompleted} ({activities.filter((a) => a.status === "completed").length})
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300">
            <CalendarCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">Nta gikorwa kigaragara muri iki cyiciro.</p>
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                act.status === "completed"
                  ? "border-stone-200 bg-stone-50/50 opacity-80"
                  : act.status === "in_progress"
                  ? "border-amber-300 ring-1 ring-amber-200"
                  : "border-stone-200 hover:border-emerald-500"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Status Toggle Button */}
                <button
                  onClick={() => {
                    const nextStatus =
                      act.status === "pending"
                        ? "in_progress"
                        : act.status === "in_progress"
                        ? "completed"
                        : "pending";
                    onUpdateStatus(act.id, nextStatus);
                  }}
                  title="Kanda uhindure uko bihagaze"
                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    act.status === "completed"
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : act.status === "in_progress"
                      ? "bg-amber-500 border-amber-500 text-white"
                      : "border-stone-300 hover:border-emerald-600 text-transparent"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={`text-base font-bold ${
                        act.status === "completed"
                          ? "line-through text-stone-400"
                          : "text-stone-900"
                      }`}
                    >
                      {act.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700">
                      {categoryLabels[act.category] || act.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-500">
                    <span className="font-semibold text-emerald-800">
                      {act.farmName} ({act.crop})
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.dueDate}: {act.dueDate}</span>
                    </span>
                    {act.assignedTo && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1 text-stone-700 font-medium">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{act.assignedTo}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {act.notes && (
                    <p className="mt-2 text-xs text-stone-600 italic bg-stone-50 p-2 rounded-lg">
                      "{act.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center justify-between sm:justify-end space-x-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <select
                  value={act.status}
                  onChange={(e) => onUpdateStatus(act.id, e.target.value as any)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-hidden ${
                    act.status === "completed"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : act.status === "in_progress"
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  <option value="pending">{t.statusPending}</option>
                  <option value="in_progress">{t.statusInProgress}</option>
                  <option value="completed">{t.statusCompleted}</option>
                </select>

                <button
                  onClick={() => onDeleteActivity(act.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">{t.addActivity}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Umurima (Farm)
                </label>
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Izina ry'igikorwa (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Urugero: Kubagara no gusasira ibirayi bwa kabiri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Icyiciro (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  >
                    <option value="land_prep">{t.actLandPrep}</option>
                    <option value="planting">{t.actPlanting}</option>
                    <option value="fertilizing">{t.actFertilizing}</option>
                    <option value="weeding">{t.actWeeding}</option>
                    <option value="spraying">{t.actSpraying}</option>
                    <option value="irrigation">{t.actIrrigation}</option>
                    <option value="harvesting">{t.actHarvesting}</option>
                    <option value="post_harvest">{t.actPostHarvest}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Igihingwa (Crop)
                  </label>
                  <input
                    type="text"
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.dueDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ushinzwe kubikora (Worker)
                  </label>
                  <input
                    type="text"
                    placeholder="Urugero: Kanyarwanda Jean"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Amabwiriza y'ubuhinzi (Notes)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Urugero: Kwitondera imizi y'ibirayi mu gihe cyo gusasira..."
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
