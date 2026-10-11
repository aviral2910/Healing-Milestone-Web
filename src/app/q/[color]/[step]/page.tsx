"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Scanner } from '@yudiel/react-qr-scanner';
import confetti from 'canvas-confetti';

export default function StepPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const color = params.color as string;
  const step = parseInt(params.step as string, 10);
  const secret = searchParams.get('secret');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riddleText, setRiddleText] = useState<string | null>(null);
  const [totalRiddles, setTotalRiddles] = useState<number>(8); // Default to 8
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (text: string) => {
    if (text) {
      setShowScanner(false);
      try {
        const url = new URL(text);
        if (url.pathname.startsWith('/q/')) {
          router.push(url.pathname + url.search);
        } else {
          alert('Invalid QR code scanned. Make sure it is a Wedding Quest code!');
        }
      } catch (e) {
        alert('Invalid QR code scanned.');
      }
    }
  };

  useEffect(() => {
    const validateScan = async () => {
      try {
        const playerId = localStorage.getItem('quest_player_id');
        if (!playerId) {
          router.push('/q/start');
          return;
        }

        const riddleDoc = await getDoc(doc(db, 'wedding_quest_riddles', `${color}_${step}`));
        if (!riddleDoc.exists()) {
          setError("Riddle not found in database.");
          setLoading(false);
          return;
        }

        const riddleData = riddleDoc.data();
        if (riddleData.secret !== secret) {
          setError("Invalid QR Code Secret. Nice try!");
          setLoading(false);
          return;
        }

        const settingsDoc = await getDoc(doc(db, 'wedding_quest_settings', 'game_state'));
        const settingsData = settingsDoc.exists() ? settingsDoc.data() : null;
        const activeRound = settingsData ? settingsData.active_round : null;
        
        const maxSteps = settingsData?.round_steps?.[color] || settingsData?.max_steps || riddleData.totalSteps || 8;
        setTotalRiddles(maxSteps);

        if (activeRound !== color) {
          setError(`This is a clue for the ${color} round, but the active round is currently ${activeRound || 'not started'}.`);
          setLoading(false);
          return;
        }

        if (step > maxSteps) {
          setError(`This round only has ${maxSteps} clues! You've already reached the end of this round.`);
          setLoading(false);
          return;
        }

        const playerRef = doc(db, 'wedding_quest_players', playerId);
        const playerDoc = await getDoc(playerRef);
        
        if (!playerDoc.exists()) {
          router.push('/q/start');
          return;
        }

        const playerData = playerDoc.data();
        let currentStep = playerData.current_step || 0;
        let playerActiveRound = playerData.active_round;

        if (playerActiveRound !== color) {
           currentStep = 0;
        }

        if (currentStep === step - 1) {
          const updatePayload: any = {
            current_step: step,
            active_round: color,
            last_scanned_at: new Date()
          };
          if (step >= maxSteps && !playerData.completed_at) {
            updatePayload.completed_at = new Date();
          }
          await updateDoc(playerRef, updatePayload);
          setRiddleText(riddleData.riddleText);

          // Small celebratory confetti burst for solving the previous clue and finding this one!
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 }
          });
        } else if (currentStep >= step) {
          setRiddleText(riddleData.riddleText);
        } else {
          setError(`You skipped a clue! You are supposed to be looking for clue #${currentStep + 1}, but you found #${step}. Go back!`);
        }

      } catch (err) {
        console.error(err);
        setError("An error occurred connecting to the database.");
      } finally {
        setLoading(false);
      }
    };

    validateScan();
  }, [color, step, secret, router]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--primary)' }}>Decrypting clue...</div>;

  if (error) {
    return (
      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        {showScanner && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Scan another QR Code</h3>
              <Scanner onScan={(result) => handleScan(result[0].rawValue)} />
              <button 
                onClick={() => setShowScanner(false)}
                style={{ marginTop: '2rem', padding: '1rem', width: '100%', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
              >
                Cancel Scanning
              </button>
            </div>
          </div>
        )}

        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.5rem' }}>Oops!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.95rem' }}>{error}</p>

        <button 
          onClick={() => setShowScanner(true)}
          style={{
            width: '100%',
            padding: '1.1rem',
            backgroundColor: 'var(--primary)',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 20px var(--glow)',
            marginBottom: '1rem'
          }}
        >
          📷 Scan Another QR Code
        </button>

        <button 
          onClick={() => router.push('/q/start')}
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Restart Game / Home
        </button>
      </div>
    );
  }

  const themeColors: Record<string, string> = {
    yellow: '#eab308',
    green: '#22c55e',
    pink: '#ec4899',
    red: '#ef4444',
  };
  const themeHex = themeColors[color] || 'var(--primary)';

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      
      {showScanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Scan the next Clue</h3>
            <Scanner onScan={(result) => handleScan(result[0].rawValue)} />
            <button 
              onClick={() => setShowScanner(false)}
              style={{ marginTop: '2rem', padding: '1rem', width: '100%', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
            >
              Cancel Scanning
            </button>
          </div>
        </div>
      )}

      <div style={{ fontSize: '3rem', marginBottom: '1rem', color: themeHex }}>✓</div>
      
      <div style={{ 
        marginBottom: '0.5rem', 
        textTransform: 'uppercase', 
        letterSpacing: '2px', 
        fontSize: '0.75rem', 
        fontWeight: 700, 
        color: 'var(--text-secondary)' 
      }}>
        Clue {step} of {totalRiddles}
      </div>
      
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 800, 
        marginBottom: '2rem', 
        textTransform: 'uppercase', 
        color: themeHex,
        textShadow: `0 0 10px ${themeHex}44`
      }}>
        The {color} Round
      </h1>

      <div style={{ 
        padding: '2rem', 
        borderRadius: '12px', 
        border: `1px solid ${themeHex}55`, 
        backgroundColor: `${themeHex}11`,
        marginBottom: '2rem',
        boxShadow: `0 0 20px ${themeHex}22`
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontStyle: 'italic', 
          lineHeight: '1.6', 
          color: 'var(--text-primary)' 
        }}>
          "{riddleText}"
        </h2>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        🔒 Go find the next location and scan its code!
      </p>

      {step < totalRiddles && (
        <button 
          onClick={() => setShowScanner(true)}
          style={{
            marginTop: '2rem',
            width: '100%',
            backgroundColor: 'transparent',
            color: themeHex,
            border: `2px solid ${themeHex}`,
            fontWeight: 700,
            padding: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          📷 Scan In-App
        </button>
      )}

      {step >= totalRiddles && (
        <button 
          onClick={() => router.push('/q/win')}
          style={{
            marginTop: '2rem',
            width: '100%',
            backgroundColor: themeHex,
            color: '#fff',
            fontWeight: 700,
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          I found the final clue! Finish Game
        </button>
      )}
    </div>
  );
}
