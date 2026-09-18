import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  MapPin, 
  Check, 
  HeartPulse, 
  Phone, 
  Timer, 
  Volume2 
} from 'lucide-react';
import { AedStation, VolunteerResponder } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  aedStations: AedStation[];
  volunteers: VolunteerResponder[];
  onConfirmDispatch: (aedId: string, volunteerId: string) => void;
}

export const EmergencyAedTriggerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  aedStations,
  volunteers,
  onConfirmDispatch
}) => {
  const [selectedAedId, setSelectedAedId] = useState<string>(aedStations[0]?.id || '');
  const [selectedVolId, setSelectedVolId] = useState<string>(volunteers[0]?.id || '');
  const [countdown, setCountdown] = useState<number>(180);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(180);
      setAudioPlaying(false);
      return;
    }
    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const activeAed = aedStations.find(a => a.id === selectedAedId) || aedStations[0];
  const activeVol = volunteers.find(v => v.id === selectedVolId) || volunteers[0];

  const handlePlayCprAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'Emergency Cardiac Alert. Apply AED pads firmly to bare chest. Turn on AED. Follow voice prompts. Do not touch the patient during rhythm analysis. Deliver shock if advised. Begin chest compressions immediately.';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      setAudioPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDispatch = () => {
    onConfirmDispatch(activeAed.id, activeVol.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border-2 border-rose-500 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        <div className="bg-rose-950/90 px-6 py-4 border-b border-rose-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-wide">
                  RAPID SUB-3-MIN AED / CPR DISPATCH BEACON
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-700 text-[10px] font-mono font-black">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Dispatches foot-runner with automated defibrillator to sudden collapse victim
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/50 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                Golden 3-Min Brain Viability Clock
              </span>
              <p className="text-[11px] text-slate-300">
                Target: Foot-runner shock delivery before irreversible brain damage at 4 minutes
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black font-mono text-rose-400 tracking-tight">
                0{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">
              1. Select Closest Fixed AED Cabinet:
            </label>
            <select
              value={selectedAedId}
              onChange={(e) => setSelectedAedId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              {aedStations.map((aed) => (
                <option key={aed.id} value={aed.id}>
                  {aed.name} ({aed.locationDescription}) • Battery: {aed.batteryLevel}%
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">
              2. Select Designated Foot-Runner Volunteer:
            </label>
            <select
              value={selectedVolId}
              onChange={(e) => setSelectedVolId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              {volunteers.map((vol) => (
                <option key={vol.id} value={vol.id}>
                  {vol.name} ({vol.role}) • Zone: {vol.currentLocationName} • Tel: {vol.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">On-Site Runner Instructions:</span>
              <button
                type="button"
                onClick={handlePlayCprAudio}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold flex items-center gap-1 transition"
              >
                <Volume2 className="w-3 h-3" />
                <span>{audioPlaying ? 'Voice Playing...' : 'Test Audio Prompt'}</span>
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>Open AED cabinet and press green power switch.</li>
              <li>Expose patient chest. Apply pads according to diagram.</li>
              <li>Clear bystanders during automatic rhythm analysis.</li>
              <li>Press flashing orange shock button if advised. Continue 30:2 CPR.</li>
            </ol>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Volunteer Link: <strong className="text-white font-mono">{activeVol.phone}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDispatch}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition flex items-center gap-2 shadow-lg shadow-rose-950/60"
              >
                <Check className="w-4 h-4" />
                <span>Dispatch Foot-Runner Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
