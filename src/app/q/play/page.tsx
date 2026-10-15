"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QUEST_DATA, RoundColor } from '../data';
import { Scanner } from '@yudiel/react-qr-scanner';
import Link from 'next/link';

export default function PlayPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [playerName, setPlayerName] = useState<string>('');
  const [playerSide, setPlayerSide] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeRound, setActiveRound] = useState<RoundColor>('yellow');
  const [totalRiddles, setTotalRiddles] = useState<number>(8);
  const [riddleText, setRiddleText] = useState<string>('');
  const [targetStep, setTargetStep] = useState<number>(1);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  useEffect(() => {
    const playerId = localStorage.getItem('quest_player_id');
    const localName = localStorage.getItem('quest_player_name');
    const localSide = localStorage.getItem('quest_player_side');

    if (!playerId) {
      router.push('/q/start');
      return;
    }

    if (localName) setPlayerName(localName);
    if (localSide) setPlayerSide(localSide);

    // Listen to player document in real-time
    const playerUnsub = onSnapshot(doc(db, 'wedding_quest_players', playerId), async (pSnap) => {
      if (!pSnap.exists()) {
        router.push('/q/start');
        return;
      }

      const pData = pSnap.data();
      if (pData.name) setPlayerName(pData.name);
      if (pData.side || pData.relation) setPlayerSide(pData.side || pData.relation);

      // Fetch global settings
      try {
        const settingsSnap = await getDoc(doc(db, 'wedding_quest_settings', 'game_state'));
        const settingsData = settingsSnap.exists() ? settingsSnap.data() : null;
        const currentRound = (settingsData?.active_round || pData.active_round || 'yellow') as RoundColor;
        setActiveRound(currentRound);

        const maxSteps = settingsData?.round_steps?.[currentRound] || 8;
        setTotalRiddles(maxSteps);

        const pStep = (pData.active_round === currentRound) ? (pData.current_step || 0) : 0;
        setCurrentStep(pStep);

        // If completed all steps or has completed_at
        if (pStep >= maxSteps || pData.completed_at) {
          router.push('/q/win');
          return;
        }

        const nextTarget = pStep + 1;
        setTargetStep(nextTarget);

        // Fetch riddle text for nextTarget
        const riddleDoc = await getDoc(doc(db, 'wedding_quest_riddles', `${currentRound}_${nextTarget}`));
        if (riddleDoc.exists() && riddleDoc.data()?.riddleText) {
          setRiddleText(riddleDoc.data().riddleText);
        } else {
          // Fallback to local data
          const fallback = QUEST_DATA[currentRound]?.riddles[nextTarget - 1]?.riddleText;
          setRiddleText(fallback || "Find the hidden clue card!");
        }
      } catch (err) {
        console.error("Error loading play state:", err);
        setError("Error connecting to quest servers.");
      } finally {
        setLoading(false);
      }
    });

    return () => playerUnsub();
  }, [router]);

  const handleScan = (url: string) => {
    if (!url) return;
    try {
      setShowScanner(false);
      // Expected URL pattern: .../q/[color]/[step]?secret=[secret]
      const parsed = new URL(url);
      router.push(parsed.pathname + parsed.search);
    } catch {
      // In case raw path was returned
      if (url.includes('/q/')) {
        const idx = url.indexOf('/q/');
        router.push(url.substring(idx));
      } else {
        alert("Scanned QR code is not a valid Wedding Quest clue. Please try again!");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--primary)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✦</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Loading Active Quest Mission...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</h2>
        <button
          onClick={() => router.push('/q/start')}
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: '#000',
            fontWeight: 800,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Return to Start Page
        </button>
      </div>
    );
  }

  const roundColors: Record<string, string> = {
    yellow: '#eab308',
    green: '#22c55e',
    pink: '#ec4899',
    red: '#ef4444'
  };

  const roundNames: Record<string, string> = {
    yellow: '🟡 The Haldi Quest',
    green: '🟢 The Mehndi Quest',
    pink: '🌸 The Sangeet Quest',
    red: '❤️ The Wedding Quest'
  };

  const themeHex = roundColors[activeRound] || 'var(--primary)';
  const roundTitle = roundNames[activeRound] || `${activeRound.toUpperCase()} Round`;

  return (
    <div style={{ padding: '2rem clamp(1rem, 4vw, 1.5rem)', maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* In-App Camera Scanner Modal */}
      {showScanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.96)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              Scan Clue #{targetStep} QR Code
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Point your camera at the physical card
            </p>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: `2px solid ${themeHex}` }}>
              <Scanner onScan={(result) => handleScan(result[0]?.rawValue)} />
            </div>
            <button 
              onClick={() => setShowScanner(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.9rem',
                width: '100%',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Cancel Scanning
            </button>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '0.5rem 1.25rem',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          Contestant:
        </span>
        <strong style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 800 }}>
          {playerName}
        </strong>
        {playerSide && (
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: playerSide.toLowerCase().includes('bride') ? 'rgba(236, 72, 153, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            color: playerSide.toLowerCase().includes('bride') ? '#f472b6' : '#60a5fa',
            border: `1px solid ${playerSide.toLowerCase().includes('bride') ? '#f472b644' : '#60a5fa44'}`,
            fontWeight: 700
          }}>
            {playerSide.toLowerCase().includes('bride') ? '👰 ' : '🤵 '}
            {playerSide}
          </span>
        )}
      </div>

      {/* Active Round & Progress Status */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px',
          borderRadius: '20px',
          backgroundColor: `${themeHex}22`,
          border: `1px solid ${themeHex}66`,
          color: themeHex,
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.75rem'
        }}>
          {roundTitle}
        </div>

        <h1 style={{
          fontSize: 'clamp(1.4rem, 6vw, 2rem)',
          fontWeight: 800,
          margin: 0,
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {currentStep === 0 ? "Your Quest Begins! 🚀" : `Checkpoint #${currentStep} Solved! 🎯`}
        </h1>

        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Progress: <strong>{currentStep} of {totalRiddles}</strong> Clues Found
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--surface)',
          borderRadius: '4px',
          marginTop: '0.75rem',
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: `${Math.min(100, (currentStep / totalRiddles) * 100)}%`,
            height: '100%',
            backgroundColor: themeHex,
            boxShadow: `0 0 10px ${themeHex}`,
            transition: 'width 0.4s ease'
          }}></div>
        </div>
      </div>

      {/* The Active Riddle Box */}
      <div style={{
        padding: 'clamp(1.25rem, 4vw, 2rem)',
        borderRadius: '16px',
        border: `1.5px solid ${themeHex}66`,
        backgroundColor: `${themeHex}11`,
        marginBottom: '1.75rem',
        boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${themeHex}22`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: themeHex,
          marginBottom: '0.75rem'
        }}>
          ✦ Clue #{targetStep} of {totalRiddles} to find ✦
        </div>

        <h2 style={{
          fontSize: 'clamp(1.1rem, 4.5vw, 1.35rem)',
          fontStyle: 'italic',
          lineHeight: '1.6',
          color: '#ffffff',
          margin: '0 0 1rem 0',
          fontWeight: 600
        }}>
          "{riddleText}"
        </h2>

        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <span>🔒</span>
          <span>Figure out the secret spot or person, find <strong>Clue Card #{targetStep}</strong>, and scan its QR!</span>
        </div>
      </div>

      {/* Main Action: Scan In-App Camera */}
      <button 
        onClick={() => setShowScanner(true)}
        style={{
          width: '100%',
          padding: '1.1rem',
          backgroundColor: themeHex,
          color: '#000000',
          fontWeight: 800,
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
          boxShadow: `0 0 25px ${themeHex}55`,
          marginBottom: '1rem',
          transition: 'transform 0.15s ease'
        }}
      >
        📷 Scan Clue #{targetStep} In-App
      </button>

      {/* Helpful Hint on Native Camera */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
        💡 <em>Tip: You can also use your regular phone Camera app to scan the card directly anytime!</em>
      </p>

      {/* Secondary Quick Links */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link 
          href="/q/leaderboard"
          style={{
            flex: 1,
            minWidth: '140px',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--surface)',
            color: 'var(--primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textAlign: 'center'
          }}
        >
          🏆 Live Leaderboard
        </Link>

        <Link 
          href="/q/start"
          style={{
            flex: 1,
            minWidth: '140px',
            padding: '0.85rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          ⚙️ Player Info
        </Link>
      </div>

    </div>
  );
}
