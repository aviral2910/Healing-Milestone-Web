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
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <img 
            src="/logo.png" 
            alt="Healing Milestones Logo" 
            style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
          />
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            margin: 0, 
            color: 'var(--primary)',
            letterSpacing: '0.5px'
          }}>
            Healing Milestones
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>
          Celebrate love, celebrate health.
        </p>
      </footer>
    </div>
  );
}
