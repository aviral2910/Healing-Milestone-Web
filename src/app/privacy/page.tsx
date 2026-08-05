import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Healing Milestones",
  description: "Privacy Policy for Healing Milestones",
};

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <header className="home-header" style={{ position: 'relative', top: 0 }}>
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

      <main className="legal-main">
        <div className="glass-card legal-content">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="legal-body">
            <h2>1. Introduction</h2>
            <p>Welcome to Healing Milestones. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile application, website, and related services.</p>
            
            <h2>2. Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
            <ul>
              <li><strong>Personal Info:</strong> Name, email address, profile picture, and social links.</li>
              <li><strong>Verification Data:</strong> For professionals and organizations applying for a verification badge, we may collect proof of identity, professional certifications, licenses, and organizational affiliation documents.</li>
              <li><strong>User Content:</strong> Stories, milestones, comments, and interactions you post on the platform.</li>
              <li><strong>Usage Data:</strong> Information on how the Service is accessed and used.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect or receive:</p>
            <ul>
              <li>To facilitate account creation and logon process.</li>
              <li>To review and process verification badge applications.</li>
              <li>To post testimonials and stories with your consent.</li>
              <li>To request feedback and contact you about your use of our App.</li>
              <li>To protect our Services and ensure a safe community.</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Public profiles and stories are visible to the public as per your privacy settings.</p>

            <h2>5. Data Security</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>

            <h2>6. Contact Us</h2>
            <p>If you have questions or comments about this notice, you may email us at support@healingmilestones.in.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
