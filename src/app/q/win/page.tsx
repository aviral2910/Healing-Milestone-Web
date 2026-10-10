"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WinPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>('');

  useEffect(() => {
    const name = localStorage.getItem('quest_player_name');
    if (!name) {
      router.push('/q/start');
    } else {
      setPlayerName(name);
    }
  }, [router]);

  return (
    <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 800, 
        color: 'var(--primary)', 
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textShadow: '0 0 15px var(--glow)'
      }}>
        Congratulations!
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        Incredible job, <strong>{playerName}</strong>! You have successfully solved every riddle in this round!
      </p>

      <div style={{ 
        padding: '1.5rem', 
        border: '1px solid var(--border)', 
        backgroundColor: 'var(--surface)', 
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Go show this screen to the event coordinator or the bride's brother to claim your prize!
        </p>
      </div>

      <button 
        onClick={() => router.push('/q/start')}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Play Another Round
      </button>
    </div>
  );
}
