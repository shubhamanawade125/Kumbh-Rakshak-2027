import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  FirebaseUser
} from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export type { UserRole };

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  isSigningIn: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name?: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile from Firestore
  const loadProfile = async (uid: string, currentUser?: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setProfile(userSnap.data() as UserProfile);
      } else if (currentUser) {
        // Create initial default profile
        const newProfile: UserProfile = {
          uid,
          displayName: currentUser.displayName || 'Command Officer',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
          role: 'COMMAND_ADMIN',
          badgeNumber: `KMB-2027-${uid.slice(0, 5).toUpperCase()}`,
          assignedSector: 'Ramkund Main Ghat - Sector 1',
          phone: '',
          department: 'Maharashtra Police & Nashik Disaster Management Cell',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err: any) {
      console.warn('Profile load notice:', err.message);
      // Fallback local profile
      if (currentUser) {
        setProfile({
          uid,
          displayName: currentUser.displayName || 'Command Officer',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
          role: 'COMMAND_ADMIN',
          badgeNumber: `KMB-2027-${uid.slice(0, 5).toUpperCase()}`,
          assignedSector: 'Ramkund Main Ghat - Sector 1',
          phone: '',
          department: 'Maharashtra Police & Nashik Disaster Management Cell',
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser.uid, currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      await loadProfile(res.user.uid, res.user);
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updatedProfile: UserProfile = {
        ...(profile || {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          role: 'COMMAND_ADMIN',
          badgeNumber: '',
          assignedSector: '',
          phone: '',
          department: '',
        }),
        ...data,
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setProfile(updatedProfile);
    } catch (err: any) {
      console.error('Update profile error:', err);
      // Still update state locally
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const login = async (email: string, _pass: string) => {
    const mockUser: any = {
      uid: 'user-' + email.split('@')[0],
      email: email,
      displayName: email.split('@')[0].toUpperCase() + ' Officer',
    };
    setUser(mockUser);
    setProfile({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: 'POLICE_COMMANDER',
      badgeNumber: 'KMB-2027-CMD',
      assignedSector: 'Ramkund Main Ghat',
      phone: '+91 98220 54321',
      department: 'Nashik Kumbh Mela Police Command',
    });
  };

  const signup = async (email: string, _pass: string, name?: string, newRole?: UserRole) => {
    const mockUser: any = {
      uid: 'user-' + email.split('@')[0],
      email: email,
      displayName: name || email.split('@')[0].toUpperCase(),
    };
    setUser(mockUser);
    setProfile({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: newRole || 'COMMAND_ADMIN',
      badgeNumber: 'KMB-2027-' + Math.floor(1000 + Math.random() * 9000),
      assignedSector: 'Ramkund Main Ghat',
      phone: '+91 98220 54321',
      department: 'Nashik Disaster Response Cell',
    });
  };

  const logout = async () => {
    await signOutUser();
  };

  const clearError = () => setError(null);

  const effectiveRole: UserRole = profile?.role || 'COMMAND_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: effectiveRole,
        loading,
        isSigningIn,
        error,
        signInWithGoogle,
        signOutUser,
        login,
        signup,
        logout,
        updateProfileData,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
