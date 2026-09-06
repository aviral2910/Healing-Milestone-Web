import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

async function getJourney(id: string) {
  try {
    const response = await fetch(`https://healing-milestones-api.onrender.com/api/journeys/${id}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching journey:", error);
  }
  return null;
}

async function getMilestones(id: string) {
  try {
    const response = await fetch(`https://healing-milestones-api.onrender.com/api/milestones/?journey_id=${id}&is_public=true`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching milestones:", error);
  }
  return [];
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const journey = await getJourney(id);

  let title = "Healing Milestones Journey";
  let desc = "Follow this healing journey.";
  let images = ["https://healingmilestones.in/logo.png"];

  if (journey) {
    if (journey.title) title = journey.title;
    if (journey.description) desc = journey.description;
  }

  return {
    title: `${title} - Healing Milestones`,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      url: `https://healingmilestones.in/journey/${id}`,
      siteName: "Healing Milestones",
      images: [
        {
          url: images[0],
          width: 800,
          height: 800,
          alt: title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: desc,
      images: images,
    },
  };
}

export default async function JourneyPage({ params }: Props) {
  const { id } = await params;
  
  // 1. Fetch Journey
  const journey = await getJourney(id);

  if (!journey) {
    return notFound();
  }
  
  const authorName = journey.author_name || "User";
  const authorPicture = journey.author_avatar || "";
  
  // 2. Fetch Milestones
  const milestones = await getMilestones(id) || [];

  const dateStr = journey.created_at
    ? new Date(journey.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <>
      <div className="banner">
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
        <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
          <button className="download-btn">Download the App</button>
        </a>
      </div>
      
      {/* Immersive Hero Section */}
      <div className="story-hero-section" style={{ minHeight: '40vh' }}>
        <div className="hero-bg-blur" style={{ backgroundColor: '#1a1a1a' }}></div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, #09090b 100%)' }}></div>
        <div className="hero-content" style={{ bottom: '20px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Milestone Journey
          </div>
          <h1 className="hero-title">{journey.title}</h1>
          <div className="hero-meta">
            <div className="author-badge">
              {authorPicture ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={authorPicture} alt={authorName} className="author-avatar-small" />
              ) : (
                <div className="author-avatar-small placeholder">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="author-name">By {authorName}</span>
            </div>
            <span className="meta-dot">•</span>
            <span className="meta-date">Started {dateStr}</span>
          </div>
          {journey.description && (
             <p style={{ marginTop: '16px', color: '#ccc', maxWidth: '600px', lineHeight: '1.6' }}>
               {journey.description}
             </p>
          )}
        </div>
      </div>

      <main className="story-container">
        <div className="milestones-timeline" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            Journey Timeline ({milestones.length})
          </h2>
          
          {milestones.length > 0 ? (
            <div className="timeline-container" style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '0', width: '2px', backgroundColor: 'var(--border)' }}></div>
              
              {milestones.map((milestone: any) => {
                const isClosure = milestone.is_closure;
                const mDateStr = milestone.created_at
                  ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(milestone.created_at))
                  : '';
                
                return (
                  <div key={milestone.id} className="milestone-card" style={{ position: 'relative', marginBottom: '2rem' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-2rem', 
                      top: '6px', 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: isClosure ? '#22c55e' : 'var(--primary)',
                      boxShadow: `0 0 10px ${isClosure ? 'rgba(34,197,94,0.5)' : 'var(--glow)'}`
                    }}></div>
                    
                    <div style={{
                      backgroundColor: 'var(--surface)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: '600', color: isClosure ? '#22c55e' : 'var(--text-primary)' }}>
                          {isClosure ? 'Journey Completed' : 'Update'}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {mDateStr}
                        </div>
                      </div>
                      
                      {milestone.media_url && (
                        <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={milestone.media_url} alt="Milestone media" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                      )}
                      
                      {milestone.content && (
                        <div style={{ color: '#eaeaea', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {milestone.content}
                        </div>
                      )}
                      
                      <div style={{ 
                        marginTop: '1.5rem', 
                        paddingTop: '1rem', 
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        gap: '1.5rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '1.1rem' }}>❤️</span>
                          <span>{milestone.reaction_count || 0}</span>
                        </div>
                        {milestone.are_comments_enabled && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>💬</span>
                            <span>{milestone.comment_count || 0}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-milestones" style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>
              No public milestones available on this journey yet.
            </div>
          )}
          
          <div className="interaction-prompt" style={{ marginTop: '24px', textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Want to Follow {authorName}'s Journey?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Download the Healing Milestones App to follow, react, and send supportive comments directly to {authorName}.
            </p>
            <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
              <button className="download-btn" style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 'bold' }}>Get the App</button>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
