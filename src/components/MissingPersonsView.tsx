import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Tv,
  Volume2,
  Play,
  Square,
  Trash2
} from 'lucide-react';
import { MissingPersonAlert, MissingPersonStatus } from '../types';

interface Props {
  missingPersons: MissingPersonAlert[];
  onOpenRegisterModal: () => void;
  onBroadcastAlert: (personId: string) => void;
  onUpdateStatus: (personId: string, newStatus: MissingPersonStatus) => void;
  onDeletePerson?: (personId: string) => void;
  onClearAllPersons?: () => void;
}

export const MissingPersonsView: React.FC<Props> = ({
  missingPersons,
  onOpenRegisterModal,
  onBroadcastAlert,
  onUpdateStatus,
  onDeletePerson,
  onClearAllPersons
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(missingPersons[0]?.id || 'miss-01');
  const [speakingLanguage, setSpeakingLanguage] = useState<'mr' | 'hi' | null>(null);

  const filteredPersons = missingPersons.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clothingDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastSeenLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCase = missingPersons.find(p => p.id === selectedCaseId) || missingPersons[0];

  const playVoice = (lang: 'mr' | 'hi') => {
    if (!('speechSynthesis' in window) || !activeCase) return;
    window.speechSynthesis.cancel();
    
    let text = '';
    if (lang === 'mr') {
      text = `आपातकालीन घोषणा! कुंभमेळा पोलीस नियंत्रण कक्ष. हरवलेली व्यक्ती: ${activeCase.name}, वय ${activeCase.age} वर्षे. शेवटचे पाहिलेले ठिकाण: ${activeCase.lastSeenLocation}. घातलेले कपडे: ${activeCase.clothingDescription}. आढळल्यास त्वरित जवळच्या पोलीस किंवा स्वयंसेवकांशी संपर्क साधा.`;
    } else {
      text = `आपातकालीन सूचना! कुंभमेळा पुलिस नियंत्रण कक्ष. गुमशुदा व्यक्ति: ${activeCase.name}, उम्र ${activeCase.age} वर्ष. अंतिम स्थान: ${activeCase.lastSeenLocation}. कपड़े: ${activeCase.clothingDescription}. दिखने पर तुरंत नजदीकी पुलिस अथवा स्वयंसेवकों को सूचित करें.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : 'hi-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeakingLanguage(lang);
    utterance.onend = () => setSpeakingLanguage(null);
    utterance.onerror = () => setSpeakingLanguage(null);
    window.speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingLanguage(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-yellow-900/60 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-yellow-950 border border-yellow-500/40 text-yellow-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Unified Amber Alert & Lost Pilgrim Reunification System
            </h3>
            <p className="text-slate-400 text-[11px]">
              Workflow: <span className="text-amber-400 font-semibold">Report</span> → 
              <span className="text-cyan-400 font-semibold"> Verify Photo/Attire</span> → 
              <span className="text-rose-400 font-semibold"> Broadcast to 14 Ghat Screens</span> → 
              <span className="text-indigo-400 font-semibold"> Checkpoint Sighting</span> → 
              <span className="text-emerald-400 font-semibold"> Family Reunited</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onClearAllPersons && missingPersons.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all missing person cases from the active registry?')) {
                  onClearAllPersons();
                }
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-400 font-bold text-xs transition flex items-center gap-1.5"
              title="Purge all missing cases"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
          <button
            onClick={onOpenRegisterModal}
            className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black transition flex items-center gap-2 shadow-lg shadow-yellow-950/50 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register Lost Pilgrim</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by case ID, name, saree/kurta color, or ghat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredPersons.map((person) => {
              const isSelected = person.id === selectedCaseId;
              const isBroadcasting = person.isBroadcastingAllScreens;

              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedCaseId(person.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-yellow-500 ring-1 ring-yellow-500/50 shadow-lg'
                      : isBroadcasting
                      ? 'bg-slate-900/80 border-amber-500/80 hover:border-amber-400'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={person.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                    alt={person.name}
                    className="w-16 h-20 object-cover rounded-xl border border-slate-700 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-yellow-400 font-bold">{person.caseNumber}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          person.status === 'REUNITED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : person.status === 'SIGHTING'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}>
                          {person.status}
                        </span>
                        {onDeletePerson && (
                          <button
                            type="button"
                            title={`Delete ${person.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePerson(person.id);
                            }}
                            className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/60 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-xs truncate">{person.name}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      Wearing: <strong className="text-amber-300">{person.clothingDescription}</strong>
                    </p>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{person.lastSeenLocation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {activeCase && (
            <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-2xl p-5 shadow-2xl shadow-yellow-950/40 space-y-4">
              <div className="flex items-center justify-between border-b border-yellow-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <div>
                    <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block">
                      OFFICIAL NASHIK KUMBH AMBER BROADCAST CARD
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Dispatched across 14 Information Towers & Field Police Radios
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-yellow-950 text-yellow-300 border border-yellow-500/50">
                  {activeCase.caseNumber}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={activeCase.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                  alt={activeCase.name}
                  className="w-32 h-40 sm:w-40 sm:h-48 object-cover rounded-2xl border-2 border-yellow-500 shadow-lg mx-auto sm:mx-0 shrink-0"
                />

                <div className="space-y-2 flex-1 text-xs">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">{activeCase.name}</h3>
                    <p className="text-amber-300 font-mono text-[11px]">
                      {activeCase.age} Years Old • {activeCase.gender}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Exact Clothing & Physical Identification:
                    </span>
                    <p className="text-white font-medium text-xs leading-relaxed">
                      {activeCase.clothingDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">LAST SEEN AT</span>
                      <span className="text-slate-200 font-medium">{activeCase.lastSeenLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">TIME REPORTED</span>
                      <span className="text-slate-200 font-medium">{activeCase.lastSeenTime}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Guardian Contact:</span>
                      <span className="text-white font-bold">{activeCase.guardianName}</span>
                    </div>
                    <a
                      href={`tel:${activeCase.guardianPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{activeCase.guardianPhone}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-yellow-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Volume2 className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold text-white block">Loudspeaker Chime & Voice Broadcast:</span>
                    <span className="text-[10px] text-slate-400">Public PA system for Ramkund, Laxman Ghat & Overbridges</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playVoice('mr')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                      speakingLanguage === 'mr'
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>मराठी ऑडिओ (Marathi)</span>
                  </button>

                  <button
                    onClick={() => playVoice('hi')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                      speakingLanguage === 'hi'
                        ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-300 animate-pulse'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>हिंदी ऑडियो (Hindi)</span>
                  </button>

                  {speakingLanguage && (
                    <button
                      onClick={stopVoice}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Update Case State:</span>
                  <select
                    value={activeCase.status}
                    onChange={(e) => onUpdateStatus(activeCase.id, e.target.value as MissingPersonStatus)}
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-yellow-500"
                  >
                    <option value="REPORTED">REPORTED</option>
                    <option value="BROADCAST">BROADCAST ACTIVE</option>
                    <option value="SIGHTING">SIGHTING RECORDED</option>
                    <option value="MATCH_REVIEW">MATCH REVIEW</option>
                    <option value="LOCATED">LOCATED AT CHECKPOINT</option>
                    <option value="REUNITED">REUNITED WITH FAMILY</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBroadcastAlert(activeCase.id)}
                    className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <span>Flash Public Towers (14 Screens)</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(activeCase.id, 'REUNITED')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Reunited</span>
                  </button>

                  {onDeletePerson && (
                    <button
                      type="button"
                      onClick={() => onDeletePerson(activeCase.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Case</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
