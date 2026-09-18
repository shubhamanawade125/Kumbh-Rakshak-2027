import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Sector, AedStation, MedicalCamp } from '../types';
import { 
  Copy, 
  Check, 
  Radio, 
  Share2, 
  Signal, 
  Footprints
} from 'lucide-react';
import { CellTower, NASHIK_CELL_TOWERS } from '../data/cellTowerData';
import { CellTowerRadiusCircles } from './CellTowerRadiusCircles';
import { CellTowerCrowdInsightsModal } from './CellTowerCrowdInsightsModal';
import { getStreetCrowdInsight, StreetCrowdReading } from '../data/streetCrowdEngine';
import { StreetCrowdInsightCard } from './StreetCrowdInsightCard';

export interface KumbhSite {
  id: string;
  name: string;
  marathiName: string;
  type: 'MAIN_GHAT' | 'AKHARA_CAMP' | 'TEMPLE' | 'INGRESS_HUB';
  coordinates: { lat: number; lng: number };
  description: string;
  significance: string;
  zoomLevel: number;
}

export const NASHIK_KUMBH_MELA_SITES: KumbhSite[] = [
  {
    id: 'kumbh-ramkund',
    name: 'Ramkund Sacred Shahi Snan Ghat',
    marathiName: 'रामकुंड मुख्य शाही स्नान घाट',
    type: 'MAIN_GHAT',
    coordinates: { lat: 19.9996, lng: 73.7915 },
    description: 'The sacred heart of Nashik Kumbh Mela on the Godavari river where the holy Shahi Snan (Royal Bath) takes place.',
    significance: 'Primary bathing spot for Vaishnava Akharas & millions of devotees. Asthi-visarjan sacred pool.',
    zoomLevel: 17
  },
  {
    id: 'kumbh-kushavarta',
    name: 'Kushavarta Kund (Trimbakeshwar)',
    marathiName: 'कुशावर्त तीर्थ (त्र्यंबकेश्वर ज्योतिर्लिंग)',
    type: 'MAIN_GHAT',
    coordinates: { lat: 19.9328, lng: 73.5312 },
    description: 'Sacred source basin of river Godavari, 28km from Nashik. Epicenter of the Shaivite Kumbh Mela.',
    significance: 'Official Shahi Snan holy dip site for 10 Shaivite Akharas (Juna, Niranjani, Mahanirvani).',
    zoomLevel: 16
  },
  {
    id: 'kumbh-tapovan',
    name: 'Tapovan Sadhugram Akhara City',
    marathiName: 'तपोवन साधुग्राम महा आखाडा नगर',
    type: 'AKHARA_CAMP',
    coordinates: { lat: 19.9878, lng: 73.8118 },
    description: '350+ acre tent city hosting thousands of Mahants, Naga Sadhus, and Vaishnava Akharas (Nirmohi, Digambar, Nirvani).',
    significance: 'Staging ground for royal procession (Shahi Juloos) and field disaster coordination headquarters.',
    zoomLevel: 15
  },
  {
    id: 'kumbh-laxman-ghat',
    name: 'Laxman Ghat & Godavari Sangam',
    marathiName: 'लक्ष्मण घाट व गोदावरी संगम',
    type: 'MAIN_GHAT',
    coordinates: { lat: 20.0016, lng: 73.7944 },
    description: 'Extensive stone ghat directly connected to Ramkund, providing massive holy dip and crowd dispersion.',
    significance: 'Direct pedestrian holding corridor and river safety rescue boat terminal.',
    zoomLevel: 17
  },
  {
    id: 'kumbh-kalaram',
    name: 'Panchavati & Kalaram Mandir',
    marathiName: 'पंचवटी श्री काळाराम मंदिर व सीता गुंफा',
    type: 'TEMPLE',
    coordinates: { lat: 20.0039, lng: 73.7968 },
    description: 'Historic Ramayana heritage complex with black stone Lord Rama temple and Sita Gufa.',
    significance: 'Primary darshan pathway after Shahi Snan with dedicated one-way crowd barricades.',
    zoomLevel: 17
  },
  {
    id: 'kumbh-kapileshwar',
    name: 'Kapileshwar Mahadev Mandir',
    marathiName: 'कपिलेश्वर महादेव मंदिर घाट',
    type: 'TEMPLE',
    coordinates: { lat: 19.9988, lng: 73.7905 },
    description: 'One of the oldest Shiva temples overlooking Godavari river, unique for having no Nandi idol.',
    significance: 'Crowd confluence point opposite Ramkund holding thousands in queue.',
    zoomLevel: 17
  },
  {
    id: 'kumbh-railway',
    name: 'Nashik Road Railway Pilgrim Terminal',
    marathiName: 'नाशिक रोड रेल्वे महा-यात्री टर्मिनल',
    type: 'INGRESS_HUB',
    coordinates: { lat: 19.9575, lng: 73.8344 },
    description: 'Main nationwide rail gateway with dedicated Kumbh Mela platforms, holding sheds, and ring-road shuttles.',
    significance: 'Manages incoming flow of over 1.8M devotees arriving daily from across India.',
    zoomLevel: 15
  }
];

