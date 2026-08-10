'use client';

import { useState } from 'react';
import AppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import { StoryType, StorySubmissionPhase } from '@/lib/models/storySubmission';
import Link from 'next/link';

export default function ShareStoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phoneNumber: (formData.get('phoneNumber') as string) || null,
      isAnonymous: formData.get('isAnonymous') === 'true',
      preferredName: (formData.get('preferredName') as string) || null,
      theme: formData.get('theme') as string,
      mainStory: formData.get('mainStory') as string,
      theStruggle: (formData.get('theStruggle') as string) || null,
      theTurningPoint: (formData.get('theTurningPoint') as string) || null,
      theLesson: (formData.get('theLesson') as string) || null,
      keywords: (formData.get('keywords') as string) || null,
    };

    try {
      const response = await fetch('https://healing-milestones-api.onrender.com/api/stories/submit_web', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit story: ${response.statusText}`);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || 'An error occurred.');
    }
    setIsSubmitting(false);
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', width: '100%', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 8px 32px var(--glow)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💛</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)', fontFamily: 'Oswald, sans-serif' }}>Thank You!</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Your story has been safely received. Our team will review and prepare it for publishing.
          </p>

          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--primary)', marginBottom: '2.5rem', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>What happens next?</h3>
            <ul style={{ color: 'white', fontSize: '1rem', lineHeight: '1.6', margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>We may reach out to you from <strong>support@healingmilestones.in</strong> if we need any further information.</li>
              <li>Your story will be featured in our official <strong>Healing Milestones app</strong>, launching very soon!</li>
            </ul>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1.2rem' }}>Join our Community</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/+Ex7lEfq3s-U5Nzk1" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '30px', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/telegram.svg" alt="Telegram" style={{ width: '24px', height: '24px' }} />
                Telegram
              </a>
              <a href="https://chat.whatsapp.com/JN3iZDXnVb9HgkbbEGwzv4?mode=gi_t" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '30px', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/whatsapp.svg" alt="WhatsApp" style={{ width: '24px', height: '24px' }} />
                WhatsApp
              </a>
              <a href="https://www.instagram.com/healingmilestones/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '30px', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/instagram.svg" alt="Instagram" style={{ width: '24px', height: '24px' }} />
                Instagram
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setSuccess(false);
                setError(null);
              }} 
              style={{ padding: '0.8rem 1.5rem', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
              Submit Another Story
            </button>
            <Link href="/" style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary)', color: '#000', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <AppBar />
    <div className="share-page-wrapper">
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {!success && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', fontFamily: 'Oswald, sans-serif', marginBottom: '1rem' }}>
                Share Your <span style={{ color: 'var(--primary)' }}>Journey</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                We are building a safe space to share milestones, findings, and raise awareness. Share your journey with us to inspire others.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="share-form-container">
              {error && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', color: 'white', marginBottom: '2rem' }}>
                  {error}
                </div>
              )}

              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>1. Contact Info</h2>
              
              <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input type="text" name="name" required style={inputStyle} placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" name="email" required style={inputStyle} placeholder="We will contact you here if needed" />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number (Optional)</label>
                  <input type="tel" name="phoneNumber" style={inputStyle} placeholder="Optional" />
                </div>
                <div>
                  <label style={labelStyle}>Would you like to stay anonymous? *</label>
                  <select name="isAnonymous" required style={inputStyle}>
                    <option value="false">No, you can use my name</option>
                    <option value="true">Yes, please keep me anonymous</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Preferred Name (Optional)</label>
                  <input type="text" name="preferredName" style={inputStyle} placeholder="If anonymous, we can use a nickname" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>2. Your Story</h2>

              <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <label style={labelStyle}>Title (one short sentence) *</label>
                  <input type="text" name="theme" required style={inputStyle} placeholder="e.g. Overcoming panic attacks, living with ADHD" />
                </div>
                <div>
                  <label style={labelStyle}>Main Story *</label>
                  <textarea name="mainStory" required style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} placeholder="What happened, how did you feel, and what was the outcome? Don't worry about perfect grammar!" />
                </div>
                <div>
                  <label style={labelStyle}>The Struggle (Optional)</label>
                  <textarea name="theStruggle" style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="What was the hardest part?" />
                </div>
                <div>
                  <label style={labelStyle}>The Turning Point (Optional)</label>
                  <textarea name="theTurningPoint" style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="What helped you get through it?" />
                </div>
                <div>
                  <label style={labelStyle}>The Lesson (Optional)</label>
                  <textarea name="theLesson" style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="What would you tell yourself looking back?" />
                </div>
                <div>
                  <label style={labelStyle}>Keywords / Topics (Optional)</label>
                  <input type="text" name="keywords" style={inputStyle} placeholder="e.g. Anxiety, Therapy, Meditation, Chronic Pain" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary)', color: '#000', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.3s ease' }}>
                {isSubmitting ? 'Submitting...' : 'Submit Story'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  fontWeight: 500,
};

const inputStyle = {
  width: '100%',
  padding: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none',
  fontFamily: 'inherit',
};
