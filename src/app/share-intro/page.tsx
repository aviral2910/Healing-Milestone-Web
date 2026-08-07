'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppBar from '@/components/AppBar';
import Footer from '@/components/Footer';

export default function ShareIntroPage() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    // Calculate the width of each card + gap. Roughly, the container width.
    const scrollWidth = e.currentTarget.scrollWidth;
    const clientWidth = e.currentTarget.clientWidth;
    // Calculate index based on scroll position
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    
    // There are 3 cards, so 0, 1, or 2
    const percentage = scrollLeft / maxScroll;
    let index = 0;
    if (percentage > 0.75) index = 2;
    else if (percentage > 0.25) index = 1;
    
    if (index !== activeCardIndex) {
      setActiveCardIndex(index);
    }
  };

  return (
    <>
    <AppBar />
    <div className="share-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="share-form-container" style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', fontFamily: 'Oswald, sans-serif', marginBottom: '1rem' }}>
            Your Story Can Light the Way for <span style={{ color: 'var(--primary)' }}>Someone Else</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
            Welcome to <strong style={{ color: 'white' }}>Healing Milestones</strong>. We are building a global sanctuary for healing—a place where real experiences, struggles, and breakthroughs are shared to provide <strong style={{ color: 'white' }}>hope</strong> and guide others who feel lost in the dark.
          </p>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center' }}>Why Share Your Journey?</h2>
          
          <div 
            onScroll={handleScroll}
            style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory', 
            gap: '1rem', 
            paddingBottom: '1rem',
            paddingTop: '0.5rem',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none'  /* IE and Edge */
          }}>
            {/* Hide scrollbar for Chrome, Safari and Opera is usually done in CSS, but inline hiding is tricky, so we rely on gap/padding */}
            
            <div style={{ scrollSnapAlign: 'center', flex: '0 0 85%', maxWidth: '300px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🤝</div>
              <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>End the Isolation</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: 400 }}>
                Your hardest moments might be exactly what someone else is going through right now. Knowing they aren't alone can save a life and provide hope.
              </p>
            </div>

            <div style={{ scrollSnapAlign: 'center', flex: '0 0 85%', maxWidth: '300px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>💡</div>
              <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Share What Works</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: 400 }}>
                Did a specific therapy, mindset shift, or resource help you turn the corner? Your "Finding" could be the missing piece to someone else's puzzle.
              </p>
            </div>

            <div style={{ scrollSnapAlign: 'center', flex: '0 0 85%', maxWidth: '300px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🌱</div>
              <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Heal Through Sharing</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: 400 }}>
                Speaking your truth and reflecting on your growth is a powerful milestone in your own healing journey.
              </p>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activeCardIndex === idx ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
        
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'center', fontStyle: 'italic' }}>
              Whether you've fully healed, or you're simply celebrating a small victory today—<strong>your story matters.</strong> You have the option to remain completely anonymous if you choose.
            </p>
          </div>

        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/share" 
            style={{ 
              display: 'inline-block',
              padding: '1.2rem 3rem', 
              backgroundColor: 'var(--primary)', 
              color: '#000', 
              borderRadius: '50px', 
              textDecoration: 'none', 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px var(--glow)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