interface Props {
  sectors: Sector[];
  aedStations: AedStation[];
  medicalCamps: MedicalCamp[];
  selectedSector: Sector;
  ambulancePathActive: boolean;
  onSelectSector: (sector: Sector) => void;
  onOpenLiveStreetMonitor?: (locId?: string) => void;
}

const MapFlyTo: React.FC<{ target: { lat: number; lng: number } | null; zoom: number }> = ({ target, zoom }) => {
  const map = useMap('kumbh-google-map');
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      map.setZoom(zoom);
    }
  }, [map, target, zoom]);
  return null;
};

export const GoogleTacticalMap: React.FC<Props> = ({
  sectors,
  aedStations,
  medicalCamps,
  selectedSector,
  ambulancePathActive,
  onSelectSector,
  onOpenLiveStreetMonitor,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDLS0R1FUpYP0R2d7ZlWJ0IJAaRNAd8LHc';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

  const [mapType, setMapType] = useState<'hybrid' | 'roadmap' | 'satellite' | 'terrain'>('hybrid');
  const [selectedStation, setSelectedStation] = useState<AedStation | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<MedicalCamp | null>(null);
  const [selectedSectorPopup, setSelectedSectorPopup] = useState<Sector | null>(null);
  const [selectedKumbhSite, setSelectedKumbhSite] = useState<KumbhSite | null>(null);
  const [activeSiteTab, setActiveSiteTab] = useState<string>('kumbh-ramkund');

  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>({ lat: 19.9996, lng: 73.7915 });
  const [flyZoom, setFlyZoom] = useState<number>(16);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSharingLiveLocation, setIsSharingLiveLocation] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const [showAeds, setShowAeds] = useState(true);
  const [showMedical, setShowMedical] = useState(true);
  const [showKumbhSites, setShowKumbhSites] = useState(true);
  const [showCellTowers, setShowCellTowers] = useState(true);
  const [selectedCellTower, setSelectedCellTower] = useState<CellTower | null>(null);
  const [isCellTowerModalOpen, setIsCellTowerModalOpen] = useState(false);

  const [streetReading, setStreetReading] = useState<StreetCrowdReading | null>(() => 
    getStreetCrowdInsight(19.9996, 73.7915)
  );
  const [inspectedPin, setInspectedPin] = useState<{ lat: number; lng: number } | null>({ lat: 19.9996, lng: 73.7915 });

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleSelectKumbhSite = (site: KumbhSite) => {
    setActiveSiteTab(site.id);
    setSelectedKumbhSite(site);
    setSelectedSectorPopup(null);
    setSelectedStation(null);
    setSelectedCamp(null);
    setFlyTarget({ lat: site.coordinates.lat, lng: site.coordinates.lng });
    setFlyZoom(site.zoomLevel);
    const insight = getStreetCrowdInsight(site.coordinates.lat, site.coordinates.lng);
    setStreetReading(insight);
    setInspectedPin({ lat: site.coordinates.lat, lng: site.coordinates.lng });
  };

  const handleToggleShareLiveLocation = () => {
    if (isSharingLiveLocation) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsSharingLiveLocation(false);
      setShareToast('Live location sharing paused.');
      setTimeout(() => setShareToast(null), 3500);
    } else {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }
      setIsLocating(true);
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setIsLocating(false);
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy)
          };
          setUserLocation(coords);
          setIsSharingLiveLocation(true);
          setFlyTarget({ lat: coords.lat, lng: coords.lng });
          setFlyZoom(17);
          const reading = getStreetCrowdInsight(coords.lat, coords.lng);
          setStreetReading(reading);
          setInspectedPin({ lat: coords.lat, lng: coords.lng });
          setShareToast(`Live GPS Beacon Active: ${reading.streetName} (${reading.totalEstimatedPeopleInZone.toLocaleString()} people nearby)`);
          setTimeout(() => setShareToast(null), 5000);
        },
        (err) => {
          setIsLocating(false);
          console.warn('Live location permission or error:', err.message);
          const fallback = { lat: 19.9996, lng: 73.7915, accuracy: 8 };
          setUserLocation(fallback);
          setIsSharingLiveLocation(true);
          setFlyTarget({ lat: fallback.lat, lng: fallback.lng });
          setShareToast('Live location sharing activated (Ramkund Ghat Mesh).');
          setTimeout(() => setShareToast(null), 4000);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
      );
      watchIdRef.current = id;
    }
  };

  const handleCopyShareLink = async () => {
    const coords = userLocation || { lat: 19.9996, lng: 73.7915 };
    const shareUrl = `${window.location.origin}${window.location.pathname}?live_lat=${coords.lat.toFixed(5)}&live_lng=${coords.lat.toFixed(5)}&t=${Date.now()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Live Location - Nashik Kumbh Mela 2027',
          text: `I am currently sharing my live location at Nashik Kumbh Mela (Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}). Connect via Emergency Command:`,
          url: shareUrl,
        });
        setShareToast('Shared successfully!');
        setTimeout(() => setShareToast(null), 3000);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setShareToast('Live location tracking URL copied to clipboard!');
      setTimeout(() => {
        setCopiedLink(false);
        setShareToast(null), 3500;
      });
    } catch {
      setShareToast(`Link: ${shareUrl}`);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* 1. TOP KUMBH SITES NAVIGATION BAR */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-2 px-3 flex items-center justify-between gap-2 overflow-x-auto z-20 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
            🕉️
          </div>
          <span className="font-bold text-white tracking-wide text-xs hidden sm:inline">
            Official Nashik Kumbh Mela Sites:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {NASHIK_KUMBH_MELA_SITES.map((site) => {
            const isActive = activeSiteTab === site.id;
            return (
              <button
                key={site.id}
                onClick={() => handleSelectKumbhSite(site)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{site.type === 'MAIN_GHAT' ? '🚩' : site.type === 'AKHARA_CAMP' ? '⛺' : site.type === 'TEMPLE' ? '🏛️' : '🚆'}</span>
                <span>{site.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCellTowerModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
            title="View Telecom Cell Tower (CDR) Crowd Telemetry"
          >
            <Signal className="w-3.5 h-3.5 text-indigo-200" />
            <span className="hidden sm:inline">Cell Tower CDR</span>
            <span className="sm:hidden">CDR</span>
          </button>

          <button
            onClick={handleToggleShareLiveLocation}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg ${
              isSharingLiveLocation
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-900/50'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSharingLiveLocation ? 'animate-spin' : ''}`} />
            <span>{isSharingLiveLocation ? 'Broadcasting Live Location' : 'Share My Live Location'}</span>
          </button>
        </div>
      </div>

      {isSharingLiveLocation && (
        <div className="bg-gradient-to-r from-blue-950/90 via-slate-900/95 to-rose-950/90 border-b border-blue-500/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white z-20 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">LIVE BEACON ACTIVE:</span>
            <span className="text-slate-200 font-mono text-[11px]">
              Lat {userLocation?.lat.toFixed(5) || '19.99960'}° N, Lng {userLocation?.lng.toFixed(5) || '73.79150'}° E 
              {userLocation?.accuracy ? ` (±${userLocation.accuracy}m)` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="px-2.5 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Copied Link' : 'Copy Live Link'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I am sharing my live location at Nashik Kumbh Mela: https://maps.google.com/?q=${userLocation?.lat || 19.9996},${userLocation?.lng || 73.7915}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
            >
              <Share2 className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleToggleShareLiveLocation}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 text-[11px] transition"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {shareToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-slate-900 border border-amber-500/80 text-amber-300 px-4 py-2 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Radio className="w-4 h-4 text-amber-400" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* 2. MAP CANVAS */}
      <div className="relative flex-1 w-full min-h-[440px]">
        <APIProvider apiKey={apiKey}>
          <Map
            id="kumbh-google-map"
            defaultCenter={{ lat: 19.9996, lng: 73.7915 }}
            defaultZoom={16}
            mapTypeId={mapType}
            mapId={mapId}
            gestureHandling="greedy"
            disableDefaultUI={true}
            className="w-full h-full min-h-[440px]"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            onClick={(e) => {
              if (e.detail.latLng) {
                const clickLat = e.detail.latLng.lat;
                const clickLng = e.detail.latLng.lng;
                const insight = getStreetCrowdInsight(clickLat, clickLng);
                setStreetReading(insight);
                setInspectedPin({ lat: clickLat, lng: clickLng });
              }
            }}
          >
            <MapFlyTo target={flyTarget} zoom={flyZoom} />

            {/* 1. OFFICIAL NASHIK KUMBH MELA VENUE PINS */}
            {showKumbhSites &&
              NASHIK_KUMBH_MELA_SITES.map((site) => (
                <AdvancedMarker
                  key={site.id}
                  position={{ lat: site.coordinates.lat, lng: site.coordinates.lng }}
                  onClick={() => {
                    setSelectedKumbhSite(site);
                    setActiveSiteTab(site.id);
                  }}
                >
                  <div className="cursor-pointer transform hover:scale-125 transition-transform duration-200 group">
                    <div className="relative flex flex-col items-center">
                      <div className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full font-black text-[11px] shadow-2xl border-2 border-white flex items-center gap-1.5">
                        <span className="text-xs">
                          {site.type === 'MAIN_GHAT' ? '🚩' : site.type === 'AKHARA_CAMP' ? '⛺' : site.type === 'TEMPLE' ? '🏛️' : '🚆'}
                        </span>
                        <span>{site.name.split(' ')[0]}</span>
                      </div>
                      <div className="w-0.5 h-2 bg-amber-500 shadow" />
                    </div>
                  </div>
                </AdvancedMarker>
              ))}

            {/* 2. CROWD SECTOR DENSITY RADAR MARKERS */}
            {sectors.map((sec) => {
              const isCritical = sec.riskLevel === 'CRITICAL_CRUSH';
              const isWarning = sec.riskLevel === 'HIGH_WARNING';
              const pinColor = isCritical ? '#f43f5e' : isWarning ? '#f97316' : '#10b981';

              return (
                <AdvancedMarker
                  key={sec.id}
                  position={{ lat: sec.coordinates[0], lng: sec.coordinates[1] }}
                  onClick={() => {
                    onSelectSector(sec);
                    setSelectedSectorPopup(sec);
                    setSelectedKumbhSite(null);
                  }}
                >
                  <div className="cursor-pointer transform hover:scale-110 transition-transform">
                    <div
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-white font-mono text-[10px] font-bold shadow-xl border"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: pinColor,
                      }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'animate-ping' : ''}`}
                        style={{ backgroundColor: pinColor }}
                      />
                      <span>{sec.name.split(' ')[0]}</span>
                      <span className="opacity-80">{sec.density}P/m²</span>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* 3. SUB-4-MIN AED CARDIAC STATIONS */}
            {showAeds &&
              aedStations.map((aed) => (
                <AdvancedMarker
                  key={aed.id}
                  position={{ lat: aed.coordinates[0], lng: aed.coordinates[1] }}
                  onClick={() => {
                    setSelectedStation(aed);
                    setSelectedKumbhSite(null);
                  }}
                >
                  <div 
                    title={aed.name}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shadow-lg border-2 border-white cursor-pointer transform hover:scale-110 transition-all"
                  >
                    ⚡
                  </div>
                </AdvancedMarker>
              ))}

            {/* 4. EMERGENCY MEDICAL CAMPS & FIELD HOSPITALS */}
            {showMedical &&
              medicalCamps.map((camp) => (
                <AdvancedMarker
                  key={camp.id}
                  position={{ lat: camp.coordinates[0], lng: camp.coordinates[1] }}
                  onClick={() => {
                    setSelectedCamp(camp);
                    setSelectedKumbhSite(null);
                  }}
                >
                  <div 
                    title={camp.name}
                    className="bg-rose-600 hover:bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white cursor-pointer transform hover:scale-110 transition-all"
                  >
                    ✚
                  </div>
                </AdvancedMarker>
              ))}

            {/* 5. CELL TOWER TELEMETRY RADIUS CIRCLES */}
            <CellTowerRadiusCircles
              towers={NASHIK_CELL_TOWERS}
              visible={showCellTowers}
              selectedTowerId={selectedCellTower?.id || null}
              onSelectTower={(t) => setSelectedCellTower(t)}
            />

            {/* 6. CELL TOWER MAST MARKERS */}
            {showCellTowers &&
              NASHIK_CELL_TOWERS.map((tower) => {
                const isOverload = tower.riskLevel === 'OVERLOAD';
                const isCongested = tower.riskLevel === 'CONGESTED';
                const markerColor = isOverload ? 'bg-rose-600' : isCongested ? 'bg-amber-500' : 'bg-indigo-600';
                return (
                  <AdvancedMarker
                    key={tower.id}
                    position={{ lat: tower.coordinates.lat, lng: tower.coordinates.lng }}
                    onClick={() => {
                      setSelectedCellTower(tower);
                      setSelectedKumbhSite(null);
                      setSelectedCamp(null);
                      setSelectedStation(null);
                    }}
                  >
                    <div className="cursor-pointer transform hover:scale-125 transition-transform flex flex-col items-center group">
                      <div className={`${markerColor} text-white px-2 py-0.5 rounded-full font-mono text-[10px] font-black shadow-2xl border-2 border-white flex items-center gap-1`}>
                        <Signal className="w-3 h-3" />
                        <span>{tower.towerCode}</span>
                        <span className="opacity-90 font-mono">{(tower.totalSimCount / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="w-0.5 h-2 bg-indigo-400 shadow" />
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* 7. USER LIVE LOCATION BEACON */}
            {userLocation && (
              <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-blue-500/30 animate-ping" />
                  <div className="absolute w-7 h-7 rounded-full bg-blue-400/50 animate-pulse" />
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-2xl z-10" />
                  <span className="absolute -bottom-5 whitespace-nowrap bg-blue-950 text-blue-200 border border-blue-500/50 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono">
                    My Live GPS
                  </span>
                </div>
              </AdvancedMarker>
            )}

            {/* 8. INSPECTED STREET TARGET PIN */}
            {inspectedPin && streetReading && (
              <AdvancedMarker position={{ lat: inspectedPin.lat, lng: inspectedPin.lng }}>
                <div className="relative flex flex-col items-center group cursor-pointer animate-bounce">
                  <div className="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-2 py-0.5 rounded-full font-mono text-[10px] font-black shadow-2xl border-2 border-white flex items-center gap-1">
                    <Footprints className="w-3 h-3 text-white" />
                    <span>{readingCountLabel(streetReading)}</span>
                    <span className="opacity-80">({streetReading.crowdPerSquareMeter} P/m²)</span>
                  </div>
                  <div className="w-2 h-2 rotate-45 bg-amber-600 -mt-1 border-r border-b border-white shadow" />
                </div>
              </AdvancedMarker>
            )}

            {selectedKumbhSite && (
              <InfoWindow
                position={{
                  lat: selectedKumbhSite.coordinates.lat,
                  lng: selectedKumbhSite.coordinates.lng,
                }}
                onCloseClick={() => setSelectedKumbhSite(null)}
              >
                <div className="p-2 max-w-xs font-sans text-slate-900 space-y-1.5">
                  <div className="border-b border-slate-200 pb-1">
                    <div className="flex items-center gap-1 text-amber-600 font-extrabold text-xs">
                      <span>🚩 Official Kumbh Mela Site</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-950">{selectedKumbhSite.name}</h4>
                    <span className="text-[11px] font-bold text-slate-600 block">{selectedKumbhSite.marathiName}</span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {selectedKumbhSite.description}
                  </p>

                  <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200/80 text-[10px] text-amber-950 font-semibold space-y-0.5">
                    <span className="block font-bold">✨ Significance:</span>
                    <span>{selectedKumbhSite.significance}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                    <span>GPS: {selectedKumbhSite.coordinates.lat.toFixed(4)}° N, {selectedKumbhSite.coordinates.lng.toFixed(4)}° E</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {selectedSectorPopup && (
              <InfoWindow
                position={{
                  lat: selectedSectorPopup.coordinates[0],
                  lng: selectedSectorPopup.coordinates[1],
                }}
                onCloseClick={() => setSelectedSectorPopup(null)}
              >
                <div className="p-2 max-w-xs font-sans text-slate-900 space-y-1">
                  <div className="font-extrabold text-sm text-slate-950 flex items-center justify-between">
                    <span>{selectedSectorPopup.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        selectedSectorPopup.riskLevel === 'CRITICAL_CRUSH'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {selectedSectorPopup.density} P/m²
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div><b>Occupancy:</b> {selectedSectorPopup.currentPeople.toLocaleString()} / {selectedSectorPopup.maxCapacity.toLocaleString()}</div>
                    <div><b>Crowd Pressure:</b> <span className="font-mono text-rose-600 font-bold">{selectedSectorPopup.pressurePsi} PSI</span></div>
                    <div><b>Status:</b> {selectedSectorPopup.description}</div>
                  </div>
                </div>
              </InfoWindow>
            )}

            {selectedStation && (
              <InfoWindow
                position={{
                  lat: selectedStation.coordinates[0],
                  lng: selectedStation.coordinates[1],
                }}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="p-1.5 font-sans text-slate-900 min-w-[180px]">
                  <div className="font-bold text-amber-600 text-xs flex items-center gap-1">
                    <span>⚡</span> {selectedStation.name}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{selectedStation.locationDetails}</div>
                  <div className="mt-2 p-1.5 bg-amber-50 rounded text-[11px] text-amber-900 font-semibold flex justify-between">
                    <span>Battery: {selectedStation.batteryLevel}%</span>
                    <span>Sub-4-Min Ready</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {selectedCamp && (
              <InfoWindow
                position={{
                  lat: selectedCamp.coordinates[0],
                  lng: selectedCamp.coordinates[1],
                }}
                onCloseClick={() => setSelectedCamp(null)}
              >
                <div className="p-1.5 font-sans text-slate-900 min-w-[200px]">
                  <div className="font-bold text-rose-700 text-xs flex items-center gap-1">
                    <span>✚</span> {selectedCamp.name}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">Dr: {selectedCamp.doctorOnDuty}</div>
                  <div className="text-[10px] text-slate-500">Tel: {selectedCamp.contactNumber}</div>
                  <div className="mt-2 p-1.5 bg-rose-50 rounded text-[11px] text-rose-900 font-bold flex justify-between">
                    <span>Available Beds:</span>
                    <span>{selectedCamp.bedsTotal - selectedCamp.bedsOccupied} / {selectedCamp.bedsTotal}</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {selectedCellTower && (
              <InfoWindow
                position={{
                  lat: selectedCellTower.coordinates.lat,
                  lng: selectedCellTower.coordinates.lng,
                }}
                onCloseClick={() => setSelectedCellTower(null)}
              >
                <div className="p-2 font-sans text-slate-900 min-w-[240px] max-w-xs space-y-2">
                  <div className="border-b border-slate-200 pb-1.5 flex items-start justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-1 font-mono text-[10px] text-indigo-600 font-bold uppercase">
                        <Signal className="w-3 h-3" />
                        <span>{selectedCellTower.towerCode} • {selectedCellTower.operator.replace(/_/g, ' ')}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-950 mt-0.5">{selectedCellTower.name}</h4>
                      <span className="text-[10px] text-slate-600 block">{selectedCellTower.locationName}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap ${
                      selectedCellTower.riskLevel === 'OVERLOAD'
                        ? 'bg-rose-100 text-rose-700'
                        : selectedCellTower.riskLevel === 'CONGESTED'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedCellTower.riskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="p-1 bg-indigo-50 rounded border border-indigo-100">
                      <span className="text-[9px] text-indigo-700 block">Attached SIMs</span>
                      <span className="font-bold text-slate-900">{selectedCellTower.totalSimCount.toLocaleString()}</span>
                    </div>
                    <div className="p-1 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-500 block">Cell Radius</span>
                      <span className="font-bold text-slate-900">{selectedCellTower.cellRadiusMeters}m</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 flex items-center justify-between font-mono">
                    <span>Hourly Ingress:</span>
                    <span className="font-bold text-rose-600">+{selectedCellTower.trendPercentage}%</span>
                  </div>

                  <button
                    onClick={() => setIsCellTowerModalOpen(true)}
                    className="w-full py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition text-center shadow"
                  >
                    View Azimuth Sectors & Analytics →
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-xl pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>👉 Click <strong>any street or location</strong> on the map to see its live crowd count & density</span>
        </div>

        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <div className="bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-lg text-[11px]">
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mapType === 'hybrid'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mapType === 'roadmap'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              🗺️ Roads
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mapType === 'terrain'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              ⛰️ Terrain
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-10 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5 text-slate-300 shadow-xl max-w-xs">
          <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
            Tactical Kumbh Mela Layers
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-800">
            <button
              onClick={() => setShowCellTowers((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition ${
                showCellTowers ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 font-bold' : 'text-slate-500'
              }`}
            >
              <Signal className="w-3 h-3" />
              <span>Cell Towers ({NASHIK_CELL_TOWERS.length})</span>
            </button>
            <button
              onClick={() => setShowKumbhSites((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition ${
                showKumbhSites ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'
              }`}
            >
              <span>🚩 Sites ({NASHIK_KUMBH_MELA_SITES.length})</span>
            </button>
            <button
              onClick={() => setShowAeds((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition ${
                showAeds ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'
              }`}
            >
              <span>⚡ AEDs ({aedStations.length})</span>
            </button>
            <button
              onClick={() => setShowMedical((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition ${
                showMedical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-500'
              }`}
            >
              <span>✚ Camps ({medicalCamps.length})</span>
            </button>
          </div>
        </div>

        {streetReading && (
          <StreetCrowdInsightCard
            reading={streetReading}
            onClose={() => setStreetReading(null)}
            onTrackMyLocation={handleToggleShareLiveLocation}
            onOpenLiveStreetMonitor={onOpenLiveStreetMonitor}
          />
        )}
      </div>

      <CellTowerCrowdInsightsModal
        isOpen={isCellTowerModalOpen}
        selectedTower={selectedCellTower}
        onClose={() => setIsCellTowerModalOpen(false)}
        onSelectTower={(t) => {
          setSelectedCellTower(t);
          setFlyTarget({ lat: t.coordinates.lat, lng: t.coordinates.lng });
          setFlyZoom(16);
        }}
      />
    </div>
  );
};

function readingCountLabel(reading: StreetCrowdReading) {
  return `${reading.totalEstimatedPeopleInZone.toLocaleString()} People`;
}
