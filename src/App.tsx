import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReferenceHeader } from './components/ReferenceHeader';
import { ReferenceSidebar, NavItemKey } from './components/ReferenceSidebar';
import { ReferenceKpiSection } from './components/ReferenceKpiSection';
import { ReferenceTacticalMap } from './components/ReferenceTacticalMap';
import { ReferenceRightPanel } from './components/ReferenceRightPanel';
import { PublicCctvView } from './components/PublicCctvView';
import { CrowdSafetyView } from './components/CrowdSafetyView';
import { MedicalResponseView } from './components/MedicalResponseView';
import { MissingPersonsView } from './components/MissingPersonsView';
import { AmbulancesView } from './components/AmbulancesView';
import { VolunteersAedsView } from './components/VolunteersAedsView';
import { UnifiedIncidentsView } from './components/UnifiedIncidentsView';

// Modals
import { AuthModal } from './components/AuthModal';
import { SimulateStampedeModal } from './components/SimulateStampedeModal';
import { EmergencyAedTriggerModal } from './components/EmergencyAedTriggerModal';
import { RegisterMissingModal } from './components/RegisterMissingModal';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { GeminiAdvisorModal } from './components/GeminiAdvisorModal';
import { LiveCrowdStreetMonitorModal } from './components/LiveCrowdStreetMonitorModal';

// Initial Data
import { 
  INITIAL_SECTORS, 
  INITIAL_INCIDENTS, 
  INITIAL_AED_STATIONS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_AMBULANCES, 
  INITIAL_MISSING_PERSONS,
  INITIAL_MEDICAL_CAMPS
} from './data/nashikData';

import { 
  Sector, 
  Incident, 
  AedStation, 
  VolunteerResponder, 
  AmbulanceUnit, 
  MissingPersonAlert,
  MissingPersonStatus,
  IncidentStatus,
  IncidentTimelineEvent
} from './types';

import { 
  ShieldAlert, 
  Zap, 
  UserPlus, 
  AlertOctagon, 
  Sparkles, 
  Activity, 
  Volume2, 
  VolumeX, 
  Radio, 
  ArrowRight,
  Eye
} from 'lucide-react';

