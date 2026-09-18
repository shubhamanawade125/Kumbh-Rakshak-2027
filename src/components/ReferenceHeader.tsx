import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Cloud, 
  ChevronDown,
  CheckCircle2,
  Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReferenceHeaderProps {
  onSearch?: (query: string) => void;
  onOpenProfileModal?: () => void;
  onOpenLiveStreetMonitor?: () => void;
}

interface LiveWeatherState {
  temperature: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  isRain: boolean;
  isSunny: boolean;
  isThunderstorm: boolean;
  lastUpdated: string;
  loading: boolean;
}

export const ReferenceHeader: React.FC<ReferenceHeaderProps> = ({
  onSearch,
  onOpenProfileModal,
  onOpenLiveStreetMonitor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  const [weather, setWeather] = useState<LiveWeatherState>({
    temperature: 27,
    condition: 'Sunny',
    weatherCode: 0,
    humidity: 72,
    windSpeed: 11,
    precipitation: 0,
    isRain: false,
    isSunny: true,
    isThunderstorm: false,
    lastUpdated: 'Live',
    loading: false,
  });

  const fetchLiveNashikWeather = async () => {
    try {
      setWeather(prev => ({ ...prev, loading: true }));
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=19.9996&longitude=73.7915&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=Asia%2FKolkata'
      );
      if (res.ok) {
        const data = await res.json();
        const current = data.current;
        const code = current.weather_code ?? 0;
        const temp = Math.round((current.temperature_2m ?? 27) * 10) / 10;
        const humidity = current.relative_humidity_2m ?? 70;
        const wind = current.wind_speed_10m ?? 10;
        const precip = current.precipitation ?? 0;

        let conditionText = 'Sunny / Clear';
        let isRain = false;
        let isSunny = false;
        let isThunderstorm = false;

        if (code === 0) {
          conditionText = 'Sunny / Clear';
          isSunny = true;
        } else if (code === 1 || code === 2) {
          conditionText = 'Partly Sunny';
          isSunny = true;
        } else if (code === 3) {
          conditionText = 'Overcast';
        } else if (code === 45 || code === 48) {
          conditionText = 'Foggy / Mist';
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
          conditionText = precip > 1 ? 'Rainy' : 'Light Rain';
          isRain = true;
        } else if ([95, 96, 99].includes(code)) {
          conditionText = 'Thunderstorm';
          isThunderstorm = true;
          isRain = true;
        } else {
          conditionText = precip > 0 ? 'Rainy' : 'Clear Sky';
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });

        setWeather({
          temperature: temp,
          condition: conditionText,
          weatherCode: code,
          humidity,
          windSpeed: wind,
          precipitation: precip,
          isRain,
          isSunny,
          isThunderstorm,
          lastUpdated: timeStr,
          loading: false,
        });
      }
    } catch (e) {
      console.warn('Live weather note, using fallback:', e);
      setWeather(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchLiveNashikWeather();
    const interval = setInterval(fetchLiveNashikWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="h-[68px] bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      {/* 1. Brand Left */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
            <path d="M12 2L14 7H10L12 2Z" />
            <path d="M12 8C8.5 8 7 11 7 13C7 16.5 9 19 12 19C15 19 17 16.5 17 13C17 11 15.5 8 12 8Z" />
            <circle cx="12" cy="13" r="2.5" fill="#FEF3C7" />
            <path d="M11 19H13V22H11V19Z" />
            <path d="M5 10C5 12 6.5 13.5 8 13.5V12C7.2 12 6.5 11.2 6.5 10H5Z" />
            <path d="M19 10C19 12 17.5 13.5 16 13.5V12C16.8 12 17.5 11.2 17.5 10H19Z" />
          </svg>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Kumbh-Rakshak
            </h1>
            <span className="text-lg font-bold text-amber-500">2027</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-wide">
            Safer People <span className="text-slate-300">•</span> Stronger Faith <span className="text-slate-300">•</span> Brighter Tomorrow
          </p>
        </div>
      </div>

      {/* 2. Global Search Bar */}
      <div className="flex-1 max-w-xl mx-2 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search location, incident, person, or resource..."
            className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner/5"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* 3. Right Status Controls */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          id="header-live-street-cctv-btn"
          onClick={onOpenLiveStreetMonitor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs shadow-blue-500/20 transition group"
        >
          <Video className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Live Street CCTV</span>
          <span className="sm:hidden">CCTV</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Mesh Active</span>
        </div>

        <div className="hidden lg:flex flex-col text-right">
          <span className="text-[10px] font-medium text-slate-400">
            {currentDate || 'Nashik, Maharashtra'}
          </span>
          <span className="text-xs font-bold text-slate-800 tracking-tight font-mono">
            {currentTime || '11:25 AM'}
          </span>
        </div>

        <div
          title={`Nashik Ground Telemetry: ${weather.condition}, ${weather.temperature}°C, ${weather.humidity}% humidity, wind ${weather.windSpeed} km/h (Click to refresh)`}
          onClick={fetchLiveNashikWeather}
          className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-slate-200/80 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition"
        >
          {weather.isThunderstorm ? (
            <CloudLightning className="w-5 h-5 text-amber-600 animate-bounce" />
          ) : weather.isRain ? (
            <CloudRain className="w-5 h-5 text-blue-500 animate-pulse" />
          ) : weather.isSunny ? (
            <Sun className="w-5 h-5 text-amber-500 fill-amber-400/20" />
          ) : weather.weatherCode === 1 || weather.weatherCode === 2 ? (
            <CloudSun className="w-5 h-5 text-amber-400" />
          ) : (
            <Cloud className="w-5 h-5 text-slate-400" />
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-800 leading-none font-mono">
                {weather.temperature}°C
              </span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase">
                {weather.isRain ? '🌧️ RAIN' : weather.isThunderstorm ? '⛈️ STORM' : '☀️ ' + weather.condition}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 leading-tight">
              Nashik, MH • {weather.humidity}% hum
            </span>
          </div>
        </div>

        <div
          id="header-user-profile-trigger"
          onClick={onOpenProfileModal}
          className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-xl transition group"
        >
          {user ? (
            <>
              <div className="relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Officer'}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-sm shadow-blue-500/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-600/20">
                    {(user.displayName || 'O')[0].toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 leading-tight max-w-[140px] truncate">
                    {profile?.displayName || user.displayName || 'Officer'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
                </div>
                <span className="text-[10px] text-blue-600 font-semibold leading-tight flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {profile?.role === 'COMMAND_ADMIN'
                    ? 'Command Admin'
                    : profile?.role === 'POLICE_OFFICER'
                    ? 'Police Sector Chief'
                    : profile?.role === 'MEDICAL_COORDINATOR'
                    ? '108 Medical Lead'
                    : 'Field Officer'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">Sign In / Profile</span>
                <span className="text-[9px] text-blue-500 font-medium leading-tight">Google Identity</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
