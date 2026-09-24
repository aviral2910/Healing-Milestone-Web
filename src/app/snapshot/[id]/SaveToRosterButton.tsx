'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SaveToRosterButton({ mixViewId, viewName }: { mixViewId: string, viewName: string }) {
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  if (loading || !user) return null; // Only show to logged in users

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await user.getIdToken();
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
        setSaved(true);
      } else {
        console.error("Failed to save to roster", await res.text());
        alert("Failed to save patient. They may already be in your roster.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving patient.");
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <button 
        onClick={() => router.push('/connect')}
        style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
      >
        ✓ Saved to HM Connect
      </button>
    );
  }

  return (
    <button 
      onClick={handleSave}
      disabled={saving}
      style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.95rem', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }}
    >
      {saving ? 'Saving...' : '➕ Save to HM Connect'}
    </button>
  );
}
