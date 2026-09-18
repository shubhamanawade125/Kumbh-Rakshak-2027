import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Zap, 
  MapPin, 
  Ambulance, 
  CheckCircle2, 
  UserCheck, 
  Play
} from 'lucide-react';
import { Incident, AedStation, VolunteerResponder, AmbulanceUnit } from '../types';

interface Props {
  incidents: Incident[];
  aedStations: AedStation[];
  volunteers: VolunteerResponder[];
  ambulances: AmbulanceUnit[];
  onDispatchVolunteer: (incidentId: string, volunteerId: string) => void;
  onRequestAmbulance: (incidentId: string, ambulanceId: string) => void;
  onUpdateMedicalStatus: (incidentId: string, statusText: string) => void;
  onTriggerSimCollapse: () => void;
}

export const MedicalResponseView: React.FC<Props> = ({
  incidents,
  aedStations,
  volunteers,
  ambulances,
  onDispatchVolunteer,
  onRequestAmbulance,
  onUpdateMedicalStatus,
  onTriggerSimCollapse
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents.find(i => i.category === 'CARDIAC_ARREST' || i.category === 'HEAT_COLLAPSE')?.id || incidents[0]?.id
  );

  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const [timerSeconds, setTimerSeconds] = useState<number>(activeIncident?.goldenTimerRemainingSeconds || 165);

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const nearestAed = aedStations[0];
  const nearestVolunteer = volunteers[0];
  const nearestAmbulance = ambulances[0];

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-emerald-900/60 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Rapid Collapse & Foot-First AED Resuscitation Engine
            </h3>
            <p className="text-slate-400 text-[11px]">
              Workflow: <span className="text-rose-400 font-semibold">Incident</span> → 
              <span className="text-amber-400 font-semibold"> Location</span> → 
              <span className="text-emerald-400 font-semibold"> Nearest AED</span> → 
              <span className="text-cyan-400 font-semibold"> Responder</span> → 
              <span className="text-indigo-400 font-semibold"> CPR</span> → 
              <span className="text-purple-400 font-semibold"> 108 Ambulance Green Corridor</span>.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerSimCollapse}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5 shadow"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Simulate Sudden Collapse</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block px-1">
            Active Medical Distresses
          </span>

          <div className="space-y-2">
            {incidents
              .filter(i => i.category === 'CARDIAC_ARREST' || i.category === 'HEAT_COLLAPSE' || i.category === 'TRAUMA_CRUSH')
              .map((inc) => {
                const isSelected = inc.id === selectedIncidentId;

                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncidentId(inc.id);
                      setTimerSeconds(inc.goldenTimerRemainingSeconds || 165);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{inc.id}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700">
                        {inc.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs">{inc.title}</h4>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{inc.locationName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                      <span>Status: <strong className="text-emerald-400">{inc.status.replace(/_/g, ' ')}</strong></span>
                      <span className="font-mono text-rose-400 font-bold">
                        {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')} left
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border-2 border-rose-600/80 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
                  CRITICAL RESUSCITATION WINDOW (IRREVERSIBLE BRAIN DAMAGE CLOCK)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {activeIncident?.title || 'Pilgrim Collapse Incident'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{activeIncident?.locationName}</span>
                </p>
              </div>

              <div className="bg-slate-950/90 border border-rose-500/60 px-4 py-2.5 rounded-2xl text-center shadow-inner shrink-0">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                  Golden 3-Min Target
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-rose-400 tracking-tight">
                  0{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {timerSeconds > 0 ? 'DEFIBRILLATION WINDOW ACTIVE' : 'WINDOW EXCEEDED - ALS REQUIRED'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rose-900/60 flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => onUpdateMedicalStatus(activeIncident.id, 'CPR Started on Ground')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark CPR Started</span>
              </button>

              <button
                onClick={() => onUpdateMedicalStatus(activeIncident.id, 'AED Unit Delivered')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-1.5 shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>AED Delivered & Pads Applied</span>
              </button>

              <button
                onClick={() => onRequestAmbulance(activeIncident.id, nearestAmbulance.id)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 shadow"
              >
                <Ambulance className="w-3.5 h-3.5" />
                <span>Clear Green Corridor To Civil Hospital</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>1. Nearest AED</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">120m away</span>
              </div>
              <h5 className="font-bold text-white text-xs">{nearestAed.name}</h5>
              <p className="text-[11px] text-slate-400">{nearestAed.locationDescription}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Battery: <strong>{nearestAed.batteryLevel}%</strong></span>
                <span className="text-emerald-400 font-bold">READY TO SHOCK</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>2. Responder</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">65m away</span>
              </div>
              <h5 className="font-bold text-white text-xs">{nearestVolunteer.name}</h5>
              <p className="text-[11px] text-slate-400">{nearestVolunteer.role} • {nearestVolunteer.currentLocationName}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">ETA on Foot: <strong>1.2 min</strong></span>
                <span className="text-cyan-400 font-bold">EN ROUTE</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow">
              <div className="flex items-center justify-between text-indigo-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Ambulance className="w-4 h-4 text-indigo-400" />
                  <span>3. 108 Fleet</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">ETA 2.2 min</span>
              </div>
              <h5 className="font-bold text-white text-xs">{nearestAmbulance.callSign}</h5>
              <p className="text-[11px] text-slate-400">Doc: {nearestAmbulance.doctorOnBoard}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Traffic: <strong>PREEMPTED</strong></span>
                <span className="text-indigo-400 font-bold">GREEN CORRIDOR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
