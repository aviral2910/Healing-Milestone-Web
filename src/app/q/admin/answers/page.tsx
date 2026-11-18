"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QUEST_DATA, RoundColor } from '../../data';
import { QuestLoader } from '../../QuestLoader';

interface MergedRiddle {
  step: number;
  riddleText: string;
  solution: string;
  secret: string;
}

const ROUND_ORDER: RoundColor[] = ['yellow', 'green', 'pink', 'red'];

const ROUND_META: Record<
  RoundColor,
  { emoji: string; shortLabel: string; fullTitle: string; hex: string }
> = {
  yellow: {
    emoji: '🟡',
    shortLabel: 'Haldi',
    fullTitle: 'Yellow — The Haldi Round',
    hex: '#eab308',
  },
  green: {
    emoji: '🟢',
    shortLabel: 'Mehndi',
    fullTitle: 'Green — The Mehndi Round',
    hex: '#22c55e',
  },
  pink: {
    emoji: '🌸',
    shortLabel: 'Sangeet',
    fullTitle: 'Pink — The Sangeet Round',
    hex: '#ec4899',
  },
  red: {
    emoji: '❤️',
    shortLabel: 'Wedding',
    fullTitle: 'Red — The Love / Wedding Round',
    hex: '#ef4444',
  },
};

const STORAGE_KEY = 'quest_admin_hidden_cards_v1';

