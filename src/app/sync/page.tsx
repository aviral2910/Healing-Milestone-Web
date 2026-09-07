'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function SyncRedirect() {
  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', marginBottom: '24px' }} />
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px' }}>Open in App</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        To sync this content, please open this link using the Healing Milestones mobile app.
      </p>
      
      <a href="https://healingmilestones.in" className="download-btn" style={{ padding: '12px 32px', fontSize: '1.1rem', textDecoration: 'none' }}>
        Download the App
      </a>
      
      <Link href="/" style={{ marginTop: '24px', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
        Return Home
      </Link>
    </div>
  );
}
