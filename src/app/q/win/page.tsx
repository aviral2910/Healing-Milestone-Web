"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import confetti from 'canvas-confetti';

export default function WinPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>('');
  const [playerRelation, setPlayerRelation] = useState<string>('');
  const [completedTime, setCompletedTime] = useState<string>('');
  const [rank, setRank] = useState<number | null>(null);
  const [roundName, setRoundName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinnerDetails = async () => {
      const playerId = localStorage.getItem('quest_player_id');
      const name = localStorage.getItem('quest_player_name');
      
      if (!playerId || !name) {
        router.push('/q/start');
        return;
      }
      setPlayerName(name);

      try {
        const playerSnap = await getDoc(doc(db, 'wedding_quest_players', playerId));
        if (playerSnap.exists()) {
          const pData = playerSnap.data();
          setPlayerRelation(pData.relation || '');
          const round = pData.active_round || '';
          setRoundName(round);

          const timeVal = pData.completed_at || pData.last_scanned_at;
          if (timeVal) {
            const dateObj = timeVal.toDate ? timeVal.toDate() : new Date(timeVal.seconds * 1000);
            setCompletedTime(dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          }

          // Calculate rank among completed players in this round
          const allPlayersSnap = await getDocs(collection(db, 'wedding_quest_players'));
          const winners: any[] = [];
          allPlayersSnap.forEach((d) => {
            const data = d.data();
            if (data.active_round === round && (data.completed_at || data.current_step >= 5)) {
              winners.push({ id: d.id, ...data });
            }
          });

          // Sort by completion time
          winners.sort((a, b) => {
            const tA = a.completed_at?.seconds || a.last_scanned_at?.seconds || 0;
            const tB = b.completed_at?.seconds || b.last_scanned_at?.seconds || 0;
            return tA - tB;
          });

          const myIdx = winners.findIndex(w => w.id === playerId);
          if (myIdx !== -1) {
            setRank(myIdx + 1);
          } else {
            setRank(1);
          }
        }
      } catch (e) {
        console.error("Error fetching winner stats:", e);
      } finally {
        setLoading(false);

        // 🎉 BIG CONFETTI CELEBRATION!
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.4 }
        });

        const end = Date.now() + 3000;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 }
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 }
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }
    };

    fetchWinnerDetails();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--primary)' }}>
        Generating your Winner Certificate...
      </div>
    );
  }

  const rankBadge = rank === 1 ? '🥇 1ST PLACE WINNER' : rank === 2 ? '🥈 2ND PLACE' : rank === 3 ? '🥉 3RD PLACE' : `🏆 #${rank} FINISHER`;

  return (
    <div style={{ padding: '2.5rem clamp(1rem, 4vw, 1.5rem)', textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(3rem, 10vw, 4rem)', marginBottom: '0.5rem', textShadow: '0 0 20px var(--glow)' }}>
        {rank === 1 ? '👑' : '🎉'}
      </div>

      <div style={{
        display: 'inline-block',
        padding: '0.4rem 1.2rem',
        backgroundColor: '#eab30822',
        border: '1px solid #eab308',
        color: '#eab308',
        borderRadius: '9999px',
        fontWeight: 800,
        fontSize: 'clamp(0.75rem, 3vw, 0.85rem)',
        letterSpacing: '1px',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        maxWidth: '100%',
        overflowWrap: 'break-word'
      }}>
        {rankBadge}
      </div>

      <h1 style={{ 
        fontSize: 'clamp(1.4rem, 6.2vw, 2.2rem)', 
        fontWeight: 800, 
        color: 'var(--primary)', 
        marginBottom: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textShadow: '0 0 20px var(--glow)',
        lineHeight: 1.15,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%'
      }}>
        Congratulations!
      </h1>
      
      <p style={{ 
        fontSize: 'clamp(0.95rem, 3.8vw, 1.15rem)', 
        color: 'var(--text-primary)', 
        marginBottom: '2rem', 
        lineHeight: '1.5',
        overflowWrap: 'break-word',
        wordBreak: 'break-word'
      }}>
        Incredible speed, <strong>{playerName}</strong>! You have solved all the clues and conquered the <strong>{roundName ? roundName.toUpperCase() : ''} ROUND</strong> of <strong>Ankita & Harshit's Wedding Quest</strong>!
      </p>

      {/* WINNER CERTIFICATE CARD */}
      <div style={{ 
        padding: '1.75rem clamp(1rem, 4vw, 1.5rem)', 
        border: '2px solid var(--primary)', 
        backgroundColor: 'var(--surface)', 
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 0 30px var(--glow)',
        textAlign: 'left'
      }}>
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          color: 'var(--primary)', 
          letterSpacing: '1.5px', 
          textTransform: 'uppercase', 
          marginBottom: '1rem', 
          borderBottom: '1px solid var(--border)', 
          paddingBottom: '0.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          <span>✨</span> Ankita & Harshit's Wedding Quest
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          borderBottom: '1px solid var(--border)', 
          paddingBottom: '1rem', 
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ minWidth: 0, flex: '1 1 140px' }}>
            {playerRelation && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {playerRelation.toLowerCase().includes('bride') ? '👰' : playerRelation.toLowerCase().includes('groom') ? '🤵' : '👔'} {playerRelation}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Official Rank</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
              #{rank || 1}
            </div>
          </div>
        </div>

        {completedTime && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>⏱️ Official Completion Time:</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>{completedTime}</span>
          </div>
        )}
      </div>

      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'var(--background)', 
        border: '1px dashed var(--border)', 
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, overflowWrap: 'break-word' }}>
          🎟️ <strong>CLAIM YOUR PRIZE:</strong> Show this screen to the Anchor or the Bride's Brother (Aviral) to verify your winning time!
        </p>
      </div>

      <button 
        onClick={() => router.push('/q/start')}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '0.85rem'
        }}
      >
        Play Next Round
      </button>
    </div>
  );
}
