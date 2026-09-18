import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  Eye, 
  MapPin, 
  Activity, 
  Navigation, 
  Maximize2, 
  Search
} from 'lucide-react';
import { NASHIK_PUBLIC_CCTV_CAMERAS } from '../data/cctvData';

interface Props {
  onOpenLiveStreetMonitor?: (locationId?: string) => void;
  onLocateOnMap?: (coordinates: { lat: number; lng: number }) => void;
}

export const PublicCctvView: React.FC<Props> = ({
  onOpenLiveStreetMonitor,
  onLocateOnMap
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visualMode, setVisualMode] = useState<'OPTICAL' | 'AI_BOXES' | 'HEATMAP' | 'VECTORS'>('AI_BOXES');
  const [activeCamId, setActiveCamId] = useState<string>(NASHIK_PUBLIC_CCTV_CAMERAS[0].id);
  const [liveClock, setLiveClock] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCameras = NASHIK_PUBLIC_CCTV_CAMERAS.filter((cam) => {
    const matchesSearch = 
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.camCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.zone.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedZone === 'GHATS') {
      return matchesSearch && (cam.id.includes('ramkund') || cam.id.includes('laxman') || cam.id.includes('kushavarta') || cam.id.includes('bridge'));
    }
    if (selectedZone === 'TEMPLES') {
      return matchesSearch && (cam.id.includes('panchavati') || cam.id.includes('kapileshwar'));
    }
    if (selectedZone === 'CAMPS') {
      return matchesSearch && cam.id.includes('tapovan');
    }
    if (selectedZone === 'TRANSIT') {
      return matchesSearch && (cam.id.includes('railway') || cam.id.includes('bridge'));
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* 1. VIEW HEADER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Video className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Public CCTV Surveillance Wall</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  8 / 8 CAMERAS STREAMING
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Direct live optical video feeds stationed at critical Ghats, Temples, Akhara camps & transit hubs across Nashik & Trimbakeshwar.
              </p>
            </div>
          </div>
        </div>

        {/* Global Live Timestamp & Visual Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-900 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">CLOCK:</span>
            <span className="font-bold text-emerald-300">{liveClock}</span>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setVisualMode('OPTICAL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                visualMode === 'OPTICAL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Optical RGB
            </button>
            <button
              onClick={() => setVisualMode('AI_BOXES')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                visualMode === 'AI_BOXES' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>AI Bounding Boxes</span>
            </button>
            <button
              onClick={() => setVisualMode('HEATMAP')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                visualMode === 'HEATMAP' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Density Heatmap</span>
            </button>
            <button
              onClick={() => setVisualMode('VECTORS')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                visualMode === 'VECTORS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Flow Vectors</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedZone('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedZone === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cameras (8)
          </button>
          <button
            onClick={() => setSelectedZone('GHATS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedZone === 'GHATS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌊 Sacred Ghats (4)
          </button>
          <button
            onClick={() => setSelectedZone('TEMPLES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedZone === 'TEMPLES' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏛️ Heritage Temples (2)
          </button>
          <button
            onClick={() => setSelectedZone('CAMPS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedZone === 'CAMPS' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⛺ Sadhugram Akhara (1)
          </button>
          <button
            onClick={() => setSelectedZone('TRANSIT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedZone === 'TRANSIT' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚆 Ingress Transit (2)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search camera code or location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. CAMERA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredCameras.map((cam) => {
          const isCritical = cam.riskLevel === 'CRITICAL_CRUSH';
          const isCongested = cam.riskLevel === 'CONGESTED';
          const isCurrentActive = activeCamId === cam.id;

          return (
            <div
              key={cam.id}
              className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                isCurrentActive ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div 
                onClick={() => {
                  setActiveCamId(cam.id);
                  onOpenLiveStreetMonitor?.(cam.id);
                }}
                className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer group select-none"
              >
                <img
                  src={cam.image}
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  referrerPolicy="no-referrer"
                />

                {visualMode === 'HEATMAP' && (
                  <div className={`absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-500 ${
                    isCritical ? 'bg-gradient-to-t from-rose-600/80 via-amber-500/40 to-transparent' :
                    isCongested ? 'bg-gradient-to-t from-amber-600/70 via-yellow-500/30 to-transparent' :
                    'bg-gradient-to-t from-emerald-600/60 via-teal-500/20 to-transparent'
                  }`} />
                )}

                {visualMode === 'AI_BOXES' && (
                  <div className="absolute inset-0 pointer-events-none p-3 flex flex-wrap gap-2 items-end">
                    <div className="border-2 border-emerald-400 bg-emerald-500/20 rounded p-1 text-[9px] font-mono font-bold text-emerald-300">
                      [Person: 98.4%]
                    </div>
                    <div className="border-2 border-emerald-400 bg-emerald-500/20 rounded p-1 text-[9px] font-mono font-bold text-emerald-300">
                      [Person: 96.1%]
                    </div>
                    {isCritical && (
                      <div className="border-2 border-rose-500 bg-rose-500/30 rounded p-1 text-[9px] font-mono font-bold text-rose-200 animate-pulse">
                        [CRUSH DENSITY &gt; 5.0]
                      </div>
                    )}
                  </div>
                )}

                {visualMode === 'VECTORS' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="bg-indigo-950/80 border border-indigo-400/60 px-2 py-1 rounded-lg text-indigo-300 font-mono text-[10px] flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 animate-spin" />
                      <span>Vector: {cam.flowDirection.replace(/_/g, ' ')} ({cam.velocityMps} m/s)</span>
                    </div>
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-white font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE</span>
                  <span className="opacity-70">• {cam.fps} FPS</span>
                </div>

                <div className="absolute top-2 right-2 bg-blue-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-mono text-blue-200 border border-blue-500/30">
                  {cam.resolution.split(' ')[0]}
                </div>

                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>{cam.camCode}</span>
                </div>

                <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                  <Maximize2 className="w-6 h-6 animate-bounce" />
                  <span>Open Fullscreen Stream & AI Analysis</span>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                        {cam.zone}
                      </span>
                      <h3 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                        {cam.name}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500 block truncate">
                        {cam.marathiName}
                      </span>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap ${
                      isCritical ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      isCongested ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {cam.riskLevel.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {cam.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">People</span>
                    <strong className="text-slate-900 font-black">{cam.initialCount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Density</span>
                    <strong className={`${isCritical ? 'text-rose-600' : isCongested ? 'text-amber-600' : 'text-emerald-600'} font-black`}>
                      {cam.initialDensity} P/m²
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Flow</span>
                    <strong className="text-slate-800 font-bold">{cam.velocityMps} m/s</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onOpenLiveStreetMonitor?.(cam.id)}
                    className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Direct Feed</span>
                  </button>

                  <button
                    onClick={() => onLocateOnMap?.(cam.coordinates)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                    title="Locate Camera on Tactical Map"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
