import React from 'react';

export default function QuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <main style={{ flexGrow: 1, width: '100%', maxWidth: '450px', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          width: '100%'
        }}>
          {children}
        </div>
      </main>
      
      {/* Option 4: Branding & App Companion Footer */}
      <footer style={{
        width: '100%',
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Brand in ONE line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <img 
            src="/logo.png" 
            alt="Healing Milestones Logo" 
            style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
          />
          <span style={{ 
            fontFamily: "'Oswald', sans-serif", 
            fontWeight: 500, 
            fontSize: '1.05rem', 
            color: '#ffffff', 
            letterSpacing: '0.8px',
            textTransform: 'uppercase'
          }}>
            HEALING MILESTONES
          </span>
        </div>

        <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
          Celebrate Love • Track Your Health
        </p>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, maxWidth: '320px', lineHeight: '1.4' }}>
          Your companion for life's most meaningful health journeys.
        </p>

        <a 
          href="https://healingmilestones.in" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: 'var(--primary)', 
            fontSize: '0.8rem', 
            textDecoration: 'none', 
            fontWeight: 700,
            letterSpacing: '0.5px',
            marginTop: '4px'
          }}
        >
          healingmilestones.in ↗
        </a>
      </footer>
    </div>
  );
}
