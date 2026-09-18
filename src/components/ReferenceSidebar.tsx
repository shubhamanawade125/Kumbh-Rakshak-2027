import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSearch, 
  Ambulance, 
  Activity, 
  AlertTriangle, 
  Video
} from 'lucide-react';

export type NavItemKey = 
  | 'COMMAND_CENTER' 
  | 'PUBLIC_CCTV'
  | 'CROWD_SAFETY' 
  | 'MISSING_PERSONS' 
  | 'AMBULANCES' 
  | 'AED_VOLUNTEERS' 
  | 'INCIDENTS'
  | 'MEDICAL_RESPONSE'
  | 'ANALYTICS'
  | 'SYSTEM_STATUS';

interface NavItem {
  key: NavItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'COMMAND_CENTER', label: 'Command Center', icon: LayoutDashboard },
  { key: 'PUBLIC_CCTV', label: 'Public CCTV Feeds', icon: Video },
  { key: 'CROWD_SAFETY', label: 'Crowd Safety', icon: Users },
  { key: 'MISSING_PERSONS', label: 'Missing Persons', icon: UserSearch },
  { key: 'AMBULANCES', label: 'Ambulances', icon: Ambulance },
  { key: 'AED_VOLUNTEERS', label: 'AED & Volunteers', icon: Activity },
  { key: 'INCIDENTS', label: 'Incidents', icon: AlertTriangle },
];

interface ReferenceSidebarProps {
  activeItem: NavItemKey;
  onSelectItem: (item: NavItemKey) => void;
}

export const ReferenceSidebar: React.FC<ReferenceSidebarProps> = ({
  activeItem,
  onSelectItem,
}) => {
  return (
    <aside className="w-56 shrink-0 flex flex-col justify-between bg-white border-r border-slate-200/80 min-h-[calc(100vh-68px)]">
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.key;
          return (
            <button
              key={item.key}
              id={`nav-btn-${item.key.toLowerCase()}`}
              onClick={() => onSelectItem(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 flex flex-col items-center text-center select-none">
        <div className="w-full flex justify-center mb-2 opacity-85">
          <svg
            viewBox="0 0 120 140"
            className="w-20 h-24 text-amber-800/60"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M60 4 L62 14 L58 14 Z" fill="#D97706" />
            <circle cx="60" cy="18" r="4" fill="#B45309" />
            <path d="M54 22 L66 22 L63 42 L57 42 Z" />
            <path d="M50 42 L70 42 L67 65 L53 65 Z" />
            <path d="M46 65 L74 65 L72 90 L48 90 Z" />
            <path d="M42 90 L78 90 L76 115 L44 115 Z" />
            <rect x="36" y="115" width="48" height="6" rx="1" fill="#78350F" />
            <rect x="30" y="121" width="60" height="5" rx="1" fill="#92400E" />
            <rect x="24" y="126" width="72" height="4" rx="1" fill="#B45309" />
            <rect x="18" y="130" width="84" height="4" rx="1" fill="#D97706" />
            <path d="M36 75 L46 75 L44 115 L38 115 Z" opacity="0.75" />
            <path d="M74 75 L84 75 L82 115 L76 115 Z" opacity="0.75" />
            <circle cx="41" cy="72" r="2.5" fill="#D97706" />
            <circle cx="79" cy="72" r="2.5" fill="#D97706" />
          </svg>
        </div>

        <div className="space-y-0.5">
          <p className="font-serif italic text-base tracking-wide text-amber-900 font-semibold leading-tight font-['Playfair_Display',serif]">
            Seva
          </p>
          <p className="font-serif italic text-base tracking-wide text-amber-900 font-semibold leading-tight font-['Playfair_Display',serif]">
            Suraksha
          </p>
          <p className="font-serif italic text-base tracking-wide text-amber-900 font-semibold leading-tight font-['Playfair_Display',serif]">
            Sangam
          </p>
          <div className="w-8 h-0.5 bg-amber-600 mx-auto mt-1 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
};
