import React from 'react';
import { 
  Ambulance, 
  Navigation, 
  MapPin, 
  Phone
} from 'lucide-react';
import { AmbulanceUnit, GreenCorridor } from '../types';

interface Props {
  ambulances: AmbulanceUnit[];
  greenCorridor: GreenCorridor | null;
  onDispatchAmbulance: (ambulanceId: string) => void;
  onToggleGreenCorridor: () => void;
}

export const AmbulancesView: React.FC<Props> = ({
  ambulances,
  greenCorridor,
  onDispatchAmbulance,
  onToggleGreenCorridor
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-400">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Nashik Government 108 Emergency Fleet & Dynamic Green Corridor
            </h3>
            <p className="text-slate-400 text-[11px]">
              Advanced life support ambulances equipped with pre-emptive traffic signal coordination directly to Civil Hospital.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleGreenCorridor}
          className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 shadow-lg ${
            greenCorridor?.status === 'ACTIVE_TRANSIT'
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>{greenCorridor?.status === 'ACTIVE_TRANSIT' ? 'Override & Close Corridor' : 'Preempt Green Corridor to Civil Hospital'}</span>
        </button>
      </div>

      {greenCorridor && (
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h4 className="font-black text-white text-sm tracking-wide">
                DYNAMIC GREEN CORRIDOR IN PROGRESS
              </h4>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
              ETA {greenCorridor.estimatedTransitMinutes || greenCorridor.etaMinutes || 4.2} MIN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ORIGIN</span>
              <strong className="text-white">{greenCorridor.source || 'Ramkund Ghat Emergency Gate'}</strong>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DESTINATION</span>
              <strong className="text-white">{greenCorridor.targetHospital || greenCorridor.destination || 'Nashik Civil Hospital'}</strong>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TRAFFIC SIGNALS PREEMPTED</span>
              <strong className="text-emerald-400">{greenCorridor.trafficSignalsOverridden || 8} Intersections Cleared</strong>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ambulances.map((amb) => {
          const isDispatched = amb.status === 'DISPATCHED' || amb.status === 'TRANSIT_TO_HOSPITAL';

          return (
            <div
              key={amb.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{amb.callSign}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{amb.plateNumber} • {amb.type.replace(/_/g, ' ')}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isDispatched 
                    ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse' 
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}>
                  {amb.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Stationed: <strong>{amb.currentLocationName}</strong></span>
                </div>
                
                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Doctor: <strong className="text-slate-200">{amb.doctorOnBoard}</strong></span>
                    <a
                      href={`tel:${amb.doctorPhone || '108'}`}
                      className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 hover:bg-sky-900 font-bold flex items-center gap-1 transition"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{amb.doctorPhone || '108'}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Driver: <strong className="text-slate-200">{amb.driverName}</strong></span>
                    <a
                      href={`tel:${amb.driverPhone || '108'}`}
                      className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 font-bold flex items-center gap-1 transition"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{amb.driverPhone || '108'}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  GPS: <strong className="text-slate-200">Active (108 EMR)</strong>
                </span>
                {!isDispatched ? (
                  <button
                    onClick={() => onDispatchAmbulance(amb.id)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1 shadow"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Dispatch Unit</span>
                  </button>
                ) : (
                  <span className="text-rose-400 font-bold text-[11px]">En Route Scene</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
