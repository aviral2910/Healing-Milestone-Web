import Link from "next/link";
import StoryCard from "@/components/StoryCard";
import StoriesCarousel from "@/components/StoriesCarousel";

async function getFeaturedStories() {
  try {
    const response = await fetch('https://healing-milestones-api.onrender.com/api/stories/?limit=5', {
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!response.ok) {
      console.error("Failed to fetch stories from FastAPI");
      return [];
    }
    
    const data = await response.json();
    return data.items.map((story: any) => ({
      id: story.id,
      mainImage: story.main_image || null,
      heading: story.heading || null,
      description: story.short_description || story.description || null
    }));
  } catch (error) {
    console.error("Error fetching featured stories:", error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredStories = await getFeaturedStories();

  return (
    <div className="home-wrapper">
      {/* 1. Header / Navbar */}
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

      {/* 2. Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Discover Hope</div>
          <h1 className="hero-title">
            Every Step Forward <br />
            <span className="text-gold">is a Milestone</span>
          </h1>
          <p className="hero-subtitle">
            Embrace positive thinking and celebrate your emotional and mental wellness journey. 
            You are never alone on the path to healing.
          </p>
          
          <div className="app-buttons">
            <button className="download-btn disabled" disabled>
              <div className="btn-icon">🍏</div>
              <div className="btn-text">
                <span className="small">Coming Soon</span>
                <span className="large">App Store</span>
              </div>
            </button>
            <button className="download-btn disabled" disabled>
              <div className="btn-icon">🤖</div>
              <div className="btn-text">
                <span className="small">Coming Soon</span>
                <span className="large">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* 3. Featured Stories Section */}
      {featuredStories.length > 0 && (
        <section className="featured-stories-section">
          <h2 className="section-title">Stories of Hope</h2>
          <p className="section-subtitle">Read real milestones shared by our community.</p>
          
          <StoriesCarousel 
            stories={featuredStories.map((story: any) => ({
              id: story.id,
              mainImage: story.mainImage || null,
              heading: story.heading || null,
              description: story.description || null
            }))} 
          />
        </section>
      )}

      {/* 4. Share Your Journey Section */}
      <section className="share-journey-section">
        <h2 className="section-title">
          Inspire Others with Your <span className="text-gold">Milestones</span>
        </h2>
        <p className="section-subtitle">
          Every path is unique, but no one has to walk it alone. By sharing your milestones—no matter how small—you inspire hope and light the way for others in our community.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/share-intro" className="share-journey-cta">
            Share Your Journey ➔
          </Link>
        </div>
      </section>

      {/* 5. Community Section */}
      <section className="community-section">
        <div className="community-container">
          <h2 className="section-title">Join Our Community</h2>
          <p className="section-subtitle">
            Connect with others, share your experiences, and find daily inspiration in our safe and supportive groups.
          </p>
          <div className="community-cards">
            <a href="https://t.me/+Ex7lEfq3s-U5Nzk1" target="_blank" rel="noopener noreferrer" className="glass-card community-link">
              <div className="community-icon telegram">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/telegram.svg" alt="Telegram Logo" style={{ width: "64px", height: "64px" }} />
              </div>
              <h3>Telegram Group</h3>
              <p>Join the conversation and connect globally.</p>
            </a>
            <a href="https://chat.whatsapp.com/JN3iZDXnVb9HgkbbEGwzv4?mode=gi_t" target="_blank" rel="noopener noreferrer" className="glass-card community-link">
              <div className="community-icon whatsapp">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/whatsapp.svg" alt="WhatsApp Logo" style={{ width: "64px", height: "64px" }} />
              </div>
              <h3>WhatsApp Group</h3>
              <p>Get daily updates and share your milestones.</p>
            </a>
            <a href="https://www.instagram.com/healingmilestones/" target="_blank" rel="noopener noreferrer" className="glass-card community-link">
              <div className="community-icon instagram">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/instagram.svg" alt="Instagram Logo" style={{ width: "64px", height: "64px" }} />
              </div>
              <h3>Instagram</h3>
              <p>Follow us for daily inspiration.</p>
            </a>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
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
    </div>
  );
}
