import React, { useState, useRef } from 'react';
import { 
  X, 
  UserPlus, 
  Upload, 
  Camera, 
  Check, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { MissingPersonAlert } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (person: Omit<MissingPersonAlert, 'id' | 'caseNumber' | 'reportedAt'>) => void;
}

export const RegisterMissingModal: React.FC<Props> = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(58);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('FEMALE');
  const [clothing, setClothing] = useState('Bright yellow Nauvari cotton saree with red border, carrying steel kalash');
  const [lastLocation, setLastLocation] = useState('Ramkund Main Steps near Gandhi Memorial');
  const [guardianName, setGuardianName] = useState('Ganesh Patil');
  const [guardianPhone, setGuardianPhone] = useState('+91 98220 12345');
  const [photoPreview, setPhotoPreview] = useState<string | null>('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80');
  
  const [isAiScanningPhoto, setIsAiScanningPhoto] = useState(false);
  const [aiDetectionTags, setAiDetectionTags] = useState<string[]>(['Yellow Garment', 'Female Senior', 'Nauvari Saree Pattern']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setIsAiScanningPhoto(true);
        setTimeout(() => {
          setIsAiScanningPhoto(false);
          setAiDetectionTags(['Senior Devotee', 'Indian Traditional Wear', 'High-Contrast Border', 'Recognizable Facial Profile']);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clothing || !guardianPhone) {
      alert('Please fill in required missing person fields');
      return;
    }

    onRegister({
      name,
      age: Number(age) || 45,
      gender,
      clothingDescription: clothing,
      lastSeenLocation: lastLocation,
      lastSeenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guardianName,
      guardianPhone,
      photoUrl: photoPreview || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      status: 'BROADCAST',
      broadcastTowerCount: 14,
      aiAttireTags: aiDetectionTags,
      isBroadcastingAllScreens: true,
      lastSeenCoordinates: [19.9996, 73.7915],
      assignedCheckpoint: 'Ramkund Lost Pilgrim Post #2'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border border-yellow-500/60 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-950 border border-yellow-500/40 text-yellow-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Register Missing Pilgrim / Child (Amber Alert)
              </h3>
              <p className="text-xs text-slate-400">
                Immediately syncs with all 14 Information Towers, Police Megaphones & volunteer mobile feeds
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
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-36 h-44 rounded-2xl border-2 border-dashed border-yellow-500/60 bg-slate-950 overflow-hidden relative cursor-pointer group flex items-center justify-center shadow-lg"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-slate-400 group-hover:text-yellow-400">
                    <Camera className="w-8 h-8 mx-auto mb-1 opacity-70" />
                    <span className="text-[10px] block font-semibold">Upload Photo</span>
                  </div>
                )}

                {isAiScanningPhoto && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-yellow-400 gap-1 font-mono text-[10px]">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>AI Scanning...</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                  Change Photo
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-yellow-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Upload className="w-3 h-3" /> Select Pilgrim Image
              </button>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Pilgrim Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parvati Bai Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category / Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 font-medium"
                  >
                    <option value="FEMALE">Female Elder</option>
                    <option value="MALE">Male Elder</option>
                    <option value="CHILD_GIRL">Child (Girl &lt; 12)</option>
                    <option value="CHILD_BOY">Child (Boy &lt; 12)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Distinctive Clothing Description & Visual Markers *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Bright yellow saree with red border, silver nose ring, white umbrella, brass puja thali..."
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Last Seen Ghat / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Laxman Ghat step 14 near bridge"
                value={lastLocation}
                onChange={(e) => setLastLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Guardian / Family Contact Mobile *</label>
              <input
                type="text"
                required
                placeholder="+91 98220 12345"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 font-medium font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-yellow-950/40 border border-yellow-500/40 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-yellow-300 block">
                Instant Automated Public Broadcast Action:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Registering this case will automatically flash the victim's photo, age and clothing description in Marathi and Hindi onto all 14 Ghat Information LED Screens and dispatch priority push alerts to 120+ active field volunteers.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black transition flex items-center gap-2 shadow-lg shadow-yellow-950/60"
            >
              <Check className="w-4 h-4" />
              <span>Broadcast Emergency Amber Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
