import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Healing Milestones",
  description: "Terms of Service for Healing Milestones",
};

export default function TermsOfService() {
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
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="legal-body">
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using Healing Milestones, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site/app.</p>

            <h2>2. User Content &amp; Conduct</h2>
            <p>Our platform allows users to post stories, milestones, and comments. You retain all rights in, and are solely responsible for, the User Content you post to Healing Milestones.</p>
            <ul>
              <li>You agree not to post any content that is abusive, threatening, defamatory, obscene, or otherwise objectionable.</li>
              <li>You agree to respect the privacy and boundaries of other community members.</li>
              <li><strong>Verification Badges:</strong> If you apply for a professional or organizational verification badge, you must provide accurate and current credentials. We reserve the right to revoke a verification badge at any time if we determine the credentials provided are false, or if your conduct violates community guidelines.</li>
              <li>We reserve the right to remove any content or terminate accounts that violate these terms.</li>
            </ul>

            <h2>3. Intellectual Property</h2>
            <p>The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Healing Milestones and its licensors.</p>

            <h2>4. Disclaimer</h2>
            <p>Healing Milestones is a platform for sharing personal journeys and community support. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>

            <h2>5. Limitations</h2>
            <p>In no event shall Healing Milestones or its suppliers be liable for any damages arising out of the use or inability to use the materials on Healing Milestones.</p>

            <h2>6. Revisions and Errata</h2>
            <p>The materials appearing on Healing Milestones could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our platform are accurate, complete, or current.</p>

            <h2>7. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at support@healingmilestones.in.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
