with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'w') as f:
    f.write("""'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Loader2 } from 'lucide-react';

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
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(34, 197, 94, 0.1)', 
          color: '#22c55e', 
          border: '1px solid rgba(34, 197, 94, 0.2)', 
          padding: '10px 20px', 
          borderRadius: '50px', 
          cursor: 'pointer', 
          fontWeight: '600', 
          fontSize: '0.95rem',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Check size={18} strokeWidth={3} />
        Saved to Roster
      </button>
    );
  }

  return (
    <button 
      onClick={handleSave}
      disabled={saving}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        background: 'linear-gradient(135deg, var(--primary) 0%, #b89326 100%)', 
        color: '#000', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '50px', 
        cursor: saving ? 'not-allowed' : 'pointer', 
        fontWeight: '700', 
        fontSize: '0.95rem', 
        opacity: saving ? 0.7 : 1, 
        boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseOver={(e) => {
        if (!saving) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
        }
      }}
      onMouseOut={(e) => {
        if (!saving) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.25)';
        }
      }}
    >
      {saving ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Plus size={18} strokeWidth={3} />
      )}
      {saving ? 'Saving...' : 'Save to HM Connect'}
    </button>
  );
}
""")
