'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Plus, Check, Loader2, X } from 'lucide-react';

export default function SaveToRosterButton({ mixViewId, viewName }: { mixViewId: string, viewName: string }) {
  const { user, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(true);
  const [rosterId, setRosterId] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    async function checkRoster() {
      if (!user) {
        setChecking(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster?limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const rosterData = await res.json();
          const items = rosterData.items || rosterData;
          const savedItem = items.find((item: any) => item.mix_view_id === mixViewId);
          if (savedItem) {
            setSaved(true);
            setRosterId(savedItem.id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    }
    checkRoster();
  }, [user, mixViewId]);

  if (authLoading || !user || checking) return null; // Only show to logged in users, wait for check

  const toggleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const token = await user.getIdToken();

      if (saved && rosterId) {
        // Unsave
        const res = await fetch(`https://healing-milestones-api.onrender.com/api/connect/roster/${rosterId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setSaved(false);
          setRosterId(null);
        } else {
          alert("Failed to remove from roster.");
        }
      } else {
        // Save
        const res = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mix_view_id: mixViewId,
            patient_alias: viewName,
          })
        });

        if (res.ok) {
          const newItem = await res.json();
          setRosterId(newItem.id);
          setSaved(true);
        } else {
          alert("Failed to save patient.");
        }
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <button 
        onClick={toggleSave}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={saving}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: hovered ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
          color: hovered ? '#ef4444' : 'var(--primary)', 
          border: hovered ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(212, 175, 55, 0.3)', 
          padding: '10px 20px', 
          borderRadius: '50px', 
          cursor: saving ? 'not-allowed' : 'pointer', 
          fontWeight: '600', 
          fontSize: '0.95rem',
          transition: 'all 0.2s ease-in-out',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : (hovered ? <X size={18} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />)}
        {saving ? 'Removing...' : (hovered ? 'Remove from Roster' : 'Saved to Roster')}
      </button>
    );
  }

  return (
    <button 
      onClick={toggleSave}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={saving}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        background: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
        color: '#fff', 
        border: hovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)', 
        padding: '10px 20px', 
        borderRadius: '50px', 
        cursor: saving ? 'not-allowed' : 'pointer', 
        fontWeight: '600', 
        fontSize: '0.95rem', 
        opacity: saving ? 0.7 : 1, 
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {saving ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Plus size={18} strokeWidth={3} />
      )}
      {saving ? 'Saving...' : 'Save to Roster'}
    </button>
  );
}