export default function AdminAnswersPage() {
  const [activeRound, setActiveRound] = useState<RoundColor | null>(null);
  const [roundSteps, setRoundSteps] = useState<Record<string, number>>({
    yellow: 8,
    green: 8,
    pink: 8,
    red: 8,
  });
  const [firestoreRiddles, setFirestoreRiddles] = useState<
    Record<string, { riddleText?: string; answer?: string; hint?: string; secret?: string }>
  >({});
  const [selectedRound, setSelectedRound] = useState<'all' | RoundColor>('all');
  const [showRiddles, setShowRiddles] = useState<boolean>(true);
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to game settings (active round & round step limits)
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'wedding_quest_settings', 'game_state'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setActiveRound((data.active_round as RoundColor) || null);
          if (data.round_steps) {
            setRoundSteps(data.round_steps);
          }
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading game settings:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Listen to live Firestore riddles so any DB updates immediately reflect here
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'wedding_quest_riddles'),
      (snapshot) => {
        const map: Record<
          string,
          { riddleText?: string; answer?: string; hint?: string; secret?: string }
        > = {};
        snapshot.forEach((d) => {
          map[d.id] = d.data() as {
            riddleText?: string;
            answer?: string;
            hint?: string;
            secret?: string;
          };
        });
        setFirestoreRiddles(map);
      },
      (err) => {
        console.error('Error loading riddles from Firestore:', err);
      }
    );
    return () => unsub();
  }, []);

  const roundsData = useMemo(() => {
    const result: Record<RoundColor, MergedRiddle[]> = {
      yellow: [],
      green: [],
      pink: [],
      red: [],
    };

    for (const color of ROUND_ORDER) {
      const localRiddles = QUEST_DATA[color].riddles;
      result[color] = localRiddles.map((r) => {
        const fsDoc = firestoreRiddles[`${color}_${r.step}`];
        return {
          step: r.step,
          riddleText: fsDoc?.riddleText || r.riddleText,
          solution: fsDoc?.answer || fsDoc?.hint || r.answer || r.hint,
          secret: fsDoc?.secret || r.secret,
        };
      });
    }

    return result;
  }, [firestoreRiddles]);

  const toggleHidden = (cardKey: string) => {
    setHiddenMap((prev) => {
      const next = { ...prev, [cardKey]: !prev[cardKey] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const resetChecklist = () => {
    const label =
      selectedRound === 'all'
        ? 'all rounds'
        : `the ${ROUND_META[selectedRound].shortLabel} round`;
    if (!confirm(`Clear all "Hidden" checkmarks for ${label}?`)) return;

    setHiddenMap((prev) => {
      const next = { ...prev };
      if (selectedRound === 'all') {
        Object.keys(next).forEach((k) => delete next[k]);
      } else {
        Object.keys(next).forEach((k) => {
          if (k.startsWith(`${selectedRound}_`)) {
            delete next[k];
          }
        });
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  if (loading) {
    return (
      <QuestLoader
        title="Loading Clue Hiding Guide..."
        subtitle="Syncing round settings and clue solutions..."
      />
    );
  }

  const visibleRounds = selectedRound === 'all' ? ROUND_ORDER : [selectedRound];

  return (
    <div style={{ padding: '1.5rem clamp(0.75rem, 3vw, 1.25rem)', maxWidth: '850px', margin: '0 auto' }}>
      {/* TOP BACK LINK & HEADER */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href="/q/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textDecoration: 'none',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          ← Back to Anchor Control Center
        </Link>

        <h1
          style={{
            fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
            fontWeight: 800,
            color: 'var(--primary)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          🗺️ Clue Card Hiding Guide
        </h1>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            margin: '6px 0 0 0',
            lineHeight: 1.45,
          }}
        >
          Match each physical <strong>Clue Card #</strong> with its exact hiding location or person. Tap cards to check them off as you hide them!
        </p>
      </div>

      {/* ROUND FILTER TABS */}
      <div
        style={{
          display: 'flex',
          gap: '0.45rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={() => setSelectedRound('all')}
          style={{
            padding: '0.45rem 0.8rem',
            borderRadius: '8px',
            border: selectedRound === 'all' ? '2px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: selectedRound === 'all' ? 'rgba(212, 175, 55, 0.18)' : 'var(--background)',
            color: selectedRound === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🌟 All Rounds
        </button>

        {ROUND_ORDER.map((col) => {
          const meta = ROUND_META[col];
          const isSelected = selectedRound === col;
          const isLive = activeRound === col;
          return (
            <button
              key={col}
              onClick={() => setSelectedRound(col)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: isSelected
                  ? `2px solid ${meta.hex}`
                  : isLive
                  ? `1px dashed ${meta.hex}`
                  : '1px solid var(--border)',
                backgroundColor: isSelected ? `${meta.hex}22` : 'var(--background)',
                color: isSelected ? meta.hex : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>{meta.emoji}</span>
              <span>{meta.shortLabel}</span>
              {isLive && (
                <span
                  style={{
                    fontSize: '0.6rem',
                    padding: '1px 4px',
                    borderRadius: '4px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontWeight: 800,
                  }}
                >
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* UTILITY CONTROLS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
        }}
      >
        <button
          onClick={() => setShowRiddles((prev) => !prev)}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--text-primary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showRiddles ? '🙈 Hide Riddle Text' : '👁️ Show Riddle Text'}
        </button>

        <button
          onClick={resetChecklist}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔄 Reset Checkmarks
        </button>
      </div>

      {/* ROUNDS & CLUE CARDS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {visibleRounds.map((col) => {
          const meta = ROUND_META[col];
          const riddles = roundsData[col];
          const limit = roundSteps[col] || 8;
          const isLive = activeRound === col;
          const activeCards = riddles.filter((r) => r.step <= limit);
          const hiddenCount = activeCards.filter((r) => hiddenMap[`${col}_${r.step}`]).length;

          return (
            <section
              key={col}
              style={{
                backgroundColor: 'var(--background)',
                border: `1px solid ${isLive ? meta.hex : 'var(--border)'}`,
                borderRadius: '14px',
                padding: '1rem',
                boxShadow: isLive ? `0 0 18px ${meta.hex}22` : 'none',
              }}
            >
              {/* Round Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  paddingBottom: '0.75rem',
                  marginBottom: '0.85rem',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.1rem' }}>{meta.emoji}</span>
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: meta.hex,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {meta.fullTitle}
                  </h2>
                  {isLive && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: meta.hex,
                        color: '#000',
                        fontWeight: 800,
                      }}
                    >
                      LIVE NOW
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: hiddenCount === activeCards.length ? '#22c55e22' : 'var(--surface)',
                      border: `1px solid ${hiddenCount === activeCards.length ? '#22c55e' : 'var(--border)'}`,
                      color: hiddenCount === activeCards.length ? '#22c55e' : 'var(--text-secondary)',
                      fontWeight: 700,
                    }}
                  >
                    {hiddenCount}/{activeCards.length} Hidden
                  </span>
                </div>
              </div>

              {/* Clue Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {riddles.map((item) => {
                  const cardKey = `${col}_${item.step}`;
                  const isHidden = Boolean(hiddenMap[cardKey]);
                  const isExtra = item.step > limit;

                  return (
                    <div
                      key={cardKey}
                      onClick={() => toggleHidden(cardKey)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleHidden(cardKey);
                        }
                      }}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        backgroundColor: isHidden
                          ? 'rgba(34, 197, 94, 0.08)'
                          : 'var(--surface)',
                        border: isHidden
                          ? '1px solid rgba(34, 197, 94, 0.45)'
                          : '1px solid var(--border)',
                        borderLeft: `4px solid ${isHidden ? '#22c55e' : meta.hex}`,
                        opacity: isExtra ? 0.55 : 1,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Top row: Card Number + Secret + Hidden Toggle */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.45rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '3px 9px',
                              borderRadius: '6px',
                              backgroundColor: meta.hex,
                              color: col === 'yellow' || col === 'green' ? '#000' : '#fff',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Clue Card #{item.step}
                          </span>

                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontFamily: 'monospace',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {item.secret}
                          </span>

                          {isExtra && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                fontWeight: 700,
                              }}
                            >
                              Unused (Limit: {limit})
                            </span>
                          )}
                        </div>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            backgroundColor: isHidden ? '#22c55e' : 'transparent',
                            color: isHidden ? '#000' : 'var(--text-secondary)',
                            border: isHidden ? '1px solid #22c55e' : '1px solid var(--border)',
                          }}
                        >
                          {isHidden ? '✓ Hidden' : '○ Mark Hidden'}
                        </span>
                      </div>

                      {/* Solution / Hiding Location */}
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: isHidden ? '#86efac' : '#ffffff',
                          textDecoration: isHidden ? 'line-through' : 'none',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '6px',
                          lineHeight: 1.35,
                        }}
                      >
                        <span style={{ textDecoration: 'none', flexShrink: 0 }}>📍</span>
                        <span>{item.solution}</span>
                      </div>

                      {/* Riddle Text (Optional) */}
                      {showRiddles && (
                        <p
                          style={{
                            margin: '0.45rem 0 0 0',
                            fontSize: '0.78rem',
                            fontStyle: 'italic',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.45,
                          }}
                        >
                          &ldquo;{item.riddleText}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
