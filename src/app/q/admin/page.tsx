"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RoundColor, QUEST_DATA } from '../data';

export default function AdminPage() {
  const [activeRound, setActiveRound] = useState<RoundColor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, 'wedding_quest_settings', 'game_state');
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setActiveRound(docSnap.data().active_round);
        } else {
          await setDoc(ref, { active_round: null });
        }
      } catch (error: any) {
        console.error("Firestore Error:", error);
        alert("Database Error: " + error.message + "\\n\\nDid you forget to deploy the Firestore rules?");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const changeRound = async (color: RoundColor | null) => {
    setLoading(true);
    await updateDoc(doc(db, 'wedding_quest_settings', 'game_state'), {
      active_round: color
    });
    setActiveRound(color);
    setLoading(false);
  };

  const seedDatabase = async () => {
    if (!confirm("This will overwrite all riddles in Firebase with the 40 new riddles from the code. Continue?")) return;
    setLoading(true);
    try {
      for (const [color, data] of Object.entries(QUEST_DATA)) {
        for (const riddle of data.riddles) {
          const docRef = doc(db, 'wedding_quest_riddles', `${color}_${riddle.step}`);
          await setDoc(docRef, {
            riddleText: riddle.riddleText,
            secret: riddle.secret,
            totalSteps: data.riddles.length
          });
        }
      }
      alert("Database successfully seeded with all 40 riddles!");
    } catch (e) {
      console.error(e);
      alert("Error seeding database.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary)' }}>Loading controls...</div>;

  const btnStyle = (isActive: boolean, colorHex: string) => ({
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: isActive ? `2px solid ${colorHex}` : '1px solid var(--border)',
    backgroundColor: isActive ? `${colorHex}22` : 'var(--background)',
    color: isActive ? colorHex : 'var(--text-secondary)',
    fontWeight: isActive ? 600 : 400,
    fontSize: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Anchor Controls</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Change the active round here. Players scanning QR codes for inactive rounds will be blocked.</p>

      <div>
        <button onClick={() => changeRound('yellow')} style={btnStyle(activeRound === 'yellow', '#eab308')}>
          {activeRound === 'yellow' ? '🟡 YELLOW (Active)' : 'Start Yellow Round'}
        </button>

        <button onClick={() => changeRound('green')} style={btnStyle(activeRound === 'green', '#22c55e')}>
          {activeRound === 'green' ? '🟢 GREEN (Active)' : 'Start Green Round'}
        </button>

        <button onClick={() => changeRound('pink')} style={btnStyle(activeRound === 'pink', '#ec4899')}>
          {activeRound === 'pink' ? '🌸 PINK (Active)' : 'Start Pink Round'}
        </button>

        <button onClick={() => changeRound('red')} style={btnStyle(activeRound === 'red', '#ef4444')}>
          {activeRound === 'red' ? '❤️ RED (Active)' : 'Start Red Round'}
        </button>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => changeRound(null)} style={{...btnStyle(false, '#fff'), backgroundColor: '#222', color: '#fff'}}>
            Stop Game (No Active Round)
          </button>
          
          <button onClick={seedDatabase} style={{
            width: '100%', padding: '1rem', borderRadius: '8px',
            border: '1px solid var(--primary)', backgroundColor: 'var(--glow)',
            color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginTop: '1rem'
          }}>
            Initialize Riddles in Firebase
          </button>
        </div>
      </div>
    </div>
  );
}
