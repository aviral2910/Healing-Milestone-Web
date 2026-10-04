import { UserBadge } from '@/components/UserBadge';
import { Metadata } from "next";
import Link from "next/link";
import StoriesCarousel from "@/components/StoriesCarousel";
import ProfileTabs from "./ProfileTabs";
import FollowButton from "@/components/FollowButton";
import "./user-profile.css";
import AuthAwareLogo from '@/components/AuthAwareLogo';
 

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
    title: `${user.displayName || "User"}'s Profile | Healing Milestones`,
    description: user.bio || `Check out ${user.displayName || "User"}'s profile and stories on Healing Milestones.`,
    openGraph: {
      title: `${user.displayName || "User"}'s Profile | Healing Milestones`,
      description: user.bio || `Check out ${user.displayName || "User"}'s profile and stories on Healing Milestones.`,
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

      <header className="banner" style={{ position: 'relative', top: 0 }}>
        <AuthAwareLogo />
      </header>

      <main className="profile-main" style={{ paddingBottom: '20px' }}>
        {/* Profile Info Section */}
        <div className="profile-header-card glass-card">
          <div className="profile-avatar">
            {user.profilePicture ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profilePicture} alt={user.displayName || "User"} />
            ) : (
              <div className="avatar-placeholder">{(user.displayName || "?").charAt(0).toUpperCase()}</div>
            )}
          </div>
          
          <h1 className="profile-name">
            {user.displayName || "Unknown"}
            <UserBadge role={user.role} isVerified={user.isVerified} size={24} style={{ marginLeft: '12px' }} />
          </h1>
          <FollowButton targetUserId={user.userId || id} />
          
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

      {/* Tabbed Profile Sections (Client Component for Auth) */}
      <ProfileTabs 
        userId={user.userId || id} 
        authorName={user.displayName || "Unknown"}
        initialStories={userStories.map((story: any) => ({
          id: story.id,
          mainImage: story.mainImage || null,
          heading: story.heading || null,
          description: story.description || null
        }))} 
      />
    </div>
  );
}
