/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { 
  Stethoscope, 
  Pill, 
  Clock, 
  Calendar, 
  Activity, 
  User, 
  History as HistoryIcon, 
  RotateCcw, 
  Save, 
  ChevronRight,
  AlertCircle,
  FileText,
  UserRound
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PrescriptionEditor, 
  TreatmentHistory, 
  TreatmentState, 
  PrescriptionMemento 
} from "./memento";

const INITIAL_STATE: TreatmentState = {
  medication: "",
  schedule: 8,
  treatmentDuration: "",
  dosage: "",
  administrationRoute: "Oral",
  attendingPhysician: "",
  notes: ""
};

export default function App() {
  // Originator maintains the current "working" state
  const [currentTreatment, setCurrentTreatment] = useState<TreatmentState>(INITIAL_STATE);
  
  // We use useMemo to persist instances across renders
  const editor = useMemo(() => new PrescriptionEditor(currentTreatment), []);
  const historyManager = useMemo(() => new TreatmentHistory(), []);
  
  const [historyList, setHistoryList] = useState<PrescriptionMemento[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Synchronize editor state when currentTreatment changes (form input)
  useEffect(() => {
    editor.State = currentTreatment;
  }, [currentTreatment, editor]);

  const handleSave = () => {
    // 1. Create backup (Memento) using the new CreateMemento method
    const memento = editor.CreateMemento();
    // 2. Add to history using AddMemento
    historyManager.AddMemento(memento);
    // 3. Update view history
    setHistoryList(historyManager.GetAllMementos());
    setLastAction("Memento saved successfully!");
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleUndo = () => {
    if (historyManager.Count === 0) return;
    
    // 1. Revert to last (similar to simple Pop logic)
    const memento = historyManager.PopMemento();
    if (memento) {
      // 2. Restore state from memento
      editor.RestoreMemento(memento);
      // 3. Update current state to match originator
      setCurrentTreatment(editor.State);
    }
    // 4. Update view history
    setHistoryList(historyManager.GetAllMementos());
    setLastAction("Change undone");
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleRestoreFromHistory = (index: number) => {
    // 1. Get memento by index (using GetMemento as in the C# example)
    const memento = historyManager.GetMemento(index);
    if (memento) {
      // 2. Restore state
      editor.RestoreMemento(memento);
      // 3. Update current state
      setCurrentTreatment(editor.State);
      setLastAction("Previous prescription restored");
    }
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTreatment(prev => ({
      ...prev,
      [name]: name === "schedule" ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-medical-500 rounded-xl flex items-center justify-center text-white">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-900">MediTrack</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tracking System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold">Dr. Alexander Fleming</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none">Treating Physician</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <UserRound size={20} className="text-slate-600" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-medical-900 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl font-bold flex items-center gap-3">
                  <FileText className="text-medical-200" />
                  New Medical Prescription
                </h2>
                <p className="text-medical-200/70 text-sm mt-1">Fill in current treatment details.</p>
              </div>
              <Activity className="text-medical-200/20 w-12 h-12" />
            </div>

            <div className="p-8">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medication */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Pill size={14} /> Prescribed Medication
                  </label>
                  <input 
                    type="text"
                    name="medication"
                    value={currentTreatment.medication}
                    onChange={handleInputChange}
                    placeholder="E.g. Paracetamol, Amoxicillin..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 font-medium"
                  />
                </div>

                {/* Dosage */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Dosage
                  </label>
                  <input 
                    type="text"
                    name="dosage"
                    value={currentTreatment.dosage}
                    onChange={handleInputChange}
                    placeholder="E.g. 500mg, 1 tablet..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Schedule (Every few hours)
                  </label>
                  <select 
                    name="schedule"
                    value={currentTreatment.schedule}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all font-medium appearance-none"
                  >
                    <option value={6}>Every 6 hours</option>
                    <option value={8}>Every 8 hours</option>
                    <option value={12}>Every 12 hours</option>
                    <option value={24}>Every 24 hours</option>
                  </select>
                </div>

                {/* Treatment Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Treatment Duration
                  </label>
                  <input 
                    type="text"
                    name="treatmentDuration"
                    value={currentTreatment.treatmentDuration}
                    onChange={handleInputChange}
                    placeholder="E.g. 7 days, 2 weeks..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>

                {/* Administration Route */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw size={14} /> Administration Route
                  </label>
                  <select 
                    name="administrationRoute"
                    value={currentTreatment.administrationRoute}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Oral">Oral</option>
                    <option value="Intravenous">Intravenous</option>
                    <option value="Topical">Topical</option>
                    <option value="Inhalation">Inhalation</option>
                  </select>
                </div>

                {/* Attending Physician */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Attending Physician
                  </label>
                  <input 
                    type="text"
                    name="attendingPhysician"
                    value={currentTreatment.attendingPhysician}
                    onChange={handleInputChange}
                    placeholder="Doctor's name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-medical-600 hover:bg-medical-700 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 shadow-md shadow-medical-500/20 transition-all active:scale-95"
                  >
                    <Save size={20} />
                    Save Memento
                  </button>
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyList.length === 0}
                    className="sm:w-auto px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold h-14 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw size={20} />
                    Undo
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Feedback Toast */}
          <AnimatePresence>
            {lastAction && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-medical-900 border-l-4 border-medical-400 text-white p-4 rounded-xl shadow-lg flex items-center gap-3"
              >
                <div className="bg-medical-400/20 p-2 rounded-full">
                  <AlertCircle size={18} className="text-medical-400" />
                </div>
                <p className="font-semibold text-sm">{lastAction}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: History Section */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <HistoryIcon className="text-medical-500" size={20} />
                Clinical History (Mementos)
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Restore previous treatment states</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {historyList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                    <HistoryIcon className="text-slate-200" size={32} />
                  </div>
                  <p className="text-slate-400 text-sm font-medium italic">No history of saved mementos yet.</p>
                </div>
              ) : (
                [...historyList].reverse().map((memento, revIdx) => {
                  const originalIdx = historyList.length - 1 - revIdx;
                  const state = memento.SavedState;
                  return (
                    <motion.div 
                      key={originalIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-medical-200 p-4 rounded-2xl transition-all hover:shadow-md cursor-default"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-medical-100/50 text-medical-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                          Memento #{originalIdx + 1}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{memento.Date.split(',')[1]}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-bold text-slate-800 text-sm truncate">{state.medication || "Unnamed"}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {state.dosage}
                          </span>
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            ev/{state.schedule}h
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">For {state.treatmentDuration}</p>
                      </div>

                      <button
                        onClick={() => handleRestoreFromHistory(originalIdx)}
                        className="mt-4 w-full py-2 bg-white group-hover:bg-medical-50 border border-slate-200 group-hover:border-medical-200 text-slate-600 group-hover:text-medical-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-sm active:scale-95"
                      >
                        Restore
                        <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[10px] leading-tight font-medium">
                  <strong>Medical Note:</strong> In case of allergy or unexpected reaction, return immediately to the previous Memento for review.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Pattern Explanation (Footer) */}
      <footer className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-slate-900 rounded-3xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-medical-400" />
             </div>
             Behavioral Pattern: Memento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-medical-400 font-bold text-xs uppercase tracking-widest leading-loose border-b border-white/10 pb-2">Originator</h4>
              <p className="text-slate-400 text-sm leading-relaxed lowercase-first">
                The <code className="text-medical-200 font-mono text-xs font-bold">PrescriptionEditor</code> class saves the current medical treatment state and creates Mementos.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-medical-400 font-bold text-xs uppercase tracking-widest leading-loose border-b border-white/10 pb-2">Memento</h4>
              <p className="text-slate-400 text-sm leading-relaxed lowercase-first">
                The <code className="text-medical-200 font-mono text-xs font-bold">PrescriptionMemento</code> class ensures that saved states are <span className="text-white italic">immutable</span>.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-medical-400 font-bold text-xs uppercase tracking-widest leading-loose border-b border-white/10 pb-2">Caretaker</h4>
              <p className="text-slate-400 text-sm leading-relaxed lowercase-first">
                The <code className="text-medical-200 font-mono text-xs font-bold">TreatmentHistory</code> class manages the mementos list without knowing internal state details.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
