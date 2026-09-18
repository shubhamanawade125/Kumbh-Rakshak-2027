import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { login, signup, user, role, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('POLICE_COMMANDER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, name, selectedRole);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const demoEmail = `${demoRole.toLowerCase().replace(/_/g, '')}@kumbhrakshak.gov.in`;
      const demoPass = 'Kumbh2027@Command';
      await signup(demoEmail, demoPass, `${demoRole.replace(/_/g, ' ')} Officer`, demoRole);
      onClose();
    } catch {
      try {
        const demoEmail = `${demoRole.toLowerCase().replace(/_/g, '')}@kumbhrakshak.gov.in`;
        const demoPass = 'Kumbh2027@Command';
        await login(demoEmail, demoPass);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Demo session login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {user ? 'Authenticated Profile' : isSignUp ? 'Create Command Account' : 'Authorized Personnel Login'}
              </h3>
              <p className="text-xs text-slate-400">
                Nashik Kumbh Mela 2027 Disaster Security Network
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

        {user ? (
          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Active User:</span>
                <span className="text-white font-bold text-sm">{user.displayName || user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Operational Role:</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono font-bold text-[10px]">
                  {role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Security Clearance:</span>
                <span className="text-emerald-400 font-bold">LEVEL 4 DISASTER INCIDENT ACCESS</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold transition"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Role Switching (Simulated Clearance):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('POLICE_COMMANDER')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition text-[11px]"
                >
                  <strong className="block text-white">Police Commander</strong>
                  <span className="text-slate-400 text-[10px]">Ghat Barricades & Diversions</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('DOCTOR_ON_DUTY')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition text-[11px]"
                >
                  <strong className="block text-white">Doctor On Duty</strong>
                  <span className="text-slate-400 text-[10px]">Civil Hospital Triage Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('VOLUNTEER_LEAD')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition text-[11px]"
                >
                  <strong className="block text-white">Volunteer Lead</strong>
                  <span className="text-slate-400 text-[10px]">AED Runner Foot Fleet</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition text-[11px]"
                >
                  <strong className="block text-white">Super Admin</strong>
                  <span className="text-slate-400 text-[10px]">Full Access & Simulation</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-800"></div>
              <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase absolute">
                Or Sign In with Email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Official Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inspector Suresh Kulkarni"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">Government Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="officer@kumbhrakshak.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Command Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="POLICE_COMMANDER">Police Commander</option>
                    <option value="DOCTOR_ON_DUTY">Doctor On Duty</option>
                    <option value="VOLUNTEER_LEAD">Volunteer Lead</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Verifying Credentials...' : isSignUp ? 'Register Officer' : 'Secure Sign In'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                {isSignUp ? 'Already registered? Sign In' : "Don't have an account? Register Officer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
