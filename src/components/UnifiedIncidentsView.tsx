import React, { useState } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Filter, 
  Cpu, 
  Plus,
  Trash2
} from 'lucide-react';
import { Incident, IncidentStatus, IncidentTimelineEvent } from '../types';

interface Props {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onUpdateIncidentStatus: (incidentId: string, newStatus: IncidentStatus) => void;
  onAddTimelineEvent: (incidentId: string, event: Omit<IncidentTimelineEvent, 'id' | 'timestamp'>) => void;
  onOpenCreateModal?: () => void;
  onDeleteIncident?: (incidentId: string) => void;
  onClearAllIncidents?: () => void;
}

export const UnifiedIncidentsView: React.FC<Props> = ({
  incidents,
  onSelectIncident,
  onUpdateIncidentStatus,
  onAddTimelineEvent,
  onOpenCreateModal,
  onDeleteIncident,
  onClearAllIncidents
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [newActionInput, setNewActionInput] = useState('');

  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter(i => {
    if (filterSeverity === 'ALL') return true;
    return i.severity === filterSeverity;
  });

  const handleLogAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionInput.trim() || !activeIncident) return;

    onAddTimelineEvent(activeIncident.id, {
      actor: 'Command Operator',
      role: 'COMMAND_ADMIN',
      action: 'Field Directive Logged',
      details: newActionInput.trim(),
      type: 'HUMAN_DECISION'
    });

    setNewActionInput('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <h3 className="font-bold text-white text-sm">Unified Incident Command & Audit Trail</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {incidents.length} Registered Events
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'WATCH'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  filterSeverity === sev
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {onClearAllIncidents && incidents.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Delete all registered incidents and make the console clean?')) {
                  onClearAllIncidents();
                }
              }}
              title="Delete all incidents to clear the log"
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-200 text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clean / Clear All</span>
            </button>
          )}

          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-rose-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Incident</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredIncidents.map((inc) => {
            const isSelected = inc.id === selectedIncidentId;
            const isCritical = inc.severity === 'CRITICAL';

            return (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedIncidentId(inc.id);
                  onSelectIncident(inc);
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 border-rose-500 ring-1 ring-rose-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{inc.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isCritical ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{inc.timestamp}</span>
                </div>

                <h4 className="font-bold text-white text-xs">{inc.title}</h4>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{inc.locationName}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800">
                  <span className="text-slate-400">Source: <strong className="text-slate-200">{inc.source}</strong></span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{inc.status.replace(/_/g, ' ')}</span>
                    {onDeleteIncident && (
                      <button
                        type="button"
                        title={`Delete incident ${inc.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteIncident(inc.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/60 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-7 space-y-3">
          {activeIncident && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{activeIncident.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      Category: {activeIncident.category}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">{activeIncident.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeIncident.locationName}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 text-right">Update Status:</span>
                    <select
                      value={activeIncident.status}
                      onChange={(e) => onUpdateIncidentStatus(activeIncident.id, e.target.value as IncidentStatus)}
                      className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                    >
                      <option value="DETECTED">DETECTED</option>
                      <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                      <option value="RESPONDER_DISPATCHED">RESPONDER DISPATCHED</option>
                      <option value="ACTION_IN_PROGRESS">ACTION IN PROGRESS</option>
                      <option value="STABILIZED">STABILIZED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>

                  {onDeleteIncident && (
                    <button
                      type="button"
                      onClick={() => onDeleteIncident(activeIncident.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Incident</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-cyan-900/60 p-3 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-semibold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> AI Recommended Action Protocol
                  </span>
                  <span className="font-mono">{Math.round(activeIncident.aiConfidence * 100)}% Confidence</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeIncident.aiRecommendation}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Chronological Event Timeline:
                </span>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {activeIncident.history.map((ev, idx) => {
                    const isAi = ev.type === 'AI_DETECTION';
                    const isHuman = ev.type === 'HUMAN_DECISION';

                    return (
                      <div key={ev.id || idx} className="relative group">
                        <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                          isAi ? 'bg-cyan-500' : isHuman ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />

                        <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span>{ev.action}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                isAi ? 'bg-cyan-950 text-cyan-300' : isHuman ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                              }`}>
                                {ev.type}
                              </span>
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">{ev.timestamp}</span>
                          </div>

                          <p className="text-[11px] text-slate-300">{ev.details}</p>
                          <div className="text-[10px] text-slate-400 pt-0.5">
                            Actor: <strong className="text-slate-200">{ev.actor}</strong> ({ev.role})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleLogAction} className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Log manual operator command or field feedback..."
                  value={newActionInput}
                  onChange={(e) => setNewActionInput(e.target.value)}
                  className="flex-1 bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Log Directive
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
