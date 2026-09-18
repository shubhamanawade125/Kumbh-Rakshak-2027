import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Incident, Sector } from '../types';

interface Props {
  incidents?: Incident[];
  sectors?: Sector[];
  onNavigateIncidents?: () => void;
  onNavigateSectors?: () => void;
}

export const ReferenceRightPanel: React.FC<Props> = ({
  incidents = [],
  sectors = [],
  onNavigateIncidents,
  onNavigateSectors
}) => {
  const [activeTab, setActiveTab] = useState<'LIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('LIVE');
  const [acknowledgedAlert, setAcknowledgedAlert] = useState(false);

  const criticalIncident = incidents.find(i => i.severity === 'CRITICAL') || incidents[0];
  const criticalSector = sectors.find(s => s.riskLevel === 'CRITICAL_CRUSH' || s.density > 4.0) || sectors[0];

  const liveIncidents = incidents.filter(i => {
    if (activeTab === 'LIVE') return i.status === 'DETECTED' || i.status === 'RESPONDER_DISPATCHED' || i.status === 'ACTION_IN_PROGRESS';
    if (activeTab === 'ACKNOWLEDGED') return i.status === 'ACKNOWLEDGED';
    if (activeTab === 'RESOLVED') return i.status === 'RESOLVED';
    return true;
  });

  return (
    <aside className="w-80 shrink-0 space-y-3 select-none">
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold text-sm">⦾</span>
            <h3 className="text-sm font-bold text-slate-900">AI Insights</h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Analysis
          </span>
        </div>

        {criticalIncident ? (
          <div className="rounded-xl p-3 bg-rose-50/70 border border-rose-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                  !
                </span>
                <span className="text-xs font-black tracking-wide text-rose-700 uppercase">
                  {criticalIncident.severity}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 font-mono">
                {criticalIncident.timestamp || 'Live'}
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 leading-snug">
              {criticalIncident.title}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-0.5">
              <span>
                Location: <strong className="text-slate-900 font-bold">{criticalIncident.locationName}</strong>
              </span>
            </div>

            {criticalSector && (
              <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-0.5">
                <span>
                  Density <strong className="text-slate-900 font-bold">{criticalSector.density} P/m²</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span>
                  Flow <strong className="text-rose-600 font-bold">{criticalSector.velocityMps || 0.3} m/s</strong>
                </span>
              </div>
            )}

            {onNavigateIncidents && (
              <div className="pt-1">
                <button 
                  onClick={onNavigateIncidents}
                  className="text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1 transition"
                >
                  View Incident Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-3 bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 text-xs">
            No critical incidents active. All sectors operating within normal density parameters.
          </div>
        )}

        {criticalIncident?.aiRecommendation ? (
          <div className="rounded-xl p-3 bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                  ⚡
                </span>
                <span className="text-xs font-black tracking-wide text-amber-800 uppercase">
                  AI RECOMMENDATION
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Confidence {Math.round((criticalIncident.aiConfidence || 0.92) * 100)}%</span>
            </div>

            <p className="text-xs font-bold text-slate-900 leading-snug">
              {criticalIncident.aiRecommendation}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setAcknowledgedAlert(!acknowledgedAlert)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition shadow-xs ${
                  acknowledgedAlert
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {acknowledgedAlert ? 'Acknowledged ✓' : 'Acknowledge'}
              </button>
              {onNavigateSectors && (
                <button 
                  onClick={onNavigateSectors}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                >
                  View Sector
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`pb-1 transition ${
              activeTab === 'LIVE'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'hover:text-slate-800'
            }`}
          >
            Live ({incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'ACKNOWLEDGED').length})
          </button>
          <button
            onClick={() => setActiveTab('ACKNOWLEDGED')}
            className={`pb-1 transition ${
              activeTab === 'ACKNOWLEDGED'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'hover:text-slate-800'
            }`}
          >
            Acknowledged ({incidents.filter(i => i.status === 'ACKNOWLEDGED').length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`pb-1 transition ${
              activeTab === 'RESOLVED'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'hover:text-slate-800'
            }`}
          >
            Resolved ({incidents.filter(i => i.status === 'RESOLVED').length})
          </button>
        </div>

        <div className="space-y-3 divide-y divide-slate-100/70 max-h-60 overflow-y-auto pr-1">
          {liveIncidents.length > 0 ? (
            liveIncidents.map((item) => (
              <div key={item.id} className="pt-2.5 first:pt-0 flex items-start gap-2.5">
                <span className="text-[10px] font-mono font-medium text-slate-400 shrink-0 w-14 truncate">
                  {item.timestamp || 'Now'}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  item.severity === 'CRITICAL' ? 'bg-rose-500' : item.severity === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                } shrink-0 mt-1.5`}></span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate leading-tight">
                    {item.locationName} • {item.source}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-3 text-center">
              No incidents in {activeTab.toLowerCase()} category.
            </p>
          )}
        </div>

        {onNavigateIncidents && (
          <div className="pt-2 text-center border-t border-slate-100">
            <button 
              onClick={onNavigateIncidents}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 inline-flex items-center gap-1 transition"
            >
              View Incident Command <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-amber-100/70 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs select-none">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-800">
          <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 L10 7 L9 11 L10 14 L12 15 L14 14 L15 11 L14 7 Z" />
            <path d="M8 8 L7 12 L8 15 L10 17 L12 18" />
            <path d="M16 8 L17 12 L16 15 L14 17 L12 18" />
            <path d="M6 14 L5 17 L7 20 L10 21" />
            <path d="M18 14 L19 17 L17 20 L14 21" />
          </svg>
        </div>

        <div className="space-y-0.5">
          <h4 className="font-serif italic font-bold text-slate-900 text-xs sm:text-[13px] leading-snug font-['Playfair_Display',serif]">
            Faith Brings Us Here
          </h4>
          <p className="font-serif italic font-bold text-slate-700 text-xs sm:text-[13px] leading-snug font-['Playfair_Display',serif]">
            Safety Keeps Us Together
          </p>
        </div>
      </div>
    </aside>
  );
};
