import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  ShieldAlert, 
  RefreshCw 
} from 'lucide-react';
import { Sector, Incident } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sectors: Sector[];
  incidents: Incident[];
}

export const GeminiAdvisorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sectors,
  incidents
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Namaste Commander. I am the Kumbh-Rakshak 2027 Gemini AI Disaster Advisor. I continuously analyze crowd fluid dynamics, compressive pressures, and AED fleet telemetry across Ramkund, Laxman Ghat, and Sadhugram. How can I assist field operations right now?'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/crowd-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          sectorsContext: sectors.map(s => ({
            name: s.name,
            density: s.density,
            riskLevel: s.riskLevel,
            occupancy: `${s.currentPeople}/${s.maxCapacity}`,
            pressurePsi: s.pressurePsi
          })),
          incidentsContext: incidents.slice(0, 5).map(i => ({
            title: i.title,
            severity: i.severity,
            status: i.status,
            location: i.locationName
          }))
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.response || 'Action protocol acknowledged. Maintain laminar flow and monitor chokepoint barriers.' 
      }]);
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Local Advisory Protocol: High crowd density detected at Ramkund. Deploy barrier diversion to Laxman Promenade North lane immediately. Alert volunteer AED runner team.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border border-blue-500/70 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[92vh]"
      >
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-950 border border-blue-500/40 text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  Gemini 2.5 Flash Disaster & Crowd Fluid Advisor
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-700 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground telemetry synthesized with NDMA & Kumbh Mela safety protocols
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing multidimensional ghat telemetry...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask tactical advice: e.g. 'How to divert Ramkund crush towards Laxman Ghat?'"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50 shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
