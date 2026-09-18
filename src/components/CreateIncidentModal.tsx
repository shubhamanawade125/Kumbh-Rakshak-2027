import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  Check, 
  Sparkles,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentSeverity } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'history'>) => void;
}

export const CreateIncidentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreateIncident
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('HEAT_COLLAPSE');
  const [severity, setSeverity] = useState<IncidentSeverity>('CRITICAL');
  const [locationName, setLocationName] = useState('Ramkund Snan Ghat East Footbridge');
  const [lat, setLat] = useState<number>(19.9996);
  const [lng, setLng] = useState<number>(73.7915);
  const [source, setSource] = useState<'AI_CCTV' | 'VOLUNTEER_REPORT' | 'POLICE_RADIO' | 'IOT_BARRIER' | 'PUBLIC_SOS'>('VOLUNTEER_REPORT');
  const [aiRecommendation, setAiRecommendation] = useState('Dispatch on-foot AED runner with sub-3-min CPR kit and alert Ramkund emergency post.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please provide an incident title');
      return;
    }

    onCreateIncident({
      title,
      category,
      severity,
      status: 'DETECTED',
      locationName,
      coordinates: [lat, lng],
      source,
      aiConfidence: 0.94,
      aiRecommendation,
      goldenTimerRemainingSeconds: 180,
      assignedResponder: 'VOL-RAMKUND-01'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border border-rose-600/70 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-950 border border-rose-500/40 text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Report Ground Incident / Distress Alert
              </h3>
              <p className="text-xs text-slate-400">
                Instantly synchronizes with Tactical Map, Golden 3-Min Resuscitation Timer & Audit Trail
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Incident Headline / Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Elderly pilgrim collapsed near Laxman bridge steps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
              >
                <option value="CARDIAC_ARREST">Cardiac Arrest / Sudden Collapse</option>
                <option value="HEAT_COLLAPSE">Severe Heatstroke / Syncope</option>
                <option value="CROWD_SURGE">Crowd Surge / Crush Hazard</option>
                <option value="TRAUMA_CRUSH">Trauma / Barricade Pressure</option>
                <option value="DROWNING_RISK">River Godavari Drowning Risk</option>
                <option value="CHOKEPOINT_JAM">Chokepoint Pedestrian Jam</option>
                <option value="MISSING_CHILD">Missing Child / Pilgrim</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium font-bold text-rose-400"
              >
                <option value="CRITICAL">CRITICAL (Immediate Action)</option>
                <option value="HIGH">HIGH (High Risk)</option>
                <option value="WATCH">WATCH (Precautionary)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location Landmark</span>
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Reporting Channel Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="VOLUNTEER_REPORT">On-Ground Volunteer Report (Mobile App)</option>
              <option value="POLICE_RADIO">Nashik Police Wireless Band (108 VHF)</option>
              <option value="AI_CCTV">AI Optical Computer Vision Camera</option>
              <option value="IOT_BARRIER">IoT Hydraulic Barricade Strain Gauge</option>
              <option value="PUBLIC_SOS">Public Pilgrim SOS Terminal</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Prescriptive Directive</span>
            </label>
            <textarea
              rows={2}
              value={aiRecommendation}
              onChange={(e) => setAiRecommendation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition flex items-center gap-2 shadow-lg shadow-rose-950/60"
            >
              <Check className="w-4 h-4" />
              <span>Broadcast & Log Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
