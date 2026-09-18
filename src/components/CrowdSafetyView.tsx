import React, { useState } from 'react';
import { 
  Eye, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Video,
  Check,
  RotateCcw,
  Map as MapIcon,
  Navigation
} from 'lucide-react';
import { GoogleTacticalMap } from './GoogleTacticalMap';
import { INITIAL_AED_STATIONS, INITIAL_MEDICAL_CAMPS } from '../data/nashikData';
import { Sector } from '../types';

interface Props {
  sectors: Sector[];
  onSelectSector: (sector: Sector) => void;
  onConfirmDiversion: (sectorId: string, diversionRoute: string) => void;
  onResetDiversion: (sectorId: string) => void;
  onOpenLiveStreetMonitor?: (locationId?: string) => void;
}

export const CrowdSafetyView: React.FC<Props> = ({
  sectors,
  onSelectSector,
  onConfirmDiversion,
  onResetDiversion,
  onOpenLiveStreetMonitor
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(sectors[0]?.id || 'sec-ramkund');
  const [activeTab, setActiveTab] = useState<'MAP_FLOW' | 'AI_VISION' | 'VELOCITY_VECTORS'>('MAP_FLOW');
  const [operatorApproved, setOperatorApproved] = useState<Record<string, boolean>>({});

  const activeSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];

  const handleApproveAction = (sectorId: string, route: string) => {
    setOperatorApproved(prev => ({ ...prev, [sectorId]: true }));
    onConfirmDiversion(sectorId, route);
  };

  const handleClearAction = (sectorId: string) => {
    setOperatorApproved(prev => ({ ...prev, [sectorId]: false }));
    onResetDiversion(sectorId);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner explaining AI Decision Support Principle */}
      <div className="bg-slate-900 border border-cyan-900/60 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Ghat Crowd Fluid Dynamics & Real-Time Geospatial Safety Map
            </h3>
            <p className="text-slate-400 text-[11px]">
              Decision-support engine based on compressible crowd physics: 
              <span className="text-cyan-400 font-semibold"> AI Detection</span> → 
              <span className="text-amber-400 font-semibold"> Human Operator Decision</span> → 
              <span className="text-emerald-400 font-semibold"> Executed Action</span>.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('MAP_FLOW')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'MAP_FLOW' 
                ? 'bg-cyan-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map & Heat</span>
          </button>
          <button
            onClick={() => setActiveTab('AI_VISION')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'AI_VISION' 
                ? 'bg-cyan-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Density Homography</span>
          </button>
          <button
            onClick={() => setActiveTab('VELOCITY_VECTORS')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'VELOCITY_VECTORS' 
                ? 'bg-cyan-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Optical Vectors</span>
          </button>
          <button
            onClick={() => {
              const locId = selectedSectorId.includes('ramkund') 
                ? 'loc-ramkund' 
                : selectedSectorId.includes('laxman') 
                ? 'loc-laxman' 
                : selectedSectorId.includes('kalaram') 
                ? 'loc-panchavati' 
                : 'loc-tapovan';
              onOpenLiveStreetMonitor?.(locId);
            }}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm transition"
          >
            <Video className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
            <span>Live Street CCTV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
            <span>Monitored Ghat Zones</span>
            <span className="font-mono text-cyan-400">{sectors.length} Sectors Active</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {sectors.map((sec) => {
              const isSelected = sec.id === selectedSectorId;
              const isCritical = sec.riskLevel === 'CRITICAL_CRUSH';
              const isWarning = sec.riskLevel === 'HIGH_WARNING';

              return (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectorId(sec.id);
                    onSelectSector(sec);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg'
                      : isCritical
                      ? 'bg-rose-950/30 border-rose-800/80 hover:bg-rose-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{sec.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-rose-950 text-rose-300 border-rose-600'
                        : isWarning
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}>
                      {sec.riskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px]">DENSITY</span>
                      <span className={`font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-white'}`}>
                        {sec.density} P/m²
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">VELOCITY</span>
                      <span className="font-mono text-slate-200">
                        {sec.velocityMps || 0.45} m/s
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">FLOW RATE</span>
                      <span className="font-mono text-slate-200">
                        {sec.flowRate} /min
                      </span>
                    </div>
                  </div>

                  {sec.bottleneckActive && (
                    <div className="mt-2 text-[10px] text-rose-300 bg-rose-950/60 border border-rose-800/60 px-2 py-1 rounded-lg flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>Chokepoint Bottleneck Detected</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'MAP_FLOW' ? (
            <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <GoogleTacticalMap
                sectors={sectors}
                aedStations={INITIAL_AED_STATIONS}
                medicalCamps={INITIAL_MEDICAL_CAMPS}
                selectedSector={activeSector}
                ambulancePathActive={true}
                onSelectSector={(s) => {
                  setSelectedSectorId(s.id);
                  onSelectSector(s);
                }}
              />
              <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 shadow-xl flex items-center gap-3">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  Active Focus: {activeSector.name}
                </span>
                <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                  Density: {activeSector.density} P/m²
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-white font-mono">{activeSector.cameraZoneId || 'CCTV-048-RAMKUND'}</span>
                  <span className="text-slate-400">({activeSector.name})</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                  <span>FPS: <strong className="text-emerald-400">30.2</strong></span>
                  <span>LATENCY: <strong className="text-emerald-400">14ms</strong></span>
                  <span>RESOLUTION: <strong className="text-slate-300">1080p</strong></span>
                </div>
              </div>

              <div className="relative h-72 sm:h-80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                {activeTab === 'AI_VISION' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className={`w-52 h-52 rounded-full blur-2xl opacity-60 transition-all duration-700 ${
                      activeSector.riskLevel === 'CRITICAL_CRUSH' 
                        ? 'bg-rose-600 scale-125 animate-pulse' 
                        : activeSector.riskLevel === 'HIGH_WARNING'
                        ? 'bg-amber-500 scale-100'
                        : 'bg-emerald-500 scale-75'
                    }`} />
                    <div className="absolute text-center space-y-1">
                      <span className="text-4xl sm:text-5xl font-black font-mono text-white drop-shadow-md">
                        {activeSector.density} <span className="text-lg font-normal text-slate-300">P/m²</span>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider block text-slate-300">
                        {activeSector.riskLevel.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Safe Threshold: &lt; 4.0 P/m²
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center text-center space-y-2">
                    <div className="grid grid-cols-5 gap-3 opacity-70">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center text-cyan-400">
                          <ArrowRight className={`w-5 h-5 transform ${
                            activeSector.riskLevel === 'CRITICAL_CRUSH' ? 'rotate-90 text-rose-400 animate-ping' : 'rotate-45'
                          }`} />
                          <span className="text-[9px] font-mono text-slate-400">{activeSector.velocityMps || 0.4}m/s</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 text-xs text-cyan-300 font-mono">
                      Flow Direction: {activeSector.flowDirection || 'NORTH_TO_SOUTH'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Multi-Stage Decision-Support Protocol</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-1.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  1. AI Early Detection
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeSector.riskLevel === 'CRITICAL_CRUSH'
                    ? 'Turbulent velocity drop & density exceeded 4.5 P/m². Potential shockwave within 15 mins.'
                    : 'Laminar flow maintained. Velocity and flow within normal riverbank capacity.'}
                </p>
                <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  Confidence: <strong>{activeSector.riskLevel === 'CRITICAL_CRUSH' ? '96%' : '88%'}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-amber-800/60 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  2. Human Operator Decision
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeSector.riskLevel === 'CRITICAL_CRUSH'
                    ? 'Recommended: Deploy barrier diversion to Laxman Promenade North Bypass.'
                    : 'No diversion required. Continue automated monitoring.'}
                </p>
                <div className="pt-1 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Authorization:</span>
                  <span className={`font-bold text-[10px] ${
                    operatorApproved[activeSector.id] ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {operatorApproved[activeSector.id] ? 'APPROVED' : 'AWAITING OPERATOR'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  3. Executed Field Action
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeSector.activeDiversion || 'No diversion active on this sector.'}
                </p>
                <div className="pt-1 border-t border-slate-800 flex items-center gap-1 text-[10px] text-slate-400">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Verified by Ghat Sector Officers</span>
                </div>
              </div>
            </div>

            {activeSector.riskLevel === 'CRITICAL_CRUSH' && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
                {activeSector.activeDiversion ? (
                  <button
                    onClick={() => handleClearAction(activeSector.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Diversion Route</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleApproveAction(activeSector.id, 'Diverting inbound queue via Laxman Ghat North lane')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Deploy Diversion Barricades</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
