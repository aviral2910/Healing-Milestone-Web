import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

async function getFeaturedStories() {
  try {
    // 1. Fetch the list of featured story IDs from a settings document
    // You can manage this document in Firestore: collection "settings", doc "homepage"
    // with a field "featuredStoryIds" (array of strings)
    const settingsRef = doc(db, "settings", "homepage");
    const settingsSnap = await getDoc(settingsRef);
    
    let storyIds: string[] = [];
    if (settingsSnap.exists() && settingsSnap.data().featuredStoryIds) {
      storyIds = settingsSnap.data().featuredStoryIds;
    } else {
      // Fallback: Just return empty array if document doesn't exist yet
      return [];
    }

    // 2. Fetch the actual stories
    const stories = [];
    for (const id of storyIds) {
      const storyRef = doc(db, "stories", id);
      const storySnap = await getDoc(storyRef);
      if (storySnap.exists()) {
        stories.push({ id, ...storySnap.data() });
      }
    }
    
    return stories;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="banner-logo" />
          <div className="banner-title">
            <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
            <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
          </div>
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

      {/* 3. Community Section */}
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
          </div>
        </div>
      </section>

      {/* 4. Featured Stories Section */}
      {featuredStories.length > 0 && (
        <section className="featured-stories-section">
          <h2 className="section-title">Stories of Hope</h2>
          <p className="section-subtitle">Read real milestones shared by our community.</p>
          
          <div className="stories-carousel">
            {featuredStories.map((story: any) => (
              <Link href={`/story/${story.id}`} key={story.id} className="glass-card story-card-link">
                {story.mainImage && (
                  <div className="story-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.mainImage} alt={story.heading || "Story"} />
                  </div>
                )}
                <div className="story-card-content">
                  <h3 className="story-card-title">{story.heading || "A Healing Milestone"}</h3>
                  <p className="story-card-desc">
                    {story.description ? (story.description.length > 100 ? story.description.substring(0, 100) + "..." : story.description) : ""}
                  </p>
                  <div className="story-card-footer">
                    <span>Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Healing Milestones. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
