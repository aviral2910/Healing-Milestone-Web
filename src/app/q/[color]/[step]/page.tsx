"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QUEST_DATA, RoundColor } from '../../data';
import confetti from 'canvas-confetti';
import { Scanner } from '@yudiel/react-qr-scanner';
import Link from 'next/link';

export default function CluePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const color = (params.color as string) as RoundColor;
  const step = parseInt(params.step as string, 10);
  const secret = searchParams.get('secret');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Game state
  const [playerName, setPlayerName] = useState<string>('');
  const [playerSide, setPlayerSide] = useState<string>('');
  const [totalRiddles, setTotalRiddles] = useState<number>(8);
  const [showScanner, setShowScanner] = useState(false);

  // Step advancement state
  const [unlockedStep, setUnlockedStep] = useState<number | null>(null);
  const [nextStep, setNextStep] = useState<number | null>(null);
  const [nextRiddleText, setNextRiddleText] = useState<string>('');
  const [isAlreadyUnlocked, setIsAlreadyUnlocked] = useState(false);
  const [isFinishedWin, setIsFinishedWin] = useState(false);
  const [pastSolvedStep, setPastSolvedStep] = useState<number | null>(null);
  const [playerActualTarget, setPlayerActualTarget] = useState<number | null>(null);

  useEffect(() => {
    const cachedName = localStorage.getItem('quest_player_name');
    const cachedSide = localStorage.getItem('quest_player_side');
    if (cachedName) setPlayerName(cachedName);
    if (cachedSide) setPlayerSide(cachedSide);
  }, []);

  const handleScan = (text: string) => {
    if (!text) return;
    setShowScanner(false);
    try {
      const url = new URL(text);
      if (url.pathname.startsWith('/q/')) {
        router.push(url.pathname + url.search);
      } else {
        alert('Invalid QR code scanned. Make sure it is a Wedding Quest clue card!');
      }
    } catch {
      if (text.includes('/q/')) {
        const idx = text.indexOf('/q/');
        router.push(text.substring(idx));
      } else {
        alert('Invalid QR code scanned.');
      }
    }
  };

  useEffect(() => {
    const validateScan = async () => {
      try {
        const playerId = localStorage.getItem('quest_player_id');
        if (!playerId) {
          // If no player registered yet, send to start page with return redirect
          router.push(`/q/start?redirect=/q/${color}/${step}?secret=${secret || ''}`);
          return;
        }

        // 1. Fetch riddle for this card to verify secret
        const riddleDoc = await getDoc(doc(db, 'wedding_quest_riddles', `${color}_${step}`));
        if (!riddleDoc.exists()) {
          setError("Clue not found in database.");
          setLoading(false);
          return;
        }

        const riddleData = riddleDoc.data();
        if (riddleData.secret !== secret) {
          setError("Invalid QR Code Secret. Nice try!");
          setLoading(false);
          return;
        }

        // 2. Fetch game settings
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

        // 3. Fetch player data
        const playerRef = doc(db, 'wedding_quest_players', playerId);
        const playerDoc = await getDoc(playerRef);
        
        if (!playerDoc.exists()) {
          router.push('/q/start');
          return;
        }

        const playerData = playerDoc.data();
        if (playerData.name) setPlayerName(playerData.name);
        if (playerData.side || playerData.relation) setPlayerSide(playerData.side || playerData.relation);

        let currentStep = playerData.current_step || 0;
        const playerActiveRound = playerData.active_round;

        if (playerActiveRound !== color) {
          currentStep = 0;
        }

        // 4. Progression Decision Logic
        if (step === currentStep + 1) {
          // 🎉 SUCCESS: Player found the EXACT next clue card!
          const updatePayload: any = {
            current_step: step,
            active_round: color,
            last_scanned_at: new Date()
          };

          if (step >= maxSteps) {
            // Found final card! Mark completed
            updatePayload.completed_at = new Date();
            await updateDoc(playerRef, updatePayload);
            setIsFinishedWin(true);
            setUnlockedStep(step);

            // Grand Winner Confetti!
            confetti({
              particleCount: 100,
              spread: 90,
              origin: { y: 0.5 }
            });

            // Redirect to win page after brief celebration
            setTimeout(() => {
              router.push('/q/win');
            }, 1800);
          } else {
            // Advanced to next step!
            await updateDoc(playerRef, updatePayload);
            setUnlockedStep(step);
            setNextStep(step + 1);

            // Fetch the NEXT riddle
            const nextRiddleDoc = await getDoc(doc(db, 'wedding_quest_riddles', `${color}_${step + 1}`));
            if (nextRiddleDoc.exists() && nextRiddleDoc.data()?.riddleText) {
              setNextRiddleText(nextRiddleDoc.data().riddleText);
            } else {
              const fallback = QUEST_DATA[color]?.riddles[step]?.riddleText;
              setNextRiddleText(fallback || "Find the next clue card!");
            }

            // Confetti burst for finding this clue!
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
          }

        } else if (step === currentStep) {
          // Player re-scanned the card they already found
          setUnlockedStep(step);
          setIsAlreadyUnlocked(true);

          if (step >= maxSteps) {
            setIsFinishedWin(true);
          } else {
            setNextStep(step + 1);
            const nextRiddleDoc = await getDoc(doc(db, 'wedding_quest_riddles', `${color}_${step + 1}`));
            if (nextRiddleDoc.exists() && nextRiddleDoc.data()?.riddleText) {
              setNextRiddleText(nextRiddleDoc.data().riddleText);
            } else {
              const fallback = QUEST_DATA[color]?.riddles[step]?.riddleText;
              setNextRiddleText(fallback || "Find the next clue card!");
            }
          }

        } else if (step < currentStep) {
          // Player scanned a card from an earlier step
          setPastSolvedStep(step);
          setPlayerActualTarget(currentStep + 1);

        } else {
          // Player skipped ahead!
          setError(`You skipped ahead! You are currently hunting for Clue Card #${currentStep + 1}, but you scanned Card #${step}. Go back and solve Clue #${currentStep + 1} first!`);
        }

      } catch (err) {
        console.error("Error validating scan:", err);
        setError("An error occurred connecting to the database.");
      } finally {
        setLoading(false);
      }
    };

    validateScan();
  }, [color, step, secret, router]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--primary)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Decrypting clue card...</div>
      </div>
    );
  }

  const roundColors: Record<string, string> = {
    yellow: '#eab308',
    green: '#22c55e',
    pink: '#ec4899',
    red: '#ef4444',
  };
  const themeHex = roundColors[color] || 'var(--primary)';

  // ERROR SCREEN (Skipped ahead, wrong round, invalid secret, etc.)
  if (error) {
    return (
      <div style={{ padding: '2.5rem clamp(1rem, 4vw, 1.5rem)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', fontWeight: 800, color: '#ef4444', marginBottom: '1rem' }}>
          Hold On!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          {error}
        </p>

        <button 
          onClick={() => router.push('/q/play')}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--primary)',
            color: '#000000',
            fontWeight: 800,
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 20px var(--glow)',
            marginBottom: '1rem'
          }}
        >
          🔍 View My Active Clue Riddle
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
          Return to Start Page
        </button>
      </div>
    );
  }

  // ALREADY SOLVED PAST CLUE SCREEN
  if (pastSolvedStep !== null) {
    return (
      <div style={{ padding: '2.5rem clamp(1rem, 4vw, 1.5rem)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>✅</div>
        <div style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 700, color: themeHex, marginBottom: '0.5rem' }}>
          The {color} Round
        </div>
        <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', fontWeight: 800, color: '#22c55e', marginBottom: '0.5rem' }}>
          You Already Found Clue #{pastSolvedStep}!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          You're ahead! You already conquered this location. Your active hunt is currently for <strong>Clue Card #{playerActualTarget} of {totalRiddles}</strong>.
        </p>

        <button
          onClick={() => router.push('/q/play')}
          style={{
            width: '100%',
            padding: '1.1rem',
            backgroundColor: 'var(--primary)',
            color: '#000',
            fontWeight: 800,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 0 20px var(--glow)',
            marginBottom: '1rem'
          }}
        >
          ➡️ View My Active Clue (#{playerActualTarget})
        </button>

        <button
          onClick={() => setShowScanner(true)}
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          📷 Scan Next Clue In-App
        </button>
      </div>
    );
  }

  // FINAL WIN SCREEN (Card 8 found!)
  if (isFinishedWin) {
    return (
      <div style={{ padding: '3rem clamp(1rem, 4vw, 1.5rem)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🏆</div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
          All Clues Solved!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem' }}>
          Congratulations, {playerName}! You found the final clue card!
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Taking you to the official Winners Podium...
        </p>
        <button
          onClick={() => router.push('/q/win')}
          style={{
            width: '100%',
            padding: '1.1rem',
            backgroundColor: '#fbbf24',
            color: '#000',
            fontWeight: 900,
            borderRadius: '10px',
            border: 'none',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
            cursor: 'pointer'
          }}
        >
          🏆 Claim Your Victory
        </button>
      </div>
    );
  }

  // SUCCESS / CHECKPOINT UNLOCKED SCREEN (Shows Checkpoint #found, reveals Next Riddle!)
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
              Scan Clue #{nextStep} QR Code
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

      {/* Contestant Header Badge */}
      {playerName && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '0.45rem 1.1rem',
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          maxWidth: '100%',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Contestant:
          </span>
          <strong style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 800 }}>
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
      )}

      {/* Celebration Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {isAlreadyUnlocked ? '✅' : '🎉'}
        </div>

        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '16px',
          backgroundColor: `${themeHex}22`,
          border: `1px solid ${themeHex}66`,
          color: themeHex,
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '0.5rem'
        }}>
          The {color} Round
        </div>

        <h1 style={{
          fontSize: 'clamp(1.3rem, 5.5vw, 1.85rem)',
          fontWeight: 800,
          color: isAlreadyUnlocked ? '#22c55e' : '#fbbf24',
          margin: '0 0 0.5rem 0',
          textTransform: 'uppercase'
        }}>
          {isAlreadyUnlocked 
            ? `Checkpoint #${unlockedStep} Already Unlocked!` 
            : `Checkpoint #${unlockedStep} Found!`}
        </h1>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Progress: <strong>{unlockedStep} of {totalRiddles}</strong> Clues Found
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
            width: `${Math.min(100, ((unlockedStep || 0) / totalRiddles) * 100)}%`,
            height: '100%',
            backgroundColor: themeHex,
            boxShadow: `0 0 10px ${themeHex}`,
            transition: 'width 0.4s ease'
          }}></div>
        </div>
      </div>

      {/* Next Riddle Box */}
      {nextStep && (
        <div style={{
          padding: 'clamp(1.2rem, 4vw, 1.75rem)',
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
            ✦ Next Challenge: Clue #{nextStep} of {totalRiddles} ✦
          </div>

          <h2 style={{
            fontSize: 'clamp(1.05rem, 4.5vw, 1.3rem)',
            fontStyle: 'italic',
            lineHeight: '1.6',
            color: '#ffffff',
            margin: '0 0 1rem 0',
            fontWeight: 600
          }}>
            "{nextRiddleText}"
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
            <span>Go find physical <strong>Clue Card #{nextStep}</strong> and scan its QR code!</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {nextStep && (
        <button 
          onClick={() => setShowScanner(true)}
          style={{
            width: '100%',
            backgroundColor: themeHex,
            color: '#000000',
            fontWeight: 800,
            padding: '1.1rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
            boxShadow: `0 0 25px ${themeHex}55`,
            marginBottom: '1rem'
          }}
        >
          📷 Scan Clue #{nextStep} In-App
        </button>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
        💡 <em>Tip: You can also use your phone Camera app to scan Card #{nextStep}!</em>
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link 
          href="/q/play"
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
          🏰 Quest Hub
        </Link>

        <Link 
          href="/q/leaderboard"
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
          🏆 Leaderboard
        </Link>
      </div>

    </div>
  );
}
