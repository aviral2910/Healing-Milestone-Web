with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write("""'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export interface BackendProfile {
  id: string;
  email: string;
  role: string;
  username: string | null;
  displayName: string;
  isVerified: boolean;
  specialty?: string;
  licenseNumber?: string;
}

interface AuthContextType {
  user: User | null;
  profile: BackendProfile | null;
  needsOnboarding: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  needsOnboarding: false,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<BackendProfile | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch('https://healing-milestones-api.onrender.com/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        const requiresOnboarding = !data.username;
        setNeedsOnboarding(requiresOnboarding);
        
        // Auto-redirect to onboarding if trying to access secure routes
        if (requiresOnboarding && pathname && !pathname.startsWith('/onboarding') && (pathname.startsWith('/connect') || pathname.startsWith('/snapshot'))) {
          router.push('/onboarding');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
        setNeedsOnboarding(false);
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [pathname, router]);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await fetchProfile(auth.currentUser);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error logging in", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, needsOnboarding, loading, loginWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
""")
