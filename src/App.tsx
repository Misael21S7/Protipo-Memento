/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { 
  ShieldAlert, 
  Dna, 
  Binary, 
  Database, 
  Activity, 
  Terminal, 
  History as HistoryIcon, 
  RotateCcw, 
  Save, 
  ChevronRight,
  AlertTriangle,
  FileCode,
  UserCheck,
  Lock,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PrescriptionEditor, 
  TreatmentHistory, 
  TreatmentState, 
  PrescriptionMemento 
} from "./memento";

const INITIAL_STATE: TreatmentState = {
  researchSubject: "",
  clearanceLevel: 1,
  incubationPeriod: "",
  viralStrain: "T-Virus",
  sectorLocation: "Hive - Laboratory",
  supervisorId: "",
  notes: ""
};

export default function App() {
  // Originator maintains the current "working" state
  const [currentState, setCurrentState] = useState<TreatmentState>(INITIAL_STATE);
  
  // We use useMemo to persist instances across renders
  const editor = useMemo(() => new PrescriptionEditor(currentState), []);
  const historyManager = useMemo(() => new TreatmentHistory(), []);
  
  const [historyList, setHistoryList] = useState<PrescriptionMemento[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Synchronize editor state when currentState changes
  useEffect(() => {
    editor.State = currentState;
  }, [currentState, editor]);

  const handleSave = () => {
    const memento = editor.CreateMemento();
    historyManager.AddMemento(memento);
    setHistoryList(historyManager.GetAllMementos());
    setLastAction("CASE FILE BACKED UP - ACCESS GRANTED");
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleUndo = () => {
    if (historyManager.Count === 0) return;
    const memento = historyManager.PopMemento();
    if (memento) {
      editor.RestoreMemento(memento);
      setCurrentState(editor.State);
    }
    setHistoryList(historyManager.GetAllMementos());
    setLastAction("SYSTEM ROLLBACK INITIATED");
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleRestoreFromHistory = (index: number) => {
    const memento = historyManager.GetMemento(index);
    if (memento) {
      editor.RestoreMemento(memento);
      setCurrentState(editor.State);
      setLastAction("RESTORING ARCHIVED SUBJECT DATA");
    }
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentState(prev => ({
      ...prev,
      [name]: name === "clearanceLevel" ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 pb-12 font-sans selection:bg-red-600 selection:text-white">
      {/* Header */}
      <header className="bg-umbrella-dark border-b border-umbrella-red/30 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-umbrella-red rounded-none flex items-center justify-center text-white rotate-45 border-2 border-white shadow-[0_0_15px_rgba(204,0,0,0.5)]">
              <ShieldAlert size={28} className="-rotate-45" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tighter text-white uppercase italic">Umbrella Corp.</h1>
              <p className="text-[10px] text-umbrella-red font-mono uppercase tracking-[0.3em] font-bold">Biological Research Division</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex flex-col items-end border-r border-umbrella-red/20 pr-6">
                <span className="text-sm font-bold text-white tracking-tight">ALEX WESKER</span>
                <span className="text-[10px] text-umbrella-red uppercase font-bold tracking-widest leading-none">Senior Supervisor</span>
             </div>
             <div className="w-12 h-12 rounded-none bg-umbrella-gray border border-umbrella-red/40 flex items-center justify-center shadow-inner">
                <Lock size={22} className="text-umbrella-red" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Terminal Section */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-umbrella-gray/40 rounded-none border border-umbrella-red/20 shadow-2xl backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-umbrella-red to-transparent opacity-50"></div>
            
            <div className="bg-black/60 px-8 py-6 flex items-center justify-between border-b border-umbrella-red/10">
              <div>
                <h2 className="text-white text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Terminal className="text-umbrella-red" />
                  Subject Protocol Index
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-mono uppercase">Status: [SECURE CONNECTION ESTABLISHED]</p>
              </div>
              <Globe className="text-umbrella-red/20 w-12 h-12 animate-pulse" />
            </div>

            <div className="p-8">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Subject Name */}
                <div className="space-y-3 lg:col-span-2">
                  <label className="text-[10px] font-black text-umbrella-red uppercase tracking-[0.2em] flex items-center gap-2">
                    <Dna size={14} /> Research Subject ID
                  </label>
                  <input 
                    type="text"
                    name="researchSubject"
                    value={currentState.researchSubject}
                    onChange={handleInputChange}
                    placeholder="ENTER SUBJECT DESIGNATION..."
                    className="w-full px-5 py-4 bg-black/50 border border-umbrella-red/20 rounded-none focus:ring-1 focus:ring-umbrella-red focus:border-umbrella-red outline-none transition-all placeholder:text-umbrella-red/20 font-mono text-white text-sm"
                  />
                </div>

                {/* Viral Strain */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-umbrella-red uppercase tracking-[0.2em] flex items-center gap-2">
                    <Binary size={14} /> Viral Strain
                  </label>
                  <select 
                    name="viralStrain"
                    value={currentState.viralStrain}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 border border-umbrella-red/20 rounded-none focus:ring-1 focus:ring-umbrella-red focus:border-umbrella-red outline-none transition-all font-mono text-white text-sm appearance-none"
                  >
                    <option value="T-Virus">T-Virus (Tyrant)</option>
                    <option value="G-Virus">G-Virus (Golgotha)</option>
                    <option value="T-Veronica">T-Veronica</option>
                    <option value="Progentior">Progentior Virus</option>
                    <option value="Las Plagas">Las Plagas Parasite</option>
                  </select>
                </div>

                {/* Clearance Level */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-umbrella-red uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lock size={14} /> Access Clearance
                  </label>
                  <select 
                    name="clearanceLevel"
                    value={currentState.clearanceLevel}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 border border-umbrella-red/20 rounded-none focus:ring-1 focus:ring-umbrella-red focus:border-umbrella-red outline-none transition-all font-mono text-white text-sm appearance-none"
                  >
                    <option value={1}>LEVEL 1: General</option>
                    <option value={2}>LEVEL 2: Advanced</option>
                    <option value={3}>LEVEL 3: Restricted</option>
                    <option value={4}>LEVEL 4: Top Secret</option>
                    <option value={5}>LEVEL 5: ARCHIVED ONLY</option>
                  </select>
                </div>

                {/* Incubation Period */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-umbrella-red uppercase tracking-[0.2em] flex items-center gap-2">
                    <Database size={14} /> Incubation Period
                  </label>
                  <input 
                    type="text"
                    name="incubationPeriod"
                    value={currentState.incubationPeriod}
                    onChange={handleInputChange}
                    placeholder="72 HOURS / 1 WEEK..."
                    className="w-full px-5 py-4 bg-black/50 border border-umbrella-red/20 rounded-none focus:ring-1 focus:ring-umbrella-red focus:border-umbrella-red outline-none transition-all font-mono text-white text-sm"
                  />
                </div>

                {/* Sector Location */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-umbrella-red uppercase tracking-[0.2em] flex items-center gap-2">
                    <RotateCcw size={14} /> Facility Sector
                  </label>
                  <select 
                    name="sectorLocation"
                    value={currentState.sectorLocation}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 border border-umbrella-red/20 rounded-none focus:ring-1 focus:ring-umbrella-red focus:border-umbrella-red outline-none transition-all font-mono text-white text-sm appearance-none"
                  >
                    <option value="Hive - Laboratory">The Hive - Sub-Level 4</option>
                    <option value="Arklay Laboratory">Arklay Research Facility</option>
                    <option value="Rockfort Island">Rockfort Island Prison</option>
                    <option value="Antarctic Base">Antarctic Transport Terminal</option>
                  </select>
                </div>

                {/* Supervisor ID */}
                <div className="space-y-3 lg:col-span-2">
                  <label className="text-[10px] font-black text-umbrella-red uppercase tracking-[0.2em] flex items-center gap-2">
                    <UserCheck size={14} /> Assigned Supervisor
                  </label>
                  <input 
                    type="text"
                    name="supervisorId"
                    value={currentState.supervisorId}
                    onChange={handleInputChange}
                    placeholder="WESKER, A. / BIRKIN, W."
                    className="w-full px-5 py-4 bg-black/50 border border-umbrella-red/20 rounded-none focus:ring-1 focus:ring-umbrella-red focus:border-umbrella-red outline-none transition-all font-mono text-white text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6 pt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-umbrella-red hover:bg-umbrella-accent text-white font-black h-16 rounded-none flex items-center justify-center gap-4 transition-all active:scale-[0.98] uppercase tracking-widest shadow-[0_0_20px_rgba(204,0,0,0.3)] group"
                  >
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    Secure Data Memento
                  </button>
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyList.length === 0}
                    className="sm:w-auto px-10 bg-umbrella-gray border border-umbrella-red/30 hover:border-umbrella-red text-white font-black h-16 rounded-none flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    <RotateCcw size={20} />
                    Abort
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Terminal Logs */}
          <AnimatePresence>
            {lastAction && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-black border border-umbrella-red/50 text-umbrella-red p-5 rounded-none shadow-[0_0_30px_rgba(204,0,0,0.1)] flex items-center gap-4 font-mono text-xs uppercase italic"
              >
                <div className="bg-umbrella-red/20 p-2 border border-umbrella-red/40 animate-pulse">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="font-black tracking-widest">{lastAction}</p>
                  <p className="opacity-50 text-[10px]">TIMESTAMP: {new Date().toLocaleTimeString()}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Archives */}
        <div className="lg:col-span-4 space-y-6 font-mono">
          <section className="bg-umbrella-gray/20 rounded-none border border-umbrella-red/10 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-umbrella-red/20 bg-black/40">
              <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <HistoryIcon className="text-umbrella-red shadow-[0_0_10px_rgba(204,0,0,0.5)]" size={20} />
                Project Archives
              </h3>
              <p className="text-[10px] text-umbrella-red italic mt-1 font-bold">Encrypted Case File Snapshots</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
              {historyList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <ShieldAlert className="text-umbrella-red mb-4" size={48} />
                  <p className="text-xs font-bold uppercase tracking-widest text-umbrella-red">No archived experimental data detected</p>
                </div>
              ) : (
                [...historyList].reverse().map((memento, revIdx) => {
                  const originalIdx = historyList.length - 1 - revIdx;
                  const state = memento.SavedState;
                  return (
                    <motion.div 
                      key={originalIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-black/40 border-l-4 border-umbrella-red/20 hover:border-umbrella-red p-5 transition-all cursor-default"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-umbrella-red/10 text-umbrella-red text-[10px] font-black px-3 py-1 border border-umbrella-red/20 uppercase tracking-[0.2em]">
                          FILE #{originalIdx + 1}
                        </div>
                        <span className="text-[10px] text-slate-500">{memento.Date.split(',')[1]}</span>
                      </div>
                      
                      <div className="space-y-1 mb-6">
                        <p className="font-black text-white text-sm uppercase tracking-tight">{state.researchSubject || "ANONYMOUS SUBJECT"}</p>
                        <p className="text-[10px] text-umbrella-red uppercase font-bold tracking-tighter opacity-70">{state.viralStrain}</p>
                        <div className="flex gap-2 pt-2">
                           <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 border border-white/10 uppercase">
                             CLEARANCE {state.clearanceLevel}
                           </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRestoreFromHistory(originalIdx)}
                        className="w-full py-3 bg-umbrella-red/5 hover:bg-umbrella-red text-umbrella-red hover:text-white border border-umbrella-red/20 hover:border-transparent text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-2"
                      >
                        RESTORE DATA
                        <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="p-5 bg-umbrella-red/5 border-t border-umbrella-red/20">
              <div className="flex items-center gap-4 text-umbrella-red bg-black/60 p-4 border border-umbrella-red/30">
                <AlertTriangle size={24} className="shrink-0 drop-shadow-[0_0_5px_rgba(204,0,0,0.5)]" />
                <div>
                  <p className="text-[10px] leading-tight font-black uppercase italic tracking-tighter">
                    BIOHAZARD WARNING:
                  </p>
                  <p className="text-[9px] opacity-70 uppercase mt-1 leading-none font-bold">
                    Experimental data persistence failure may result in containment breach.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Pattern Explanation (Umbrella Corp System Specs) */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 pb-12">
        <div className="bg-umbrella-gray border border-umbrella-red/20 p-10 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-umbrella-red/5 rounded-full blur-[100px]"></div>
          
          <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tighter italic">
             <div className="w-10 h-10 bg-umbrella-red rotate-45 flex items-center justify-center shadow-lg border border-white/20">
                <FileCode size={20} className="-rotate-45 text-white" />
             </div>
             Behavioral Protocol: [MEMENTO]
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-mono">
            <div className="space-y-4">
              <h4 className="text-umbrella-red font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-umbrella-red"></div>
                ORIGINATOR
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed uppercase">
                THE <span className="text-white font-black italic">PRESCRIPTIONEDITOR</span> INTERFACE CAPTURES LIVE VIRAL DATA AND ENCAPSULATES SYSTEM STATES.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-umbrella-red font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-umbrella-red"></div>
                MEMENTO
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed uppercase">
                THE <span className="text-white font-black italic">PRESCRIPTIONMEMENTO</span> OBJECT SECURES READ-ONLY SHAPSHOTS OF CLINICAL TRIALS, PREVENTING DATA CORRUPTION.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-umbrella-red font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-umbrella-red"></div>
                CARETAKER
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed uppercase">
                THE <span className="text-white font-black italic">TREATMENTHISTORY</span> DATABASE ARCHIVES ALL PREVIOUS EXPERIMENTAL STATES FOR RAPID CONTINGENCY RESTORATION.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-umbrella-red/10 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-50 italic">
            <p className="text-[10px] font-bold text-umbrella-red tracking-widest uppercase">Property of Umbrella Corporation &copy; 1998-2026</p>
            <div className="flex gap-4 text-[9px] font-mono text-slate-500 uppercase font-black tracking-tighter">
              <span>Sector: RACOON-CITY/HIVE</span>
              <span>ID: NEST-II-ACCESS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
