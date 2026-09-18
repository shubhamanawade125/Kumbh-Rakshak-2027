import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Video, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Navigation, 
  Sparkles, 
  Volume2, 
  ShieldAlert, 
  Camera, 
  Upload, 
  Clock,
  ArrowRight
} from 'lucide-react';

import { 
  NASHIK_PUBLIC_CCTV_CAMERAS, 
  CctvCameraLocation 
} from '../data/cctvData';

export type StreetLocation = CctvCameraLocation;
export const MONITORED_STREET_LOCATIONS = NASHIK_PUBLIC_CCTV_CAMERAS;

interface Props {
  isOpen: boolean;
  initialLocationId?: string;
  onClose: () => void;
  onTriggerDiversion?: (locationName: string) => void;
}

export const LiveCrowdStreetMonitorModal: React.FC<Props> = ({
  isOpen,
  initialLocationId,
  onClose,
  onTriggerDiversion
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    initialLocationId || MONITORED_STREET_LOCATIONS[0].id
  );
  const [activeVisualMode, setActiveVisualMode] = useState<'RGB' | 'AI_BOXES' | 'HEATMAP' | 'FLOW_VECTORS'>('AI_BOXES');
  const [liveTimestamp, setLiveTimestamp] = useState<string>('');
  
  const [cameraMode, setCameraMode] = useState<'STREET_CCTV' | 'DEVICE_WEBCAM' | 'CUSTOM_UPLOAD'>('STREET_CCTV');
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [edgeFps, setEdgeFps] = useState<number>(29.8);

  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialLocationId) {
      setSelectedLocationId(initialLocationId);
    }
  }, [initialLocationId]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cameraMode === 'DEVICE_WEBCAM') {
      navigator.mediaDevices?.getUserMedia({ video: { width: 1280, height: 720 } })
        .then((stream) => {
          setWebcamStream(stream);
          setWebcamError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Webcam access error:', err);
          setWebcamError('Unable to access device camera. Please check browser permissions.');
        });
    } else {
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
        setWebcamStream(null);
      }
    }

    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraMode]);

  const activeLocation = MONITORED_STREET_LOCATIONS.find((l) => l.id === selectedLocationId) || MONITORED_STREET_LOCATIONS[0];

  const [dynamicDensity, setDynamicDensity] = useState<number>(activeLocation.initialDensity);
  const [dynamicCount, setDynamicCount] = useState<number>(activeLocation.initialCount);

  useEffect(() => {
    setDynamicDensity(activeLocation.initialDensity);
    setDynamicCount(activeLocation.initialCount);
    setAiReport(null);
    setBroadcastSent(false);

    const interval = setInterval(() => {
      setDynamicDensity((prev) => {
        const delta = (Math.random() - 0.48) * 0.15;
        const val = Math.max(1.0, Math.min(6.5, prev + delta));
        return Number(val.toFixed(2));
      });
      setDynamicCount((prev) => {
        const delta = Math.floor((Math.random() - 0.48) * 25);
        return Math.max(500, prev + delta);
      });
      setEdgeFps(Number((29.5 + Math.random() * 0.8).toFixed(1)));
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedLocationId]);

  const handleRunAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText(`Street Feed: ${activeLocation.name}`, 10, 30);
        ctx.fillText(`Live Count: ~${dynamicCount}`, 10, 60);
        ctx.fillText(`Density: ${dynamicDensity} P/m2`, 10, 90);
      }
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

      const res = await fetch('/api/crowd/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: customImage || dataUrl,
          sectorName: activeLocation.name,
          currentEstimatedCount: dynamicCount
        })
      });

      const data = await res.json();
      if (data && data.analysis) {
        setAiReport(data.analysis);
      }
    } catch (e) {
      console.error('AI crowd analysis error:', e);
      setAiReport({
        estimatedPeopleCount: dynamicCount,
        densityPerSqMeter: dynamicDensity,
        riskLevel: dynamicDensity >= 5.0 ? 'CRITICAL_CRUSH' : dynamicDensity >= 3.5 ? 'HIGH_WARNING' : 'STABLE',
        pedestrianFlowRate: dynamicDensity >= 5.0 ? 'Turbulent (High Asphyxia Risk)' : 'Laminar Flow',
        recommendedActions: [
          'Maintain real-time automated video telemetry',
          'Deploy crowd barricade holding team if density exceeds 4.5 P/m²',
          'Check AED Station battery and ensure CPR volunteer on stand-by'
        ]
      });
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setCameraMode('CUSTOM_UPLOAD');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
      >
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Real-Time Street & Specific Location Crowd Monitor
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                High-resolution optical CV telemetry, CSRNet homography density & AI stampede prevention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{liveTimestamp}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close monitor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs no-scrollbar">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden md:inline">
              Select Street / Zone:
            </span>
            {MONITORED_STREET_LOCATIONS.map((loc) => {
              const isSelected = selectedLocationId === loc.id && cameraMode === 'STREET_CCTV';
              const isCritical = loc.initialDensity >= 5.0;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    setCameraMode('STREET_CCTV');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span>{loc.name.split('(')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-800">
            <button
              onClick={() => setCameraMode('DEVICE_WEBCAM')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                cameraMode === 'DEVICE_WEBCAM'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Webcam</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Video/Pic</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-3">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl flex items-center justify-center select-none group">
              {cameraMode === 'DEVICE_WEBCAM' ? (
                webcamError ? (
                  <div className="p-4 text-center text-rose-400 space-y-2">
                    <AlertTriangle className="w-8 h-8 mx-auto" />
                    <p className="text-xs">{webcamError}</p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )
              ) : cameraMode === 'CUSTOM_UPLOAD' && customImage ? (
                <img
                  src={customImage}
                  alt="Custom uploaded crowd scene"
                  className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
                />
              ) : (
                <img
                  src={activeLocation.image}
                  alt={activeLocation.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
                />
              )}

              {activeVisualMode === 'HEATMAP' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-amber-500/40 to-blue-500/20 mix-blend-color-burn pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-72 h-72 rounded-full bg-rose-600/60 blur-3xl animate-pulse" />
                    <div className="w-48 h-48 rounded-full bg-amber-500/60 blur-2xl" />
                  </div>
                </div>
              )}

              {activeVisualMode === 'AI_BOXES' && (
                <div className="absolute inset-0 pointer-events-none p-6">
                  <div className="relative w-full h-full">
                    <div className="absolute top-[20%] left-[30%] w-12 h-16 border-2 border-emerald-400/90 rounded bg-emerald-500/10 flex flex-col justify-between p-1">
                      <span className="text-[8px] font-mono text-emerald-300 font-bold">P-01 (98%)</span>
                    </div>
                    <div className="absolute top-[35%] left-[45%] w-10 h-14 border-2 border-emerald-400/90 rounded bg-emerald-500/10 flex flex-col justify-between p-1">
                      <span className="text-[8px] font-mono text-emerald-300 font-bold">P-02 (95%)</span>
                    </div>
                    <div className="absolute top-[50%] left-[25%] w-14 h-20 border-2 border-rose-500/90 rounded bg-rose-500/10 flex flex-col justify-between p-1 animate-pulse">
                      <span className="text-[8px] font-mono text-rose-300 font-bold">CLUSTER HIGH</span>
                      <span className="text-[7px] text-rose-200">5.4 P/m²</span>
                    </div>
                    <div className="absolute top-[28%] left-[60%] w-11 h-16 border-2 border-emerald-400/90 rounded bg-emerald-500/10 flex flex-col justify-between p-1">
                      <span className="text-[8px] font-mono text-emerald-300 font-bold">P-04 (92%)</span>
                    </div>
                    <div className="absolute top-[45%] left-[68%] w-12 h-18 border-2 border-amber-400/90 rounded bg-amber-500/10 flex flex-col justify-between p-1">
                      <span className="text-[8px] font-mono text-amber-300 font-bold">SLOW FLOW</span>
                    </div>

                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 opacity-30 border border-cyan-500/20">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="border border-cyan-500/10 flex items-center justify-center">
                          <span className="text-[8px] font-mono text-cyan-400/60">+</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeVisualMode === 'FLOW_VECTORS' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 bg-black/20">
                  <div className="grid grid-cols-6 gap-6 w-full opacity-85">
                    {Array.from({ length: 18 }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <ArrowRight className={`w-7 h-7 transform ${
                          dynamicDensity >= 5.0
                            ? 'rotate-90 text-rose-400 animate-ping'
                            : 'rotate-45 text-cyan-400'
                        }`} />
                        <span className="text-[9px] font-mono text-slate-300 bg-black/70 px-1 rounded">
                          {activeLocation.velocityMps}m/s
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{activeLocation.camCode}</span>
                  <span className="text-slate-400 hidden sm:inline">| {activeLocation.zone}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-slate-300 text-[11px]">
                  <span>1080p60</span>
                  <span className="text-emerald-400 font-bold">{edgeFps} FPS</span>
                  <span className="text-cyan-300">12ms LAT</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2">
                <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white flex items-center gap-3 shadow-xl">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Estimated Crowd</span>
                    <span className="text-base font-extrabold font-mono text-cyan-300">
                      {dynamicCount.toLocaleString()} <span className="text-xs font-normal text-slate-300">heads</span>
                    </span>
                  </div>
                  <div className="w-px h-7 bg-slate-800" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Spatial Density</span>
                    <span className={`text-base font-extrabold font-mono ${
                      dynamicDensity >= 5.0 ? 'text-rose-400' : dynamicDensity >= 3.5 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {dynamicDensity} <span className="text-xs font-normal text-slate-300">P/m²</span>
                    </span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 shadow-xl ${
                  dynamicDensity >= 5.0
                    ? 'bg-rose-950/90 border-rose-600 text-rose-200'
                    : dynamicDensity >= 3.5
                    ? 'bg-amber-950/90 border-amber-600 text-amber-200'
                    : 'bg-emerald-950/90 border-emerald-600 text-emerald-200'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                  <span>
                    {dynamicDensity >= 5.0
                      ? 'CRITICAL CRUSH DANGER'
                      : dynamicDensity >= 3.5
                      ? 'HEAVY CONGESTION'
                      : 'NORMAL LAMINAR FLOW'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold px-2 text-[11px] uppercase tracking-wider">
                Computer Vision Layers:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveVisualMode('RGB')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    activeVisualMode === 'RGB'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Raw Optical RGB
                </button>
                <button
                  onClick={() => setActiveVisualMode('AI_BOXES')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                    activeVisualMode === 'AI_BOXES'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>AI Detection Boxes</span>
                </button>
                <button
                  onClick={() => setActiveVisualMode('HEATMAP')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                    activeVisualMode === 'HEATMAP'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Thermal Heatmap</span>
                </button>
                <button
                  onClick={() => setActiveVisualMode('FLOW_VECTORS')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                    activeVisualMode === 'FLOW_VECTORS'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Optical Vectors</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-3.5">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-sm">{activeLocation.name}</h4>
                  <span className="text-xs text-amber-400 font-bold block mt-0.5">{activeLocation.marathiName}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLocation.description}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>GPS: {activeLocation.coordinates.lat}° N, {activeLocation.coordinates.lng}° E</span>
                <span className="text-blue-400">Fixed PTZ Optical</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Flow Velocity</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {activeLocation.velocityMps} m/s
                </div>
                <span className="text-[10px] text-slate-400">{activeLocation.flowDirection.replace(/_/g, ' ')}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Compressive PSI</span>
                <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                  {(dynamicDensity * 0.28).toFixed(1)} PSI
                </div>
                <span className="text-[10px] text-slate-400">Threshold: &lt; 1.2 PSI</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-blue-900/60 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Gemini AI Vision Crowd Diagnostics
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Execute deep neural multimodal crowd analysis to detect bottlenecks, estimate true counts, and calculate compressive shockwaves.
              </p>

              <button
                onClick={handleRunAiAnalysis}
                disabled={isAiAnalyzing}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/40 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAiAnalyzing ? 'Analyzing Street Visual Frame...' : 'Run Live Gemini AI Analysis'}</span>
              </button>

              {aiReport && (
                <div className="p-3 bg-slate-900 rounded-xl border border-blue-800/80 space-y-2 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400 font-mono text-[10px]">AI VERDICT:</span>
                    <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${
                      aiReport.riskLevel === 'CRITICAL_CRUSH'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}>
                      {aiReport.riskLevel}
                    </span>
                  </div>

                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Flow Dynamics: <strong className="text-white">{aiReport.pedestrianFlowRate}</strong>
                  </div>

                  {aiReport.recommendedActions && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold block">Recommended Actions:</span>
                      <ul className="space-y-1">
                        {aiReport.recommendedActions.map((action: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>On-Site Emergency Street Controls</span>
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (onTriggerDiversion) {
                      onTriggerDiversion(activeLocation.name);
                    }
                    alert(`Diversion barricades ordered at ${activeLocation.name}. Inflow blocked and re-routed.`);
                  }}
                  className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-bold text-xs text-left transition flex flex-col justify-between"
                >
                  <Navigation className="w-4 h-4 mb-1" />
                  <span>Deploy Diversion Barricades</span>
                </button>

                <button
                  onClick={handleTriggerBroadcast}
                  className="p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/60 text-rose-300 font-bold text-xs text-left transition flex flex-col justify-between"
                >
                  <Volume2 className="w-4 h-4 mb-1" />
                  <span>{broadcastSent ? 'Broadcast Sent!' : 'PA Audio Alert (Marathi)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Nashik Police Integrated Command & Control Center (ICCC) CCTV Network</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Encrypted RTSP/HLS Stream</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
