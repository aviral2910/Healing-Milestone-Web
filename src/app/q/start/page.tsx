"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function StartPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
        phone: phone || '',
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

      {/* BRAND & COUPLE GREETING HERO */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        
        {/* Brand Lockup: Line 1 = Appbar Logo & Typography, Line 2 = White Presents */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          
          {/* 1st Line: Logo + HEALING MILESTONES in ONE horizontal line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="Healing Milestones" 
              style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
            />
            <span style={{ 
              fontFamily: "'Oswald', sans-serif", 
              fontWeight: 500, 
              fontSize: '1.45rem', 
              color: '#ffffff', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              HEALING MILESTONES
            </span>
          </div>

          {/* 2nd Line: PRESENTS in golden yellow */}
          <div style={{ 
            color: 'var(--primary)', 
            fontSize: '0.8rem', 
            letterSpacing: '6px', 
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
          padding: '1.3rem 1rem',
          backgroundColor: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: '0 0 25px var(--glow)',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
            Celebrating The Wedding Of
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 900, 
            color: 'var(--primary)', 
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textShadow: '0 0 15px var(--glow)'
          }}>
            ✨ Ankita & Harshit ✨
          </h1>
          <div style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            The Wedding Scavenger Hunt
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
          "Celebrating love, milestones, and new beginnings. Enter your details below to race for the clues!"
        </p>
      </div>

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
