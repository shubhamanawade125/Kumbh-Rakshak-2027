import React from 'react';
import { Heart, Video, Eye } from 'lucide-react';

interface GroundFeed {
  id: string;
  name: string;
  locationName: string;
  crowdLevel: 'High' | 'Moderate' | 'Normal';
  isLive?: boolean;
  camCode: string;
  image: string;
  targetLocId: string;
}

const GROUND_FEEDS: GroundFeed[] = [
  {
    id: 'feed-1',
    name: 'Main Ghat (Godavari)',
    locationName: 'Godavari River Basin, Nashik',
    crowdLevel: 'High',
    isLive: true,
    camCode: 'CAM-012',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kumbha_mela_on_ghats_of_the_river_godavari_nashik.jpg',
    targetLocId: 'loc-laxman',
  },
  {
    id: 'feed-2',
    name: 'Ramkund Sacred Ghat',
    locationName: 'Ramkund Bathing Ghat, Nashik',
    crowdLevel: 'Normal',
    isLive: true,
    camCode: 'CAM-048',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Kumbhmela_Nashik_2015_-_view_across_Ramkund.JPG',
    targetLocId: 'loc-ramkund',
  },
  {
    id: 'feed-3',
    name: 'Tapovan Sadhugram',
    locationName: 'Tapovan Pilgrim Holding, Nashik',
    crowdLevel: 'Moderate',
    camCode: 'CAM-090',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Tapovan_Nashik.jpg',
    targetLocId: 'loc-tapovan',
  },
  {
    id: 'feed-4',
    name: 'Panchavati Entry',
    locationName: 'Kalaram Mandir Chowk, Nashik',
    crowdLevel: 'High',
    isLive: true,
    camCode: 'CAM-064',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Kalaram_Mandir_Nashik.jpg',
    targetLocId: 'loc-panchavati',
  },
];

interface Props {
  onOpenLiveStreetMonitor?: (locationId?: string) => void;
}

export const ReferenceGroundFeeds: React.FC<Props> = ({ onOpenLiveStreetMonitor }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Live from the Ground • Nashik Kumbh Mela Real CCTV Feeds
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            4 High-Resolution Optical CV Feeds Active
          </span>
          <button
            onClick={() => onOpenLiveStreetMonitor?.('loc-ramkund')}
            className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition"
          >
            <Video className="w-3.5 h-3.5 animate-pulse text-blue-200" />
            <span>Open Real-Time Street Monitor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch">
        {GROUND_FEEDS.map((feed) => {
          const isHigh = feed.crowdLevel === 'High';
          const isModerate = feed.crowdLevel === 'Moderate';

          return (
            <div
              key={feed.id}
              onClick={() => onOpenLiveStreetMonitor?.(feed.targetLocId)}
              className="relative h-36 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs group bg-slate-900 flex flex-col justify-between p-2.5 select-none cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            >
              <img
                src={feed.image}
                alt={feed.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82] contrast-[1.08] group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent"></div>

              <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                <span className="px-2 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 border border-white/30">
                  <Eye className="w-3 h-3 text-cyan-300" />
                  <span>Inspect Live Feed</span>
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                  {feed.camCode}
                </span>
                {feed.isLive && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-600/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    LIVE
                  </span>
                )}
              </div>

              <div className="relative z-10">
                <h4 className="text-xs font-bold text-white leading-tight drop-shadow-md">
                  {feed.name}
                </h4>
                <p className="text-[10px] text-slate-300 truncate drop-shadow-xs">
                  {feed.locationName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-medium text-slate-200">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isHigh
                        ? 'bg-rose-500 ring-2 ring-rose-500/30'
                        : isModerate
                        ? 'bg-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-emerald-400 ring-2 ring-emerald-400/30'
                    }`}
                  ></span>
                  <span>Crowd: {feed.crowdLevel}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="h-36 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 flex flex-col justify-between relative overflow-hidden shadow-xs select-none">
          <div className="absolute right-1 bottom-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 120" className="w-24 h-24 stroke-amber-800 fill-none stroke-[1.5]">
              <polygon points="50,10 55,30 45,30" />
              <polygon points="50,30 65,60 35,60" />
              <polygon points="50,60 78,95 22,95" />
              <line x1="15" y1="95" x2="85" y2="95" />
              <line x1="10" y1="105" x2="90" y2="105" />
            </svg>
          </div>

          <div className="relative z-10">
            <p className="font-serif italic text-slate-800 text-xs leading-snug font-['Playfair_Display',serif]">
              “Technology in service of humanity.”
            </p>
            <p className="text-[10px] text-amber-800/80 font-medium mt-1">
              Real-time pilgrim protection & sacred river monitoring.
            </p>
          </div>

          <div className="relative z-10">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-800/80 block">
              KUMBH-RAKSHAK 2027 • NASHIK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
