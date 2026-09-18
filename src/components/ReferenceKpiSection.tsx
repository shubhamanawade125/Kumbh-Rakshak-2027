import React from 'react';
import { Users, AlertTriangle, Ambulance, UserX, UserCheck, HeartPulse } from 'lucide-react';
import { Sector, Incident, MissingPersonAlert, VolunteerResponder, AedStation, AmbulanceUnit } from '../types';

interface MetricCardProps {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtext: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ id, icon, iconBg, title, value, subtext }) => {
  return (
    <div
      id={id}
      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500 leading-tight truncate">
          {title}
        </span>
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
          {value}
        </span>
        <div className="text-[11px] font-semibold text-right leading-tight truncate">
          {subtext}
        </div>
      </div>
    </div>
  );
};

interface KpiProps {
  sectors?: Sector[];
  incidents?: Incident[];
  missingPersons?: MissingPersonAlert[];
  volunteers?: VolunteerResponder[];
  aedStations?: AedStation[];
  ambulances?: AmbulanceUnit[];
}

export const ReferenceKpiSection: React.FC<KpiProps> = ({
  sectors,
  incidents = [],
  missingPersons = [],
  volunteers = [],
  aedStations = [],
  ambulances = []
}) => {
  const totalCrowdCount = sectors 
    ? sectors.reduce((acc, s) => acc + s.currentPeople, 0)
    : 248320;

  const criticalIncidentsCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const highIncidentsCount = incidents.filter(i => i.severity === 'HIGH').length;

  const activeMissingCount = missingPersons.filter(p => p.status !== 'REUNITED' && p.status !== 'CLOSED').length;
  const searchingCount = missingPersons.filter(p => p.status === 'SEARCHING' || p.status === 'BROADCAST').length;

  const activeVolunteersCount = volunteers.length > 0
    ? volunteers.filter(v => v.status !== 'OFF_DUTY').length
    : 10;

  const operationalAedsCount = aedStations.length > 0
    ? aedStations.filter(a => a.status === 'OPERATIONAL').length
    : 10;

  const dispatchedAmbulancesCount = ambulances.length > 0
    ? ambulances.filter(a => a.status === 'DISPATCHED' || a.status === 'ON_SCENE' || a.status === 'TRANSIT_TO_HOSPITAL').length
    : 1;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">
      <MetricCard
        id="kpi-total-crowd"
        icon={<Users className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-50"
        title="Total Crowd (Est.)"
        value={totalCrowdCount.toLocaleString()}
        subtext={
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
              {sectors ? `${sectors.length} sectors` : 'Live'}
            </span>
            <span className="text-slate-400 font-normal text-[10px] mt-0.5">Across all ghats</span>
          </div>
        }
      />

      <MetricCard
        id="kpi-active-incidents"
        icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
        iconBg="bg-rose-50"
        title="Active Incidents"
        value={String(incidents.length).padStart(2, '0')}
        subtext={
          <div className="flex items-center gap-1.5">
            <span className="text-rose-600 font-bold">{criticalIncidentsCount} Critical</span>
            <span className="text-amber-500 font-bold">{highIncidentsCount} High</span>
          </div>
        }
      />

      <MetricCard
        id="kpi-medical-response"
        icon={<Ambulance className="w-5 h-5 text-sky-600" />}
        iconBg="bg-sky-50"
        title="Medical Response"
        value={String(dispatchedAmbulancesCount).padStart(2, '0')}
        subtext={
          <span className="text-slate-500 font-normal text-[10px]">
            Avg. response <strong className="text-slate-800 font-semibold">2.8 min</strong>
          </span>
        }
      />

      <MetricCard
        id="kpi-missing-persons"
        icon={<UserX className="w-5 h-5 text-rose-500" />}
        iconBg="bg-rose-50"
        title="Missing Persons"
        value={String(activeMissingCount).padStart(2, '0')}
        subtext={
          <span className="text-slate-500 font-normal text-[10px]">
            <strong className="text-slate-800 font-semibold">{searchingCount} active</strong> search
          </span>
        }
      />

      <MetricCard
        id="kpi-volunteers-field"
        icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
        iconBg="bg-emerald-50"
        title="Active Volunteers"
        value={String(activeVolunteersCount).padStart(2, '0')}
        subtext={
          <span className="text-emerald-600 font-bold text-[10px]">
            {activeVolunteersCount} Active <span className="text-slate-400 font-normal">on Ghats</span>
          </span>
        }
      />

      <MetricCard
        id="kpi-aeds-online"
        icon={<HeartPulse className="w-5 h-5 text-rose-600" />}
        iconBg="bg-rose-50"
        title="AED Stations"
        value={String(operationalAedsCount).padStart(2, '0')}
        subtext={
          <span className="text-emerald-600 font-bold text-[10px]">
            100% Ready <span className="text-slate-400 font-normal">Sub-3-Min</span>
          </span>
        }
      />

      <div
        id="kpi-kumbh-banner"
        className="col-span-2 md:col-span-3 xl:col-span-1 rounded-2xl relative overflow-hidden shadow-xs border border-amber-900/20 flex flex-col justify-end p-3 text-white select-none group min-h-[92px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-amber-900/75 to-orange-800/80 z-10"></div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Simhastha_Kumbh_Mela_at_Nashik_in_Maharashtra_state.jpg"
          alt="Nashik Kumbh Mela Ghats at Sunset"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute right-2 bottom-0 z-10 opacity-35 pointer-events-none">
          <svg viewBox="0 0 100 80" className="w-24 h-16 fill-amber-300">
            <polygon points="50,5 55,25 45,25" />
            <polygon points="50,25 65,55 35,55" />
            <polygon points="50,55 75,80 25,80" />
            <polygon points="20,40 30,65 10,65" />
            <polygon points="80,40 90,65 70,65" />
          </svg>
        </div>

        <div className="relative z-20">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-300">
            A Safer
          </span>
          <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight uppercase font-['Cinzel',serif] text-amber-100">
            Kumbh
          </h3>
          <span className="text-[10px] font-semibold text-amber-200/90 uppercase tracking-wider block">
            For Millions
          </span>
        </div>
      </div>
    </div>
  );
};
