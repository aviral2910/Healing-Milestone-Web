"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QUEST_DATA, RoundColor } from '../data';

export default function StartPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [side, setSide] = useState<"Bride's Side" | "Groom's Side" | ''>('');
  const [loading, setLoading] = useState(false);
  const [isAppBrowser, setIsAppBrowser] = useState(false);
  const [existingPlayer, setExistingPlayer] = useState<{ id: string; name: string; side?: string; currentStep?: number; activeRound?: string } | null>(null);

  useEffect(() => {
    // Basic check for in-app browsers like IG/FB which break localStorage
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if ((ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Instagram") > -1)) {
      setIsAppBrowser(true);
    }

    // Check if player already registered on this device
    const checkExisting = async () => {
      const pid = localStorage.getItem('quest_player_id');
      const pname = localStorage.getItem('quest_player_name');
      if (pid && pname) {
        try {
          const pDoc = await getDoc(doc(db, 'wedding_quest_players', pid));
          if (pDoc.exists()) {
            const data = pDoc.data();
            setExistingPlayer({
              id: pid,
              name: data.name || pname,
              side: data.side || data.relation || '',
              currentStep: data.current_step || 0,
              activeRound: data.active_round || ''
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkExisting();
  }, []);

  const startGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!side) {
      alert("Please choose whether you are on the Bride Side or Groom Side!");
      return;
    }

    setLoading(true);
    try {
      const playerId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      
      // Save to Firebase (setting relation to side for full backwards compatibility)
      // Fetch active round from game_state settings
      const settingsSnap = await getDoc(doc(db, 'wedding_quest_settings', 'game_state'));
      const activeRound = (settingsSnap.exists() && settingsSnap.data().active_round) 
        ? settingsSnap.data().active_round 
        : 'yellow';

      await setDoc(doc(db, 'wedding_quest_players', playerId), {
        name: name.trim(),
        phone: phone ? phone.trim() : '',
        relation: side,
        side,
        started_at: new Date(),
        current_step: 0,
        active_round: activeRound
      });

      // Save session to device
      localStorage.setItem('quest_player_id', playerId);
      localStorage.setItem('quest_player_name', name.trim());
      localStorage.setItem('quest_player_side', side);

      // Navigate directly to active quest hub showing Riddle #1!
      router.push('/q/play');
    } catch (error) {
      console.error(error);
      alert("Error starting game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--background)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    marginBottom: '1rem'
  };

  return (
    <div style={{ padding: '2rem clamp(1rem, 4vw, 1.5rem)' }}>
      {isAppBrowser && (
        <div style={{ padding: '1rem', backgroundColor: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', overflowWrap: 'break-word' }}>
          <strong>⚠️ Warning:</strong> It looks like you opened this from Instagram or Facebook. Please open this page in your normal browser (Safari/Chrome) or your game progress will be lost!
        </div>
      )}

      {/* BRAND & COUPLE GREETING HERO */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        
        {/* Brand Lockup: Line 1 = Appbar Logo & Typography, Line 2 = White Presents */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', maxWidth: '100%' }}>
          
          {/* Logo placed ABOVE the brand name */}
          <img 
            src="/logo.png" 
            alt="Healing Milestones" 
            style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '8px' }} 
          />

          <div style={{ 
            fontFamily: "'Oswald', sans-serif", 
            fontWeight: 500, 
            fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', 
            color: '#ffffff', 
            letterSpacing: '1px',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            overflowWrap: 'break-word'
          }}>
            HEALING MILESTONES
          </div>

          {/* PRESENTS in golden yellow */}
          <div style={{ 
            color: 'var(--primary)', 
            fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', 
            letterSpacing: 'clamp(3px, 1.2vw, 5px)', 
            textTransform: 'uppercase', 
            fontWeight: 600,
            marginTop: '8px',
            fontFamily: "'Oswald', sans-serif",
            textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
          }}>
            PRESENTS
          </div>
        </div>

        <div style={{
          padding: '1.3rem clamp(0.75rem, 3vw, 1rem)',
          backgroundColor: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: '0 0 25px var(--glow)',
          marginBottom: '1rem',
          overflowWrap: 'break-word'
        }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
            Celebrating The Wedding Of
          </div>
          <h1 style={{ 
            fontSize: 'clamp(1.35rem, 5.5vw, 1.95rem)', 
            fontWeight: 900, 
            color: 'var(--primary)', 
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textShadow: '0 0 15px var(--glow)',
            lineHeight: 1.25,
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            ✨ Ankita & Harshit ✨
          </h1>
          <div style={{ 
            fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            The Wedding Scavenger Hunt
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: '1.4', overflowWrap: 'break-word' }}>
          "Celebrating love, milestones, and new beginnings. Enter your details below to race for the clues!"
        </p>
      </div>

      {existingPlayer && (
        <div style={{
          padding: '1.25rem',
          backgroundColor: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid var(--primary)',
          borderRadius: '14px',
          marginBottom: '2rem',
          textAlign: 'center',
          boxShadow: '0 0 20px var(--glow)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
            Active Session Found
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 2px 0' }}>
            {existingPlayer.name}
          </div>
          {existingPlayer.side && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              {existingPlayer.side.toLowerCase().includes('bride') ? '👰 ' : '🤵 '}
              {existingPlayer.side}
            </div>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={() => router.push('/q/play')}
            style={{
              width: '100%',
              padding: '0.9rem',
              backgroundColor: 'var(--primary)',
              color: '#000',
              fontWeight: 800,
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            ➡️ Resume My Active Quest (Clue #{((existingPlayer.currentStep || 0) + 1)})
          </button>
        </div>
      )}

      <form onSubmit={startGame}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Your Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="e.g. Rahul"
            required 
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number (Optional)</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="e.g. 9876543210"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 600 }}>
            Choose Your Side *
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => setSide("Bride's Side")}
              style={{
                padding: '1rem 0.5rem',
                borderRadius: '10px',
                border: side === "Bride's Side" ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: side === "Bride's Side" ? 'rgba(212, 175, 55, 0.15)' : 'var(--background)',
                color: side === "Bride's Side" ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: side === "Bride's Side" ? '0 0 15px var(--glow)' : 'none',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>👰</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Bride Side
              </span>
              <span style={{ fontSize: '0.7rem', color: side === "Bride's Side" ? 'var(--text-primary)' : 'var(--text-secondary)', opacity: 0.85 }}>
                Team Ankita
              </span>
              {side === "Bride's Side" && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✓
                </div>
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setSide("Groom's Side")}
              style={{
                padding: '1rem 0.5rem',
                borderRadius: '10px',
                border: side === "Groom's Side" ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: side === "Groom's Side" ? 'rgba(212, 175, 55, 0.15)' : 'var(--background)',
                color: side === "Groom's Side" ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: side === "Groom's Side" ? '0 0 15px var(--glow)' : 'none',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>🤵</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Groom Side
              </span>
              <span style={{ fontSize: '0.7rem', color: side === "Groom's Side" ? 'var(--text-primary)' : 'var(--text-secondary)', opacity: 0.85 }}>
                Team Harshit
              </span>
              {side === "Groom's Side" && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✓
                </div>
              )}
            </button>
          </div>
          
          {!side && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
              * Select Bride Side or Groom Side to join the quest
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--primary)',
            color: '#000',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {loading ? 'Joining...' : 'Join the Game'}
        </button>
      </form>
    </div>
  );
}
