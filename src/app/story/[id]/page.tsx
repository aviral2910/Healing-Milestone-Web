import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

async function getStory(id: string) {
  try {
    const response = await fetch(`https://healing-milestones-api.onrender.com/api/stories/${id}`, {
      next: { revalidate: 60 }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching story:", error);
  }
  return null;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);

  let title = "Healing Milestones";
  let desc = "Read a story of hope and positivity.";
  let images = ["https://healingmilestones.in/logo.png"];

  if (story) {
    if (story.heading) title = story.heading;
    if (story.description) desc = story.description;
    if (story.mainImage) images = [story.mainImage];
  }

  return {
    title: `${title} - Healing Milestones`,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      url: `https://healingmilestones.in/story/${id}`,
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

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  
  // 1. Fetch Story
  const story = await getStory(id);

  if (!story) {
    return notFound();
  }
  
  const authorName = story.authorName || "User";
  const authorPicture = story.authorPicture || "";
  const reactions = story.reactions || {};
  const likesCount = story.likesCount || 0;

  // 2. Fetch Comments
  let commentsList: any[] = [];
  try {
    const commentsRes = await fetch(`https://healing-milestones-api.onrender.com/api/stories/${id}/comments`, {
      next: { revalidate: 60 }
    });
    if (commentsRes.ok) {
      const data = await commentsRes.json();
      commentsList = data.items || [];
    }
  } catch (e) {
    console.error("Error fetching comments", e);
  }

  const dateStr = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
      {/* Full-width Immersive Hero Section */}
      <div className="story-hero-section">
        {story.mainImage && (
          <>
            <div className="hero-bg-blur" style={{ backgroundImage: `url(${story.mainImage})` }}></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.mainImage} alt="Story Cover" className="hero-main-img" />
          </>
        )}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{story.heading}</h1>
          <div className="hero-meta">
            <div className="author-badge">
              {authorPicture ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={authorPicture} alt={authorName} className="author-avatar-small" />
              ) : (
                <div className="author-avatar-small placeholder">
                  {story.displayAuthorName && authorName ? authorName.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <span className="author-name">By {story.displayAuthorName ? authorName : "Anonymous"}</span>
            </div>
            <span className="meta-dot">•</span>
            <span className="meta-date">{dateStr}</span>
          </div>
        </div>
      </div>

      <main className="story-container">
        <div className="story-content">
          {story.description}
        </div>

        {/* Reactions Section */}
        {(likesCount > 0 || Object.keys(reactions).length > 0) && (
          <div className="reactions-container">
            <div className="reactions-title">Reactions</div>
            <div className="reactions-list">
              {likesCount > 0 && (
                <div className="reaction-badge">
                  <span>❤️</span>
                  <span className="reaction-count">{likesCount}</span>
                </div>
              )}
              {Object.entries(reactions).map(([emoji, users]: [string, any]) => (
                users.length > 0 && (
                  <div key={emoji} className="reaction-badge">
                    <span>{emoji}</span>
                    <span className="reaction-count">{users.length}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="comments-section">
          <h2 className="comments-title">
            Comments {commentsList.length > 0 && `(${commentsList.length})`}
          </h2>
          
          {commentsList.length > 0 ? (
            <div className="comments-list">
              {commentsList.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-avatar">
                    {comment.user.profilePicture ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={comment.user.profilePicture} alt={comment.user.displayName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {comment.user.displayName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.user.displayName}</span>
                      {comment.createdAt && (
                        <span className="comment-date">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(comment.createdAt))}
                        </span>
                      )}
                    </div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">No comments yet.</div>
          )}
          
          <div className="interaction-prompt" style={{ marginTop: '24px' }}>
            <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
              Join the conversation on the Healing Milestones App
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
