import React from 'react';
import { 
  Radio, 
  X, 
  TrendingUp, 
  Signal, 
  Activity, 
  Smartphone, 
  ShieldAlert, 
  Compass,
  Layers
} from 'lucide-react';
import { CellTower, NASHIK_CELL_TOWERS } from '../data/cellTowerData';

interface Props {
  isOpen: boolean;
  selectedTower: CellTower | null;
  onClose: () => void;
  onSelectTower: (tower: CellTower) => void;
}

export const CellTowerCrowdInsightsModal: React.FC<Props> = ({
  isOpen,
  selectedTower,
  onClose,
  onSelectTower
}) => {
  if (!isOpen) return null;

  const activeTower = selectedTower || NASHIK_CELL_TOWERS[0];
  const totalNetworkSims = NASHIK_CELL_TOWERS.reduce((acc, t) => acc + t.totalSimCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        <div className="bg-slate-950 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm sm:text-base">
                  Telecom Cellular Tower (CDR) Crowd Telemetry Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold text-[10px] uppercase">
                  TRAI / DoT Shared Mesh
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aggregated, anonymized active SIM attachment density across Jio, Airtel, Vi & BSNL base stations
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase">Total Attached SIMs</span>
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-black font-mono text-white mt-1">
              {totalNetworkSims.toLocaleString()} <span className="text-xs font-normal text-slate-400">active</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2% ingress surge (1h)
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase">COW Towers Deployed</span>
              <Signal className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-lg font-black font-mono text-indigo-300 mt-1">
              5 Primary Nodes
            </div>
            <span className="text-[10px] text-slate-400">12 Multi-beam Sectors</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase">Peak Ingress Gateway</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-base font-extrabold text-rose-300 mt-1 truncate">
              Nashik Rd Railway
            </div>
            <span className="text-[10px] text-rose-400 font-mono font-bold">+32.6% hourly surge</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase">Backhaul Latency</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black font-mono text-emerald-400 mt-1">
              11.2 ms
            </div>
            <span className="text-[10px] text-slate-400">Fiber-optic Rings Synced</span>
          </div>
        </div>

        <div className="bg-slate-950/40 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Select Tower Node:
          </span>
          {NASHIK_CELL_TOWERS.map((t) => {
            const isSelected = activeTower.id === t.id;
            const isOverload = t.riskLevel === 'OVERLOAD';
            const isCongested = t.riskLevel === 'CONGESTED';
            return (
              <button
                key={t.id}
                onClick={() => onSelectTower(t)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  isOverload ? 'bg-rose-400 animate-ping' : isCongested ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span>{t.towerCode}</span>
                <span className="opacity-80 font-mono text-[10px]">({(t.totalSimCount / 1000).toFixed(0)}k)</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                      {activeTower.towerCode} • {activeTower.operator.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-0.5">{activeTower.name}</h4>
                    <span className="text-xs text-slate-400">{activeTower.locationName}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full font-mono font-black text-xs border ${
                    activeTower.riskLevel === 'OVERLOAD'
                      ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                      : activeTower.riskLevel === 'CONGESTED'
                      ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                      : 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  }`}>
                    {activeTower.riskLevel === 'OVERLOAD' ? 'HIGH CONGESTION' : activeTower.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">Radius Coverage</span>
                    <span className="font-bold text-white text-sm">{activeTower.cellRadiusMeters} meters</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">Active Devices</span>
                    <span className="font-bold text-indigo-300 text-sm">{activeTower.totalSimCount.toLocaleString()} SIMs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">Hourly Trend</span>
                    <span className={`font-bold text-sm ${activeTower.trendPercentage > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      +{activeTower.trendPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>Directional Antenna Sectors (Azimuth Beams)</span>
                  </h5>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeTower.sectors.length} Active Directional Sectors
                  </span>
                </div>

                <div className="space-y-2">
                  {activeTower.sectors.map((sec) => {
                    const pct = Math.round((sec.activeAttachedSims / sec.capacitySims) * 100);
                    return (
                      <div key={sec.sectorId} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-bold">
                              {sec.azimuthDeg}° Azimuth ({sec.beamWidthDeg}° Beam)
                            </span>
                            <span className="font-bold text-white">{sec.sectorId}</span>
                          </div>
                          <span className={`font-mono font-bold ${pct >= 95 ? 'text-rose-400' : pct >= 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {pct}% Saturation
                          </span>
                        </div>

                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 95 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{sec.activeAttachedSims.toLocaleString()} / {sec.capacitySims.toLocaleString()} SIMs attached</span>
                          <span className="text-slate-500">
                            Jio: {sec.dominantOperatorShare.jio}% | Airtel: {sec.dominantOperatorShare.airtel}% | Vi: {sec.dominantOperatorShare.vi}% | BSNL: {sec.dominantOperatorShare.bsnl}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3.5">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5 text-xs text-slate-300">
                <h5 className="font-bold text-white flex items-center gap-1.5 text-sm">
                  <Signal className="w-4 h-4 text-indigo-400" />
                  <span>How Phone Tower Data Works on Google Maps</span>
                </h5>

                <p className="leading-relaxed text-slate-300">
                  Telecom towers track active device radio handshakes without needing GPS or installed apps:
                </p>

                <ol className="space-y-2 list-decimal list-inside text-[11px] text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-white">Active RRC Connections:</strong> Base stations (eNodeB/gNodeB) continuously record the count of attached SIMs in each directional sector.
                  </li>
                  <li>
                    <strong className="text-white">Timing Advance & Trilateration:</strong> Radio signal propagation delay calculates distance rings from the mast.
                  </li>
                  <li>
                    <strong className="text-white">Circle Overlays on Maps:</strong> On the Google Tactical Map, the glowing translucent circle represents the cell radius, color-coded by capacity.
                  </li>
                  <li>
                    <strong className="text-white">Predictive Surge Alerts:</strong> When railway and highway towers show sudden +30% SIM spikes, police know a surge is reaching Ramkund 90 minutes in advance.
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-400">
                <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy & TRAI Compliance</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  All cellular telemetry is fully anonymized and aggregated into 10-minute sector totals under National Disaster Management Authority (NDMA) & TRAI public safety protocols. No personal phone numbers or private messages are ever read or retained.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Nashik Police Disaster Control & Cellular Operations Center</span>
            <span>•</span>
            <span className="text-indigo-400 font-bold">5G / 4G Carrier Aggregated</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
