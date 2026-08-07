import Link from 'next/link';

export default function AppBar() {
  return (
    <header className="home-header">
      <div className="banner-brand">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="banner-logo" />
          <div className="banner-title">
            <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
            <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