const DashboardInner: React.FC = () => {
  const { user } = useAuth();
  
  // Navigation
  const [activeNav, setActiveNav] = useState<NavItemKey>('COMMAND_CENTER');

  // Core Data
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [aedStations] = useState<AedStation[]>(INITIAL_AED_STATIONS);
  const [volunteers, setVolunteers] = useState<VolunteerResponder[]>(INITIAL_VOLUNTEERS);
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>(INITIAL_AMBULANCES);
  const [missingPersons, setMissingPersons] = useState<MissingPersonAlert[]>(INITIAL_MISSING_PERSONS);
  
  const [selectedSector, setSelectedSector] = useState<Sector>(INITIAL_SECTORS[0]);
  const [greenCorridorActive, setGreenCorridorActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState<boolean>(false);
  const [isAedModalOpen, setIsAedModalOpen] = useState<boolean>(false);
  const [isMissingModalOpen, setIsMissingModalOpen] = useState<boolean>(false);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState<boolean>(false);
  const [isGeminiAdvisorOpen, setIsGeminiAdvisorOpen] = useState<boolean>(false);
  const [isLiveStreetMonitorOpen, setIsLiveStreetMonitorOpen] = useState<boolean>(false);
  const [streetMonitorLocId, setStreetMonitorLocId] = useState<string | undefined>(undefined);

  // Live Golden Timer Countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status !== 'RESOLVED' && inc.goldenTimerRemainingSeconds && inc.goldenTimerRemainingSeconds > 0) {
            return {
              ...inc,
              goldenTimerRemainingSeconds: inc.goldenTimerRemainingSeconds - 1,
            };
          }
          return inc;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Voice Announcement helper
  const playVoiceAnnouncement = useCallback((message: string) => {
    if (!soundEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [soundEnabled]);

  // Handle Surge Injection from Simulator
  const handleInjectSurge = (sectorId: string, surgeDensity: number, triggerIncident: boolean) => {
    setSectors((prev) =>
      prev.map((sec) => {
        if (sec.id === sectorId) {
          const isCritical = surgeDensity >= 5.0;
          return {
            ...sec,
            density: surgeDensity,
            riskLevel: isCritical ? 'CRITICAL_CRUSH' : 'HIGH_WARNING',
            pressurePsi: Number((1.1 + (surgeDensity - 4) * 0.4).toFixed(2)),
            velocityMps: Number(Math.max(0.12, 0.65 - surgeDensity * 0.08).toFixed(2)),
          };
        }
        return sec;
      })
    );

    if (triggerIncident) {
      const targetSec = sectors.find((s) => s.id === sectorId) || sectors[0];
      const newInc: Incident = {
        id: `inc-surge-${Date.now().toString().slice(-4)}`,
        title: `CRITICAL CROWD SURGE & COLLAPSE: ${targetSec.name}`,
        category: 'CROWD_SURGE',
        severity: 'CRITICAL',
        status: 'DETECTED',
        locationName: targetSec.name,
        coordinates: targetSec.coordinates,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'IOT_BARRIER',
        aiConfidence: 0.98,
        aiRecommendation: `Immediate diversion: Close ${targetSec.name} entry barriers. Pulse crowd via secondary promenade. Dispatch sub-3-min AED foot team.`,
        goldenTimerRemainingSeconds: 180,
        assignedResponder: 'VOL-RAMKUND-01',
        history: [
          {
            id: `ev-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actor: 'Helbing Physics Model',
            role: 'Automated Sensor',
            action: 'Compressive Surge Detection',
            details: 'Compressive surge wave detected (>5.0 P/m²)',
            type: 'AI_DETECTION',
            performedBy: 'Helbing Physics Model'
          }
        ]
      };

      setIncidents((prev) => [newInc, ...prev]);
      playVoiceAnnouncement(`Attention all units. Critical crowd surge wave detected at ${targetSec.name}. Deploy barrier diversion team immediately.`);
    }
  };

  // Handle Missing Person Register
  const handleRegisterMissing = (personData: Omit<MissingPersonAlert, 'id' | 'caseNumber' | 'reportedAt'>) => {
    const newPerson: MissingPersonAlert = {
      ...personData,
      id: `mp-${Date.now().toString().slice(-4)}`,
      caseNumber: `KMB-27-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMissingPersons((prev) => [newPerson, ...prev]);
    playVoiceAnnouncement(`Emergency Missing Pilgrim Alert broadcast for ${newPerson.name}. Information synced to all 14 Ghat public screens.`);
  };

  // Handle Ground Incident Creation
  const handleCreateIncident = (incidentData: Omit<Incident, 'id' | 'timestamp' | 'history'>) => {
    const newInc: Incident = {
      ...incidentData,
      id: `inc-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      history: [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: user?.displayName || 'Ground Dispatcher',
          role: 'Field Officer',
          action: 'Incident Created',
          details: 'Incident logged to unified disaster registry',
          type: 'HUMAN_DECISION',
          performedBy: user?.displayName || 'Ground Dispatcher'
        }
      ]
    };

    setIncidents((prev) => [newInc, ...prev]);
    playVoiceAnnouncement(`New incident reported: ${newInc.title}`);
  };

  // Handle Rapid AED Dispatch
  const handleConfirmAedDispatch = (aedId: string, volunteerId: string) => {
    const targetAed = aedStations.find((a) => a.id === aedId);
    const targetVol = volunteers.find((v) => v.id === volunteerId);

    if (targetAed && targetVol) {
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === volunteerId
            ? { ...v, status: 'EN_ROUTE_AED', assignedIncidentId: 'INC-ACTIVE' }
            : v
        )
      );

      playVoiceAnnouncement(`Priority One AED dispatch confirmed. Volunteer ${targetVol.name} en route with defibrillator to patient.`);
    }
  };

  // Open Street Monitor Modal
  const handleOpenLiveStreetMonitor = (locId?: string) => {
    setStreetMonitorLocId(locId);
    setIsLiveStreetMonitorOpen(true);
  };

  const criticalIncidentsCount = incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <ReferenceHeader
        onOpenProfileModal={() => setIsAuthOpen(true)}
        onOpenLiveStreetMonitor={() => handleOpenLiveStreetMonitor()}
      />

      {/* Critical Alert Ribbon if high crowd density */}
      {criticalIncidentsCount > 0 && (
        <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <span className="p-1 bg-white text-rose-600 rounded-md animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
            <span>
              CRITICAL DISASTER ALERT: {criticalIncidentsCount} active emergency event(s) in sacred ghat sectors! Golden 3-minute CPR clock running.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveNav('INCIDENTS')}
              className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 font-extrabold hover:bg-rose-50 transition text-[11px] flex items-center gap-1 shadow-xs"
            >
              Take Action <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <ReferenceSidebar
          activeItem={activeNav}
          onSelectItem={(item) => setActiveNav(item)}
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4">
          {/* Global Quick Action Tool Ribbon */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-quick-aed"
                onClick={() => setIsAedModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Sub-3-Min CPR / AED Beacon</span>
              </button>

              <button
                id="btn-quick-amber"
                onClick={() => setIsMissingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Emergency Amber Alert</span>
              </button>

              <button
                id="btn-quick-incident"
                onClick={() => setIsCreateIncidentOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Ground Incident</span>
              </button>

              <button
                id="btn-quick-advisor"
                onClick={() => setIsGeminiAdvisorOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Gemini 2.5 Disaster Advisor</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-quick-street-cam"
                onClick={() => handleOpenLiveStreetMonitor()}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>Live AI Vision Monitor</span>
              </button>

              <button
                id="btn-quick-simulate"
                onClick={() => setIsSimulateOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Simulate Surge / Stampede</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Disable voice synthesizers' : 'Enable voice synthesizers'}
                className={`p-1.5 rounded-xl border transition ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* VIEW SWITCHER */}
          {activeNav === 'COMMAND_CENTER' && (
            <div className="space-y-4">
              {/* Reference KPI Ribbon */}
              <ReferenceKpiSection
                sectors={sectors}
                incidents={incidents}
                missingPersons={missingPersons}
                volunteers={volunteers}
                aedStations={aedStations}
                ambulances={ambulances}
              />

              {/* Main Split: Interactive Map + Right Intelligence Panel */}
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                <div className="flex-1 w-full space-y-4">
                  <ReferenceTacticalMap
                    sectors={sectors}
                    aedStations={aedStations}
                    medicalCamps={INITIAL_MEDICAL_CAMPS}
                    selectedSector={selectedSector}
                    ambulancePathActive={greenCorridorActive}
                    onSelectSector={(s) => setSelectedSector(s)}
                    onOpenLiveStreetMonitor={handleOpenLiveStreetMonitor}
                  />

                  {/* Quick Sector Health Matrix under the map */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                        <h4 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
                          Sacred Ghat Real-Time Capacity & Barrier Readiness
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        Cellular Telemetry Synced
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                      {sectors.map((sec) => (
                        <div
                          key={sec.id}
                          onClick={() => setSelectedSector(sec)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedSector.id === sec.id
                              ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {sec.name}
                            </span>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                                sec.riskLevel === 'CRITICAL_CRUSH'
                                  ? 'bg-rose-100 text-rose-700'
                                  : sec.riskLevel === 'HIGH_WARNING'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {sec.density} P/m²
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>Flow: {sec.velocityMps || 0.4} m/s</span>
                            <span>{sec.riskLevel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Intelligence & Incident Stream Panel */}
                <ReferenceRightPanel
                  incidents={incidents}
                  sectors={sectors}
                  onNavigateIncidents={() => setActiveNav('INCIDENTS')}
                  onNavigateSectors={() => setActiveNav('CROWD_SAFETY')}
                />
              </div>
            </div>
          )}

          {activeNav === 'PUBLIC_CCTV' && (
            <PublicCctvView onOpenLiveStreetMonitor={handleOpenLiveStreetMonitor} />
          )}

          {activeNav === 'CROWD_SAFETY' && (
            <CrowdSafetyView
              sectors={sectors}
              onSelectSector={(s) => setSelectedSector(s)}
              onConfirmDiversion={(secId: string, route: string) => {
                setSectors((prev) =>
                  prev.map((s) =>
                    s.id === secId
                      ? { ...s, density: Math.max(1.8, s.density - 1.5), riskLevel: 'SAFE', activeDiversion: route }
                      : s
                  )
                );
                playVoiceAnnouncement(`Physical barrier diversion deployed. Pedestrian traffic successfully routed towards ${route}.`);
              }}
              onResetDiversion={(secId: string) => {
                setSectors((prev) =>
                  prev.map((s) =>
                    s.id === secId
                      ? { ...s, activeDiversion: null, riskLevel: 'STABLE' }
                      : s
                  )
                );
                playVoiceAnnouncement('Barrier diversion reset.');
              }}
              onOpenLiveStreetMonitor={handleOpenLiveStreetMonitor}
            />
          )}

          {activeNav === 'MISSING_PERSONS' && (
            <MissingPersonsView
              missingPersons={missingPersons}
              onOpenRegisterModal={() => setIsMissingModalOpen(true)}
              onBroadcastAlert={(personId: string) => {
                setMissingPersons((prev) =>
                  prev.map((p) => (p.id === personId ? { ...p, isBroadcastingAllScreens: true, status: 'BROADCAST' } : p))
                );
                playVoiceAnnouncement('Emergency missing person broadcast activated across all ghat display towers.');
              }}
              onUpdateStatus={(personId: string, newStatus: MissingPersonStatus) => {
                setMissingPersons((prev) =>
                  prev.map((p) => (p.id === personId ? { ...p, status: newStatus } : p))
                );
              }}
              onDeletePerson={(personId: string) => {
                setMissingPersons((prev) => prev.filter((p) => p.id !== personId));
              }}
            />
          )}

          {activeNav === 'AMBULANCES' && (
            <AmbulancesView
              ambulances={ambulances}
              greenCorridor={greenCorridorActive ? {
                status: 'ACTIVE_TRANSIT',
                targetHospital: 'Nashik District Civil Hospital',
                currentRoute: 'Ramkund -> Panchavati Link -> Trimbak Naka',
                trafficSignalsOverridden: 6,
                estimatedTransitMinutes: 4,
                ambulanceCallSign: 'AMB-108-01',
                etaMinutes: 3
              } : null}
              onDispatchAmbulance={(ambulanceId: string) => {
                setAmbulances((prev) =>
                  prev.map((a) => (a.id === ambulanceId ? { ...a, status: 'DISPATCHED' } : a))
                );
                playVoiceAnnouncement(`Ambulance ${ambulanceId} dispatched with siren pre-emption.`);
              }}
              onToggleGreenCorridor={() => {
                setGreenCorridorActive(!greenCorridorActive);
                playVoiceAnnouncement(
                  !greenCorridorActive
                    ? 'Green corridor activated. Traffic signals pre-empted for 108 ambulance convoy to Civil Hospital.'
                    : 'Green corridor deactivated. Traffic signals returned to automatic civil cycle.'
                );
              }}
            />
          )}

          {activeNav === 'AED_VOLUNTEERS' && (
            <VolunteersAedsView
              aedStations={aedStations}
              volunteers={volunteers}
              onDispatchVolunteerToAed={(volunteerId: string, aedId: string) => {
                handleConfirmAedDispatch(aedId, volunteerId);
              }}
            />
          )}

          {activeNav === 'INCIDENTS' && (
            <UnifiedIncidentsView
              incidents={incidents}
              onSelectIncident={(inc: Incident) => {
                const targetSec = sectors.find((s) => s.name === inc.locationName);
                if (targetSec) setSelectedSector(targetSec);
              }}
              onUpdateIncidentStatus={(incidentId: string, newStatus: IncidentStatus) => {
                setIncidents((prev) =>
                  prev.map((i) => (i.id === incidentId ? { ...i, status: newStatus } : i))
                );
              }}
              onAddTimelineEvent={(incidentId: string, event: Omit<IncidentTimelineEvent, 'id' | 'timestamp'>) => {
                setIncidents((prev) =>
                  prev.map((i) =>
                    i.id === incidentId
                      ? {
                          ...i,
                          history: [
                            ...i.history,
                            {
                              ...event,
                              id: `ev-${Date.now()}`,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }
                          ]
                        }
                      : i
                  )
                );
              }}
              onOpenCreateModal={() => setIsCreateIncidentOpen(true)}
              onDeleteIncident={(incidentId: string) => {
                setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
              }}
            />
          )}

          {activeNav === 'MEDICAL_RESPONSE' && (
            <MedicalResponseView
              incidents={incidents}
              aedStations={aedStations}
              volunteers={volunteers}
              ambulances={ambulances}
              onDispatchVolunteer={(incidentId: string, volunteerId: string) => {
                setVolunteers((prev) =>
                  prev.map((v) =>
                    v.id === volunteerId
                      ? { ...v, status: 'DISPATCHED_TO_INCIDENT', assignedIncidentId: incidentId }
                      : v
                  )
                );
                playVoiceAnnouncement('Volunteer responder dispatched with first-aid kit.');
              }}
              onRequestAmbulance={(incidentId: string, ambulanceId: string) => {
                setAmbulances((prev) =>
                  prev.map((a) => (a.id === ambulanceId ? { ...a, status: 'DISPATCHED' } : a))
                );
                playVoiceAnnouncement('Emergency ambulance dispatched to scene.');
              }}
              onUpdateMedicalStatus={(incidentId: string, statusText: string) => {
                setIncidents((prev) =>
                  prev.map((i) =>
                    i.id === incidentId
                      ? {
                          ...i,
                          history: [
                            ...i.history,
                            {
                              id: `ev-${Date.now()}`,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              actor: 'Medical Coordinator',
                              role: 'Doctor On Duty',
                              action: 'Triage Update',
                              details: statusText,
                              type: 'HUMAN_DECISION'
                            }
                          ]
                        }
                      : i
                  )
                );
              }}
              onTriggerSimCollapse={() => setIsSimulateOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <SimulateStampedeModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        sectors={sectors}
        onInjectSurge={handleInjectSurge}
      />

      <EmergencyAedTriggerModal
        isOpen={isAedModalOpen}
        onClose={() => setIsAedModalOpen(false)}
        aedStations={aedStations}
        volunteers={volunteers}
        onConfirmDispatch={handleConfirmAedDispatch}
      />

      <RegisterMissingModal
        isOpen={isMissingModalOpen}
        onClose={() => setIsMissingModalOpen(false)}
        onRegister={handleRegisterMissing}
      />

      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => setIsCreateIncidentOpen(false)}
        onCreateIncident={handleCreateIncident}
      />

      <GeminiAdvisorModal
        isOpen={isGeminiAdvisorOpen}
        onClose={() => setIsGeminiAdvisorOpen(false)}
        sectors={sectors}
        incidents={incidents}
      />

      <LiveCrowdStreetMonitorModal
        isOpen={isLiveStreetMonitorOpen}
        onClose={() => setIsLiveStreetMonitorOpen(false)}
        initialLocationId={streetMonitorLocId}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DashboardInner />
    </AuthProvider>
  );
}
