"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function StartPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAppBrowser, setIsAppBrowser] = useState(false);

  useEffect(() => {
    // Basic check for in-app browsers like IG/FB which break localStorage
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if ((ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Instagram") > -1)) {
      setIsAppBrowser(true);
    }
  }, []);

  const startGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation) return;

    setLoading(true);
    try {
      const playerId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      
      // Save to Firebase
      await setDoc(doc(db, 'wedding_quest_players', playerId), {
        name,
        relation,
        started_at: new Date(),
        current_step: 0,
        active_round: null
      });

      // Save session to device
      localStorage.setItem('quest_player_id', playerId);
      localStorage.setItem('quest_player_name', name);

      alert("Welcome to the game! Now go find the first QR code for the active round!");
      // We don't route them anywhere yet because they need to scan a QR code.
      // But we can clear the form and show a success message.
      setName('');
      setRelation('');
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
    <div style={{ padding: '2rem' }}>
      {isAppBrowser && (
        <div style={{ padding: '1rem', backgroundColor: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <strong>⚠️ Warning:</strong> It looks like you opened this from Instagram or Facebook. Please open this page in your normal browser (Safari/Chrome) or your game progress will be lost!
        </div>
      )}

      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Wedding Quest</h1>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>Enter your details below to join the game. Solve the riddles, find the QR codes, and race to the finish!</p>

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

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Relation to Couple</label>
          <input 
            type="text" 
            value={relation} 
            onChange={e => setRelation(e.target.value)} 
            placeholder="e.g. Bride's Brother"
            required 
            style={inputStyle}
          />
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
