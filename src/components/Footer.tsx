import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="banner-title" style={{ color: "var(--text-secondary)" }}>
            <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
            <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
          </div>
          <p className="footer-tagline">Nurturing hope and positivity, one milestone at a time.</p>
        </div>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="mailto:support@healingmilestones.in">Contact Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Healing Milestones. All rights reserved.
      </div>
    </footer>
  );
}
