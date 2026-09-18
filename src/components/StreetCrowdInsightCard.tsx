import React from 'react';
import { 
  MapPin, 
  Signal, 
  AlertTriangle, 
  Footprints, 
  X,
  Video,
  ExternalLink
} from 'lucide-react';
import { StreetCrowdReading } from '../data/streetCrowdEngine';
import { getNearestCctvLocation } from '../data/cctvData';

interface Props {
  reading: StreetCrowdReading | null;
  onClose: () => void;
  onTrackMyLocation?: () => void;
  onOpenLiveStreetMonitor?: (locationId?: string) => void;
}

export const StreetCrowdInsightCard: React.FC<Props> = ({
  reading,
  onClose,
  onTrackMyLocation,
  onOpenLiveStreetMonitor
}) => {
  if (!reading) return null;

  const nearestCctv = getNearestCctvLocation(reading.lat, reading.lng);

  const isCritical = reading.congestionStatus === 'CRITICAL_CONGESTION';
  const isHeavy = reading.congestionStatus === 'HEAVY';
  const isModerate = reading.congestionStatus === 'MODERATE';

  const badgeColor = isCritical 
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
    : isHeavy 
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
    : isModerate 
    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' 
    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  const densityBarColor = isCritical 
    ? 'bg-rose-500' 
    : isHeavy 
    ? 'bg-amber-500' 
    : isModerate 
    ? 'bg-yellow-500' 
    : 'bg-emerald-500';

  return (
    <div className="absolute top-16 left-3 sm:left-4 z-30 max-w-sm sm:max-w-md w-[calc(100%-1.5rem)] sm:w-96 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-white text-xs font-sans animate-in slide-in-from-left-4 duration-200">
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl border ${isCritical ? 'bg-rose-950 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-indigo-950 border-indigo-500/40 text-indigo-400'}`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Real Street Crowd Telemetry
            </span>
            <h4 className="font-extrabold text-sm text-white truncate max-w-[210px] sm:max-w-[240px]">
              {reading.streetName}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="my-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Live Crowd</span>
            <div className="text-xl font-black font-mono text-white flex items-baseline gap-1.5">
              <span>{reading.totalEstimatedPeopleInZone.toLocaleString()}</span>
              <span className="text-xs font-normal text-slate-400">devotees</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Spatial Density</span>
            <span className={`text-base font-black font-mono px-2 py-0.5 rounded-lg border ${badgeColor}`}>
              {reading.crowdPerSquareMeter} P/m²
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Free (0 P/m²)</span>
            <span>Warning (3.5)</span>
            <span>Crush (&gt;5.0)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${densityBarColor}`}
              style={{ width: `${Math.min(100, (reading.crowdPerSquareMeter / 6.0) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
            <Signal className="w-3 h-3 text-indigo-400" />
            <span>Nearest Tower</span>
          </div>
          <div className="text-indigo-300 font-bold mt-0.5 text-[11px] truncate">
            {reading.nearestTowerCode}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">{reading.distanceToNearestTowerMeters}m away</span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
            <Footprints className="w-3 h-3 text-emerald-400" />
            <span>Flow Speed</span>
          </div>
          <div className="text-emerald-300 font-bold mt-0.5 text-[11px]">
            {reading.walkSpeedMs} m/s
          </div>
          <span className="text-[9px] text-slate-500 font-mono">
            {reading.walkSpeedMs < 0.4 ? 'Stationary Jam' : 'Walking Pace'}
          </span>
        </div>
      </div>

      <div className={`mt-2.5 p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
        isCritical ? 'bg-rose-950/40 border-rose-600/60 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
        <div>
          <strong className="block text-white font-bold mb-0.5">
            {reading.congestionStatus.replace(/_/g, ' ')}:
          </strong>
          <span>{reading.recommendedAction}</span>
        </div>
      </div>

      {nearestCctv && (
        <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-blue-500/40 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-blue-300 font-bold text-[11px]">
              <Video className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
              <span className="truncate">{nearestCctv.camera.camCode}</span>
            </div>
            <span className="text-[10px] text-slate-400 block truncate">
              {nearestCctv.distanceMeters}m away • {nearestCctv.camera.name.split('(')[0]}
            </span>
          </div>

          <button
            onClick={() => onOpenLiveStreetMonitor?.(nearestCctv.camera.id)}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] whitespace-nowrap shadow transition flex items-center gap-1 shrink-0"
          >
            <span>Watch CCTV</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Confidence: {reading.confidenceScore}%</span>
        </span>
        <span className="font-mono text-slate-500">
          Lat {reading.lat.toFixed(4)}, Lng {reading.lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
};
