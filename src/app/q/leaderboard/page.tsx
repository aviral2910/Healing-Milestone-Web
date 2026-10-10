"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RoundColor } from '../data';
import { Trophy } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  relation: string;
  current_step: number;
  last_scanned_at: any;
}

export default function LeaderboardPage() {
  const [activeRound, setActiveRound] = useState<RoundColor | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  // 1. Listen to global game state to know which round is active
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'wedding_quest_settings', 'game_state'), (doc) => {
      if (doc.exists()) {
        setActiveRound(doc.data().active_round);
      }
    });
    return () => unsubSettings();
  }, []);

  // 2. Listen to players currently playing the active round
  useEffect(() => {
    if (!activeRound) {
      setPlayers([]);
      return;
    }

    const q = query(
      collection(db, 'wedding_quest_players'),
      where('active_round', '==', activeRound),
      orderBy('current_step', 'desc'),
      orderBy('last_scanned_at', 'asc')
    );

    const unsubPlayers = onSnapshot(q, (snapshot) => {
      const pData: Player[] = [];
      snapshot.forEach((doc) => {
        pData.push({ id: doc.id, ...doc.data() } as Player);
      });
      setPlayers(pData);
    });

    return () => unsubPlayers();
  }, [activeRound]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black uppercase tracking-widest mb-4">Live Leaderboard</h1>
          {activeRound ? (
            <div className={`inline-block px-6 py-2 rounded-full text-xl font-bold uppercase tracking-wider
              ${activeRound === 'yellow' ? 'bg-yellow-500 text-black' : 
                activeRound === 'green' ? 'bg-green-500 text-white' : 
                activeRound === 'pink' ? 'bg-pink-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {activeRound} Round Active
            </div>
          ) : (
            <div className="inline-block px-6 py-2 rounded-full bg-gray-800 text-gray-400 text-xl font-bold uppercase">
              Waiting for Anchor...
            </div>
          )}
        </div>

        <div className="space-y-4">
          {players.length === 0 && (
            <div className="text-center text-gray-500 py-12 text-xl">
              No players have scanned a clue for this round yet.
            </div>
          )}

          {players.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center p-6 rounded-2xl ${index === 0 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white transform scale-105 shadow-2xl' : 'bg-gray-800 border border-gray-700'}`}
            >
              <div className="w-12 h-12 flex items-center justify-center font-black text-2xl mr-6 opacity-50">
                #{index + 1}
              </div>
              
              <div className="flex-grow">
                <h2 className="text-2xl font-bold">{player.name}</h2>
                <p className={`text-sm ${index === 0 ? 'text-yellow-100' : 'text-gray-400'}`}>{player.relation}</p>
              </div>

              <div className="text-right flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs uppercase tracking-widest opacity-60 font-bold">Clue</span>
                  <span className="text-4xl font-black">{player.current_step}</span>
                </div>
                {index === 0 && <Trophy className="w-10 h-10 text-yellow-200" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
