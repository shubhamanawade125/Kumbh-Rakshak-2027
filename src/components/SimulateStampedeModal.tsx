import React, { useState } from 'react';
import { 
  X, 
  Play, 
  AlertTriangle, 
  Activity, 
  Sliders, 
  ShieldAlert, 
  Check 
} from 'lucide-react';
import { Sector } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sectors: Sector[];
  onInjectSurge: (sectorId: string, surgeDensity: number, triggerIncident: boolean) => void;
}

export const SimulateStampedeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sectors,
  onInjectSurge
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(sectors[0]?.id || 'sec-ramkund');
  const [surgeDensity, setSurgeDensity] = useState<number>(5.8);
  const [createEmergencyIncident, setCreateEmergencyIncident] = useState<boolean>(true);

  if (!isOpen) return null;

  const targetSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];

  const handleSimulate = () => {
    onInjectSurge(selectedSectorId, surgeDensity, createEmergencyIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border-2 border-rose-600 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-wide">
                  COMPRESSIVE STAMPEDE & SURGE SIMULATOR
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-mono font-bold">
                  SANDBOX
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stress-test real-time detection, diversion protocols, and AED golden timer resuscitation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3.5 bg-rose-950/40 rounded-2xl border border-rose-600/60 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-300 block">
                Crowd Shockwave Physics Model (Helbing Dynamics):
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                When density exceeds <strong>5.0 Persons/m²</strong>, crowd velocity collapses from laminar flow (&gt;0.5m/s) into stop-and-go turbulent shockwaves. Compressive physical pressures reach dangerous levels (&gt;1.5 PSI), requiring human diversion confirmation within 90 seconds.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">
              1. Target Sector to Inject Surge:
            </label>
            <select
              value={selectedSectorId}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              {sectors.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} (Current: {sec.density} P/m² • {sec.riskLevel})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-400" />
                <span>2. Injected Spatial Density:</span>
              </span>
              <span className="font-mono text-base font-black text-rose-400">
                {surgeDensity.toFixed(1)} P/m²
              </span>
            </div>

            <input
              type="range"
              min="3.0"
              max="7.5"
              step="0.1"
              value={surgeDensity}
              onChange={(e) => setSurgeDensity(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>3.0 (Warning)</span>
              <span>4.5 (Chokepoint)</span>
              <span>5.5 (Critical Crush)</span>
              <span>7.0+ (Severe Asphyxia)</span>
            </div>
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={createEmergencyIncident}
              onChange={(e) => setCreateEmergencyIncident(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <div>
              <span className="text-white font-bold block">Trigger Sudden Cardiac / Crush Collapse Event</span>
              <span className="text-slate-400 text-[10px]">
                Launches Golden 3-Min Defibrillation Timer & notifies foot-runner fleet
              </span>
            </div>
          </label>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSimulate}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition flex items-center gap-2 shadow-lg shadow-rose-950/60"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Inject Surge Wave into {targetSector.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
