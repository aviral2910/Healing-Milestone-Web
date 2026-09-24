'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, User as UserIcon, Building2, Stethoscope, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const { user, profile, needsOnboarding, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  
  // Form State
  const [role, setRole] = useState<'member' | 'healthcareProfessional' | 'organization'>('member');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [applyVerification, setApplyVerification] = useState(false);

  // Validation State
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [usernameError, setUsernameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize display name from Google
  useEffect(() => {
    if (user?.displayName && !displayName) {
      setDisplayName(user.displayName);
    }
  }, [user, displayName]);

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !needsOnboarding) {
      router.push('/connect');
    }
  }, [loading, user, needsOnboarding, router]);

  // Username validation debounce
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      setUsernameError(username.length > 0 ? 'Minimum 3 characters' : '');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus('error');
      setUsernameError('Only letters, numbers, and underscores');
      return;
    }

    const checkAvailability = async () => {
      setUsernameStatus('checking');
      try {
        const res = await fetch(`https://healing-milestones-api.onrender.com/api/users/check-username?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.is_available) {
            setUsernameStatus('available');
            setUsernameError('');
          } else {
            setUsernameStatus('taken');
            setUsernameError('Username is already taken');
          }
        } else {
          setUsernameStatus('error');
          setUsernameError('Error checking availability');
        }
      } catch (e) {
        setUsernameStatus('error');
        setUsernameError('Network error');
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available' || !displayName.trim()) return;
    
    if (role !== 'member' && !specialty.trim()) return;

    setIsSubmitting(true);
    try {
      const token = await user?.getIdToken();
      const payload = {
        username,
        displayName,
        role,
        ...(role !== 'member' && {
          specialty,
          licenseNumber,
          applied_for_verification: applyVerification
        })
      };

      const res = await fetch('https://healing-milestones-api.onrender.com/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await refreshProfile();
        router.push('/connect');
      } else {
        const err = await res.json();
        alert(`Error: ${err.detail || 'Failed to update profile'}`);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving profile');
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !needsOnboarding) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-gold" size={48} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" style={{ width: '64px', height: '64px', marginBottom: '1rem', margin: '0 auto' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Complete Your Profile</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Set up your HM Connect account</p>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {step === 1 ? (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>How will you use HM Connect?</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <RoleCard 
                  title="Member" 
                  description="I want to save my own snapshots and follow my healing journey."
                  icon={<UserIcon />}
                  selected={role === 'member'}
                  onClick={() => setRole('member')}
                />
                <RoleCard 
                  title="Healthcare Professional" 
                  description="I am a doctor, therapist, or medical expert."
                  icon={<Stethoscope />}
                  selected={role === 'healthcareProfessional'}
                  onClick={() => setRole('healthcareProfessional')}
                />
                <RoleCard 
                  title="Organization" 
                  description="We are a clinic, hospital, or NGO."
                  icon={<Building2 />}
                  selected={role === 'organization'}
                  onClick={() => setRole('organization')}
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                className="share-journey-cta" 
                style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'center', padding: '1rem' }}
              >
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Unique Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase())}
                    placeholder="e.g. dr_smith"
                    style={{ 
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                      backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${usernameStatus === 'error' || usernameStatus === 'taken' ? '#ef4444' : usernameStatus === 'available' ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                      color: 'var(--text-primary)', fontSize: '1rem'
                    }}
                    required
                  />
                  <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                    {usernameStatus === 'checking' && <Loader2 size={20} className="animate-spin text-gold" />}
                    {usernameStatus === 'available' && <CheckCircle size={20} color="#22c55e" />}
                    {(usernameStatus === 'taken' || usernameStatus === 'error') && <AlertCircle size={20} color="#ef4444" />}
                  </div>
                </div>
                {usernameError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{usernameError}</p>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Display Name
                </label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={role === 'organization' ? "Clinic Name" : "Dr. John Doe"}
                  style={{ 
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                    backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-primary)', fontSize: '1rem'
                  }}
                  required
                />
              </div>

              {role !== 'member' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Specialty / Focus Area
                    </label>
                    <input 
                      type="text" 
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      placeholder="e.g. Cardiology, Physical Therapy"
                      style={{ 
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                        backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-primary)', fontSize: '1rem'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Medical License / Registration Number <span style={{ opacity: 0.5 }}>(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      placeholder=""
                      style={{ 
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                        backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-primary)', fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: 'rgba(250, 204, 21, 0.05)', borderRadius: '8px', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Apply for Verified Badge</h4>
                        <p style={{ margin: 0, marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Establish trust with patients.</p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input 
                          type="checkbox" 
                          checked={applyVerification} 
                          onChange={(e) => setApplyVerification(e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{ 
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                          backgroundColor: applyVerification ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                          borderRadius: '24px', transition: '.4s' 
                        }}>
                          <span style={{ 
                            position: 'absolute', content: '""', height: '18px', width: '18px', 
                            left: applyVerification ? '26px' : '4px', bottom: '3px', 
                            backgroundColor: applyVerification ? '#000' : 'white', 
                            borderRadius: '50%', transition: '.4s' 
                          }}/>
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="download-btn" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem' }}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || usernameStatus !== 'available' || !displayName.trim() || (role !== 'member' && !specialty.trim())}
                  className="share-journey-cta" 
                  style={{ flex: 2, display: 'flex', justifyContent: 'center', padding: '1rem', opacity: (isSubmitting || usernameStatus !== 'available') ? 0.5 : 1 }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ title, description, icon, selected, onClick }: { title: string, description: string, icon: React.ReactNode, selected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', gap: '16px', padding: '16px', cursor: 'pointer',
        border: `2px solid ${selected ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`, 
        borderRadius: '12px', backgroundColor: selected ? 'rgba(250, 204, 21, 0.05)' : 'transparent',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div style={{ color: selected ? 'var(--primary)' : 'var(--text-secondary)' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ margin: 0, marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{description}</p>
      </div>
    </div>
  );
}
