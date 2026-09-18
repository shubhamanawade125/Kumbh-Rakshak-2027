import React, { useState } from 'react';
import { 
  HeartPulse, 
  Zap, 
  MapPin, 
  Phone, 
  UserCheck, 
  Search,
  BellRing
} from 'lucide-react';
import { AedStation, VolunteerResponder } from '../types';

interface Props {
  aedStations: AedStation[];
  volunteers: VolunteerResponder[];
  onDispatchVolunteerToAed: (volunteerId: string, aedId: string) => void;
}

export const VolunteersAedsView: React.FC<Props> = ({
  aedStations,
  volunteers,
  onDispatchVolunteerToAed
}) => {
  const [activeTab, setActiveTab] = useState<'AEDS' | 'VOLUNTEERS'>('VOLUNTEERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifiedVolunteers, setNotifiedVolunteers] = useState<Record<string, { aedName: string; time: string }>>({});
  const [selectedTargetAed, setSelectedTargetAed] = useState<Record<string, string>>({});

  const filteredAeds = aedStations.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.locationDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.currentLocationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.phone.includes(searchQuery)
  );

  const handleNotifyVolunteer = (vol: VolunteerResponder) => {
    const targetAedId = selectedTargetAed[vol.id] || aedStations[0]?.id;
    const aed = aedStations.find(a => a.id === targetAedId) || aedStations[0];
    
    setNotifiedVolunteers(prev => ({
      ...prev,
      [vol.id]: {
        aedName: aed.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    }));

    onDispatchVolunteerToAed(vol.id, aed.id);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Rapid Response Fleet: On-Foot Trained Volunteers & Automated Defibrillators (AEDs)
            </h3>
            <p className="text-slate-400 text-[11px]">
              Real-time geofenced volunteer dispatch: Notify trained volunteer runners with their phone number to fetch the nearest AED and reach cardiac victims in &lt; 3 minutes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('VOLUNTEERS')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'VOLUNTEERS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trained Volunteers ({volunteers.length})
          </button>
          <button
            onClick={() => setActiveTab('AEDS')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'AEDS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AED Units ({aedStations.length})
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'VOLUNTEERS' ? "Search volunteer by name, phone (+91), sector..." : "Search AED units by pillar, ghat location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {activeTab === 'VOLUNTEERS' ? filteredVolunteers.length : filteredAeds.length} records
        </span>
      </div>

      {activeTab === 'VOLUNTEERS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVolunteers.map((vol) => {
            const isNotified = !!notifiedVolunteers[vol.id];
            const notificationInfo = notifiedVolunteers[vol.id];

            return (
              <div
                key={vol.id}
                className={`bg-slate-900 border rounded-2xl p-4 shadow-xl space-y-3 transition ${
                  isNotified ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <span>{vol.name}</span>
                      {vol.carryingAed && (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                          ⚡ AED EQUIPPED
                        </span>
                      )}
                    </h4>
                    <span className="text-xs text-cyan-400 font-mono font-semibold">{vol.role.replace(/_/g, ' ')}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isNotified
                      ? 'bg-amber-950 text-amber-300 border-amber-500 animate-pulse'
                      : vol.status === 'AVAILABLE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {isNotified ? 'DISPATCHED TO AED' : vol.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">Zone: <strong>{vol.currentLocationName}</strong></span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Mobile:</span>
                    <a
                      href={`tel:${vol.phone}`}
                      className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{vol.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Assign Closest AED Unit:</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Sub-3-Min Corridor</span>
                  </div>
                  <select
                    value={selectedTargetAed[vol.id] || aedStations[0]?.id}
                    onChange={(e) => setSelectedTargetAed({ ...selectedTargetAed, [vol.id]: e.target.value })}
                    disabled={isNotified}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {aedStations.map((aed) => (
                      <option key={aed.id} value={aed.id}>
                        {aed.name} ({aed.locationDescription}) • Batt {aed.batteryLevel}%
                      </option>
                    ))}
                  </select>
                </div>

                {isNotified && (
                  <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-center justify-between text-xs text-emerald-200">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                      <span>
                        Alert dispatched at {notificationInfo.time}: <strong>{vol.name}</strong> fetching <strong>{notificationInfo.aedName}</strong>.
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">ACTIVE EN ROUTE</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <a
                    href={`tel:${vol.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Volunteer</span>
                  </a>

                  <button
                    onClick={() => handleNotifyVolunteer(vol)}
                    className={`px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition shadow-lg ${
                      isNotified
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{isNotified ? 'Re-Notify Volunteer' : 'Notify Volunteer to get AED & Reach'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAeds.map((aed) => (
            <div
              key={aed.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{aed.name}</span>
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                  </h4>
                  <span className="text-[11px] text-slate-400">{aed.locationDescription}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  aed.status === 'OPERATIONAL' 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  {aed.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">BATTERY</span>
                  <span className="font-mono font-bold text-emerald-400">{aed.batteryLevel}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PAD EXPIRY</span>
                  <span className="font-mono text-slate-200">{aed.padExpiryYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ASSIGNED RUNNER</span>
                  <span className="text-slate-200 truncate block">{aed.nearestAssignedVolunteer || 'Auto-Routing'}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">CPR Quick Protocol:</span>
                <p className="text-[10px] text-slate-400 line-clamp-2">
                  {aed.cprInstructions[0]} • {aed.cprInstructions[1]}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Emergency Desk: <strong>{aed.callSupportPhone}</strong></span>
                <button
                  onClick={() => onDispatchVolunteerToAed(volunteers[0]?.id, aed.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 shadow"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Notify Nearest Volunteer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
