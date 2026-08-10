import { Metadata } from "next";
import Link from "next/link";
import StoriesCarousel from "@/components/StoriesCarousel";
import "./user-profile.css"; 

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

// 1. Fetch User Data
async function getUserData(userId: string) {
  try {
    const response = await fetch(`https://healing-milestones-api.onrender.com/api/users/${userId}`, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { id: userId, ...data };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// 2. Fetch User's Stories
async function getUserStories(userId: string) {
  try {
    const response = await fetch(`https://healing-milestones-api.onrender.com/api/users/${userId}/stories`, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.items || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching user stories:", error);
    return [];
  }
}

// 3. Generate Metadata for SEO/OpenGraph
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserData(id);

  if (!user) {
    return {
      title: "User Not Found | Healing Milestones",
    };
  }

  return {
    title: `${user.displayName}'s Profile | Healing Milestones`,
    description: user.bio || `Check out ${user.displayName}'s profile and stories on Healing Milestones.`,
    openGraph: {
      title: `${user.displayName}'s Profile | Healing Milestones`,
      description: user.bio || `Check out ${user.displayName}'s profile and stories on Healing Milestones.`,
      images: [user.profilePicture || "https://healingmilestones.in/logo.png"],
    },
  };
}

export default async function UserProfile({ params }: Props) {
  const { id } = await params;
  const user = await getUserData(id);
  
  if (!user) {
    return (
      <div className="not-found-container">
        <h1>User Not Found</h1>
        <p>The profile you are looking for does not exist.</p>
        <Link href="/" className="btn-primary">Go to Home</Link>
      </div>
    );
  }

  const userStories = await getUserStories(id);

  return (
    <div className="profile-page-wrapper">
      {/* Smart Banner for App Install */}
      <div className="app-install-banner">
        <div className="banner-content">
          <div className="banner-text">
            <strong>Get the full experience</strong>
            <p>Open in the Healing Milestones App!</p>
          </div>
          {/* Generic fallback to home or a download link */}
          <Link href="/" className="btn-download">Open App</Link>
        </div>
      </div>

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

      <main className="profile-main" style={{ paddingBottom: '20px' }}>
        {/* Profile Info Section */}
        <div className="profile-header-card glass-card">
          <div className="profile-avatar">
            {user.profilePicture ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profilePicture} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder">{user.displayName.charAt(0)}</div>
            )}
          </div>
          
          <h1 className="profile-name">
            {user.displayName}
            {user.isVerified && (
              <span className="verified-badge" title="Verified">✓</span>
            )}
          </h1>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userStories.length}</span>
              <span className="stat-label">Stories</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.followersCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
          
          {user.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
      </main>

      {/* Stories Section outside of max-width container */}
      <section className="featured-stories-section" style={{ paddingBottom: '120px' }}>
        <h2 className="section-title">Stories by {user.displayName}</h2>
        
        {userStories.length > 0 ? (
          <StoriesCarousel 
            stories={userStories.map((story: any) => ({
              id: story.id,
              mainImage: story.mainImage || null,
              heading: story.heading || null,
              description: story.description || null
            }))} 
          />
        ) : (
          <div className="empty-state glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p>This user hasn't published any stories yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
