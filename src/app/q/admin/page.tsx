"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RoundColor } from '../data';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  phone?: string;
  relation: string;
  current_step: number;
  active_round: string | null;
  started_at?: any;
  last_scanned_at?: any;
  completed_at?: any;
}

export default function AdminPage() {
  const [activeRound, setActiveRound] = useState<RoundColor | null>(null);
  const [roundSteps, setRoundSteps] = useState<Record<string, number>>({
    yellow: 8,
    green: 8,
    pink: 8,
    red: 8
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRound, setFilterRound] = useState<string>('all');

  // 1. Listen to global game state
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'wedding_quest_settings', 'game_state'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setActiveRound(data.active_round || null);
        if (data.round_steps) {
          setRoundSteps(data.round_steps);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Real-time live listener for all participants
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'wedding_quest_players'), (snapshot) => {
      const pList: Player[] = [];
      snapshot.forEach((d) => {
        pList.push({ id: d.id, ...d.data() } as Player);
      });

      // Sort client-side: Winners first (sorted by earliest completion timestamp), then active players by level
      pList.sort((a, b) => {
        const maxA = a.active_round ? (roundSteps[a.active_round] || 8) : 8;
        const maxB = b.active_round ? (roundSteps[b.active_round] || 8) : 8;
        const aWon = Boolean(a.active_round && a.current_step >= maxA);
        const bWon = Boolean(b.active_round && b.current_step >= maxB);

        if (aWon && !bWon) return -1;
        if (!aWon && bWon) return 1;

        if (aWon && bWon) {
          const timeA = a.completed_at?.seconds || a.last_scanned_at?.seconds || 0;
          const timeB = b.completed_at?.seconds || b.last_scanned_at?.seconds || 0;
          return timeA - timeB;
        }

        if ((b.current_step || 0) !== (a.current_step || 0)) {
          return (b.current_step || 0) - (a.current_step || 0);
        }
        const timeA = a.last_scanned_at?.seconds || 0;
        const timeB = b.last_scanned_at?.seconds || 0;
        return timeA - timeB;
      });

      setPlayers(pList);
    });
    return () => unsub();
  }, [roundSteps]);

  const changeRound = async (color: RoundColor | null) => {
    try {
      await updateDoc(doc(db, 'wedding_quest_settings', 'game_state'), {
        active_round: color
      });
    } catch (e: any) {
      console.error(e);
      alert("Error changing round: " + e.message);
    }
  };

  const updateCluesCount = async (round: string, count: number) => {
    try {
      const newSteps = { ...roundSteps, [round]: count };
      setRoundSteps(newSteps);
      await updateDoc(doc(db, 'wedding_quest_settings', 'game_state'), {
        round_steps: newSteps
      });
    } catch (e: any) {
      console.error(e);
      alert("Error setting clue count: " + e.message);
    }
  };

  const resetPlayer = async (id: string, name: string) => {
    if (!confirm(`Reset progress for ${name}? They will go back to Clue #0.`)) return;
    try {
      await updateDoc(doc(db, 'wedding_quest_players', id), {
        current_step: 0,
        active_round: null
      });
    } catch (e: any) {
      alert("Error resetting player: " + e.message);
    }
  };

  const deletePlayer = async (id: string, name: string) => {
    if (!confirm(`Delete ${name} from the game completely?`)) return;
    try {
      await deleteDoc(doc(db, 'wedding_quest_players', id));
    } catch (e: any) {
      alert("Error deleting player: " + e.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Anchor Dashboard...</div>;
  }

  const roundHexMap: Record<string, string> = {
    yellow: '#eab308',
    green: '#22c55e',
    pink: '#ec4899',
    red: '#ef4444'
  };

  const filteredPlayers = filterRound === 'all' 
    ? players 
    : players.filter(p => p.active_round === filterRound);

  return (
    <div style={{ padding: '1.5rem clamp(0.75rem, 3vw, 1.5rem)', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', fontWeight: 800, color: 'var(--primary)', margin: 0, overflowWrap: 'break-word' }}>
            Anchor Control Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', overflowWrap: 'break-word' }}>
            Manage live rounds, clue limits, and track participants in real time.
          </p>
        </div>
        <Link 
          href="/q/leaderboard"
          target="_blank"
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--primary)',
            color: 'var(--primary)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          🏆 Open Big-Screen Board
        </Link>
      </div>

      {/* QUICK STATS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{players.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Joined</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22c55e' }}>
            {players.filter(p => p.active_round && p.current_step > 0).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Hunting Clues</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#eab308' }}>
            {players.filter(p => {
              if (!p.active_round) return false;
              const max = roundSteps[p.active_round] || 8;
              return p.current_step >= max;
            }).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Winners Finished</div>
        </div>
      </div>

      {/* 1. ACTIVE ROUND CONTROL */}
      <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎯 Step 1: Select Active Round
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {(['yellow', 'green', 'pink', 'red'] as RoundColor[]).map((col) => {
            const isActive = activeRound === col;
            const hex = roundHexMap[col];
            return (
              <button
                key={col}
                onClick={() => changeRound(col)}
                style={{
                  padding: '1rem 0.5rem',
                  borderRadius: '10px',
                  border: isActive ? `2px solid ${hex}` : '1px solid var(--border)',
                  backgroundColor: isActive ? `${hex}22` : 'var(--background)',
                  color: isActive ? hex : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: isActive ? `0 0 15px ${hex}44` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {col === 'yellow' ? '🟡 Haldi' : col === 'green' ? '🟢 Mehndi' : col === 'pink' ? '🌸 Sangeet' : '❤️ Wedding'}
                <div style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.8 }}>
                  {isActive ? 'ACTIVE NOW' : 'Tap to Activate'}
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => changeRound(null)}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: activeRound === null ? '#ef444433' : 'transparent',
            border: activeRound === null ? '1px solid #ef4444' : '1px solid var(--border)',
            color: activeRound === null ? '#ef4444' : 'var(--text-secondary)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {activeRound === null ? '⏸️ Game Paused (No Active Round)' : 'Pause Game / Stop All Scanning'}
        </button>
      </div>

      {/* 2. CLUES LIMIT PER ROUND */}
      <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          ⚡ Step 2: Set Number of Riddles (1-Click)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Want a shorter 5 or 6 riddle game instead of 8? Click the number below for each round. The app will automatically set that clue as the final winning clue!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(['yellow', 'green', 'pink', 'red'] as RoundColor[]).map((col) => {
            const currentSteps = roundSteps[col] || 8;
            const hex = roundHexMap[col];
            const roundName = col === 'yellow' ? '🟡 Yellow (Haldi)' : col === 'green' ? '🟢 Green (Mehndi)' : col === 'pink' ? '🌸 Pink (Sangeet)' : '❤️ Red (Wedding)';

            return (
              <div 
                key={col} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem 1rem', 
                  backgroundColor: 'var(--background)', 
                  border: `1px solid ${activeRound === col ? hex : 'var(--border)'}`, 
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontWeight: 600, color: activeRound === col ? hex : 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {roundName} {activeRound === col && <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: hex, color: '#000', borderRadius: '4px', marginLeft: '6px', fontWeight: 700 }}>LIVE</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '4px' }}>Clues:</span>
                  {[4, 5, 6, 7, 8].map((num) => {
                    const isSelected = currentSteps === num;
                    return (
                      <button
                        key={num}
                        onClick={() => updateCluesCount(col, num)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${hex}` : '1px solid var(--border)',
                          backgroundColor: isSelected ? hex : 'var(--surface)',
                          color: isSelected ? '#000' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LIVE PARTICIPANTS TRACKER / LEADERBOARD */}
      <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              👥 Live Participants Tracker ({filteredPlayers.length})
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Real-time feed of joined guests, phone numbers, and active clue level.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'yellow', 'green', 'pink', 'red'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRound(f)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  border: filterRound === f ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: filterRound === f ? 'var(--primary)' : 'transparent',
                  color: filterRound === f ? '#000' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No participants found. Share the Start QR code (`/q/start`) for guests to join!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredPlayers.map((player, idx) => {
              const maxSteps = player.active_round ? (roundSteps[player.active_round] || 8) : 8;
              const hasWon = player.active_round && player.current_step >= maxSteps;
              const hex = player.active_round ? roundHexMap[player.active_round] || 'var(--primary)' : '#888';

              return (
                <div 
                  key={player.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'var(--background)',
                    border: hasWon ? '1px solid #eab308' : '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: hasWon ? '0 0 15px rgba(234, 179, 8, 0.15)' : 'none',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  {/* Left: Player Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', 
                      backgroundColor: idx === 0 && player.current_step > 0 ? '#eab308' : 'var(--surface)', 
                      color: idx === 0 && player.current_step > 0 ? '#000' : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem'
                    }}>
                      {hasWon ? '🏆' : `#${idx + 1}`}
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {player.name}
                        {hasWon && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: '#eab308', color: '#000', borderRadius: '4px', fontWeight: 800 }}>
                            {idx === 0 ? '🥇 1ST PLACE' : idx === 1 ? '🥈 2ND PLACE' : idx === 2 ? '🥉 3RD PLACE' : '🏆 FINISHED'}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span>{player.relation?.toLowerCase().includes('bride') ? '👰' : player.relation?.toLowerCase().includes('groom') ? '🤵' : '👔'} {player.relation}</span>
                        {player.phone && <span>📞 <a href={`tel:${player.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{player.phone}</a></span>}
                        {hasWon && (player.completed_at || player.last_scanned_at) && (
                          <span style={{ color: '#eab308', fontWeight: 600 }}>
                            ⏱️ Finished at: {new Date((player.completed_at?.seconds || player.last_scanned_at?.seconds) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress & Level */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: hex, textTransform: 'uppercase' }}>
                        {player.active_round ? `${player.active_round} Round` : 'Not Started'}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Level: {player.current_step} / {maxSteps}
                      </div>
                    </div>

                    {/* Action Menu */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => resetPlayer(player.id, player.name)}
                        title="Reset player to level 0"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        🔄 Reset
                      </button>
                      <button 
                        onClick={() => deletePlayer(player.id, player.name)}
                        title="Remove player"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: '#ef444422', border: '1px solid #ef444455', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
