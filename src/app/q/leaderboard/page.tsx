"use client";

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RoundColor } from '../data';

interface Player {
  id: string;
  name: string;
  relation: string;
  phone?: string;
  current_step: number;
  active_round: string | null;
  last_scanned_at?: any;
  completed_at?: any;
}

export default function LeaderboardPage() {
  const [activeRound, setActiveRound] = useState<RoundColor | null>(null);
  const [roundSteps, setRoundSteps] = useState<Record<string, number>>({
    yellow: 8,
    green: 8,
    pink: 8,
    red: 8
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to active round and clue counts
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'wedding_quest_settings', 'game_state'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setActiveRound(data.active_round || null);
        if (data.round_steps) {
          setRoundSteps(data.round_steps);
        }
      }
      setLoading(false);
    });
    return () => unsubSettings();
  }, []);

  // 2. Listen to all players (sorted in-memory to prevent Firestore index requirements)
  useEffect(() => {
    const unsubPlayers = onSnapshot(collection(db, 'wedding_quest_players'), (snapshot) => {
      const pData: Player[] = [];
      snapshot.forEach((doc) => {
        pData.push({ id: doc.id, ...doc.data() } as Player);
      });

      // Sort: Winners first (by earliest completion time), then active players by level desc
      pData.sort((a, b) => {
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

      setPlayers(pData);
    });

    return () => unsubPlayers();
  }, [roundSteps]);

  const roundColors: Record<string, string> = {
    yellow: '#eab308',
    green: '#22c55e',
    pink: '#ec4899',
    red: '#ef4444'
  };

  const activeColorHex = activeRound ? roundColors[activeRound] : 'var(--primary)';

  // Filter players playing the active round, or all players if none
  const displayPlayers = activeRound 
    ? players.filter(p => p.active_round === activeRound || p.current_step > 0)
    : players;

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--primary)' }}>
        Loading Live Leaderboard...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem clamp(0.75rem, 3vw, 1.5rem)', maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(1.4rem, 6vw, 2.2rem)', 
          fontWeight: 800, 
          color: 'var(--primary)', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          textShadow: '0 0 15px var(--glow)',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}>
          Live Leaderboard
        </h1>
        
        {activeRound ? (
          <div style={{
            display: 'inline-block',
            padding: '0.4rem clamp(0.75rem, 3vw, 1.2rem)',
            borderRadius: '9999px',
            backgroundColor: `${activeColorHex}22`,
            border: `1px solid ${activeColorHex}`,
            color: activeColorHex,
            fontWeight: 700,
            fontSize: 'clamp(0.75rem, 3vw, 0.85rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            maxWidth: '100%',
            whiteSpace: 'normal',
            lineHeight: '1.4'
          }}>
            ● Live: {activeRound.toUpperCase()} ROUND ({roundSteps[activeRound] || 8} CLUES)
          </div>
        ) : (
          <div style={{
            display: 'inline-block',
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}>
            Waiting for Anchor to Start...
          </div>
        )}
      </div>

      {/* PLAYERS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
        {displayPlayers.length === 0 ? (
          <div style={{ 
            padding: '3rem 1.5rem', 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '16px', 
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No clues scanned yet!</p>
            <p style={{ fontSize: '0.85rem' }}>Be the first to scan a QR code and take the #1 spot!</p>
          </div>
        ) : (
          displayPlayers.map((player, index) => {
            const maxSteps = player.active_round ? (roundSteps[player.active_round] || 8) : 8;
            const hasWon = player.current_step >= maxSteps && player.current_step > 0;
            const isTop = index === 0 && player.current_step > 0;
            const hex = player.active_round ? roundColors[player.active_round] || 'var(--primary)' : 'var(--primary)';

            return (
              <div 
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem clamp(0.75rem, 3vw, 1.25rem)',
                  backgroundColor: isTop ? 'var(--surface)' : 'var(--background)',
                  border: isTop ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: isTop ? '0 0 25px var(--glow)' : 'none',
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                {/* Left: Rank & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: '1 1 180px' }}>
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    flexShrink: 0,
                    borderRadius: '50%', 
                    backgroundColor: isTop ? 'var(--primary)' : 'var(--surface)', 
                    color: isTop ? '#000' : 'var(--text-primary)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '1rem',
                    boxShadow: isTop ? '0 0 10px var(--glow)' : 'none'
                  }}>
                    {hasWon ? '🏆' : isTop ? '👑' : `#${index + 1}`}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h2 style={{ 
                      fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)', 
                      fontWeight: 700, 
                      margin: 0, 
                      color: isTop ? 'var(--primary)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '6px',
                      wordBreak: 'break-word'
                    }}>
                      <span>{player.name}</span>
                      {hasWon && (
                        <span style={{ 
                          fontSize: '0.65rem', 
                          padding: '2px 7px', 
                          backgroundColor: '#eab308', 
                          color: '#000', 
                          borderRadius: '9999px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap'
                        }}>
                          {index === 0 ? '🥇 1ST PLACE' : index === 1 ? '🥈 2ND PLACE' : index === 2 ? '🥉 3RD PLACE' : '🏆 FINISHED'}
                        </span>
                      )}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', wordBreak: 'break-word' }}>
                      {player.relation && (
                        <span>
                          {player.relation.toLowerCase().includes('bride') ? '👰 ' : player.relation.toLowerCase().includes('groom') ? '🤵 ' : ''}
                          {player.relation}
                        </span>
                      )}
                      {hasWon && (player.completed_at || player.last_scanned_at) && (
                        <span style={{ display: 'inline-block', marginLeft: '6px', color: '#eab308', fontWeight: 600 }}>
                          • Finished {new Date((player.completed_at?.seconds || player.last_scanned_at?.seconds) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Progress & Level */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 800, 
                    color: hex 
                  }}>
                    Level {player.current_step} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ {maxSteps}</span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div style={{ 
                    width: '120px', 
                    height: '6px', 
                    backgroundColor: 'var(--surface)', 
                    borderRadius: '3px', 
                    overflow: 'hidden',
                    marginTop: '6px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ 
                      width: `${Math.min(100, (player.current_step / maxSteps) * 100)}%`, 
                      height: '100%', 
                      backgroundColor: hex,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
