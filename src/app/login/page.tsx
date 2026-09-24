'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading, needsOnboarding, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (needsOnboarding) {
        router.push('/onboarding');
      } else {
        router.push('/connect');
      }
    }
  }, [user, loading, needsOnboarding, router]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google.');
      setIsLoggingIn(false);
    }
  };

  if (loading || user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--background)' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--surface)', padding: '40px 32px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 8px 32px var(--glow)' }}>
        <img src="/icon.png" alt="Healing Milestones" style={{ width: '72px', height: '72px', borderRadius: '16px', marginBottom: '24px' }} />
        
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '12px', fontFamily: "'Oswald', sans-serif" }}>
          Healing Milestones Connect
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: '1.5' }}>
          Securely manage your patient roster and track healing milestones in one place.
        </p>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'white',
            color: '#000',
            border: 'none',
            padding: '14px 20px',
            borderRadius: '12px',
            fontSize: '1.05rem',
            fontWeight: '600',
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            opacity: isLoggingIn ? 0.7 : 1,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
          {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div style={{ marginTop: '32px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          By signing in, you agree to our <br/>
          <Link href="/terms" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms of Service</Link> and{' '}
          <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
