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

      // Sort client-side
      pData.sort((a, b) => {
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
  }, []);

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
    <div style={{ padding: '2rem 1.5rem', maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: 800, 
          color: 'var(--primary)', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          marginBottom: '0.5rem',
          textShadow: '0 0 15px var(--glow)'
        }}>
          Live Leaderboard
        </h1>
        
        {activeRound ? (
          <div style={{
            display: 'inline-block',
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            backgroundColor: `${activeColorHex}22`,
            border: `1px solid ${activeColorHex}`,
            color: activeColorHex,
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
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
                  padding: '1.2rem 1.5rem',
                  backgroundColor: isTop ? 'var(--surface)' : 'var(--background)',
                  border: isTop ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: isTop ? '0 0 25px var(--glow)' : 'none',
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                {/* Left: Rank & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%', 
                    backgroundColor: isTop ? 'var(--primary)' : 'var(--surface)', 
                    color: isTop ? '#000' : 'var(--text-primary)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '1.1rem',
                    boxShadow: isTop ? '0 0 10px var(--glow)' : 'none'
                  }}>
                    {hasWon ? '🏆' : isTop ? '👑' : `#${index + 1}`}
                  </div>

                  <div>
                    <h2 style={{ 
                      fontSize: '1.15rem', 
                      fontWeight: 700, 
                      margin: 0, 
                      color: isTop ? 'var(--primary)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {player.name}
                      {hasWon && (
                        <span style={{ 
                          fontSize: '0.65rem', 
                          padding: '2px 8px', 
                          backgroundColor: '#eab308', 
                          color: '#000', 
                          borderRadius: '9999px',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          WINNER
                        </span>
                      )}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                      {player.relation}
                    </p>
                  </div>
                </div>

                {/* Right: Progress & Level */}
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
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
