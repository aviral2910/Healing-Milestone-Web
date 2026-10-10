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
        <img 
          src="/logo.png" 
          alt="Healing Milestones Logo" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Celebrate love, celebrate health.
        </p>
        <p style={{ color: 'var(--primary)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
          Powered by Healing Milestones
        </p>
      </footer>
    </div>
  );
}
