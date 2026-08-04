import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

async function getStory(id: string) {
  try {
    const docRef = doc(db, "stories", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching story:", error);
  }
  return null;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);

  if (!story) {
    return {
      title: "Story Not Found - Healing Milestones",
    };
  }

  const title = story.heading || "A Healing Milestone";
  const desc = story.description ? (story.description.length > 160 ? story.description.substring(0, 160) + "..." : story.description) : "Read this story on Healing Milestones.";

  const images = story.mainImage 
    ? [story.mainImage] 
    : ["https://healingmilestones.in/logo.png"];

  return {
    title: `${title} - Healing Milestones`,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      images: images,
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
  
  // Fetch Author
  let authorName = "User";
  if (story.authorId && story.displayAuthorName) {
    try {
      const authorRef = doc(db, "users", story.authorId);
      const authorSnap = await getDoc(authorRef);
      if (authorSnap.exists()) {
        authorName = authorSnap.data().displayName || "User";
      }
    } catch (e) {
      console.error("Error fetching author", e);
    }
  }

  const reactions = story.reactions || {};
  const likesCount = story.likesCount || 0;

  // 2. Fetch Comments
  let commentsList: any[] = [];
  try {
    const commentsRef = collection(db, "stories", id, "comments");
    const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
    const commentsSnap = await getDocs(commentsQuery);
    
    const userCache: Record<string, any> = {};

    for (const commentDoc of commentsSnap.docs) {
      const commentData = commentDoc.data();
      const userId = commentData.userId;
      
      // 3. Fetch User data for comment
      if (userId && !userCache[userId]) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          userCache[userId] = userSnap.data();
        }
      }

      commentsList.push({
        id: commentDoc.id,
        text: commentData.commentText,
        createdAt: commentData.createdAt?.toDate(),
        user: userCache[userId] || { displayName: "Anonymous" }
      });
    }
  } catch (e) {
    console.error("Error fetching comments", e);
  }

  const dateStr = story.publishedAt && story.publishedAt.seconds 
    ? new Date(story.publishedAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <>
      <div className="banner">
        <div className="banner-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="banner-logo" />
          <div className="banner-title">
            <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
            <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
          </div>
        </div>
        <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
          <button className="download-btn">Download the App</button>
        </a>
      </div>
      <main className="story-container">
        <h1 className="story-title">{story.heading}</h1>
        <div className="story-meta">
          <span>By {story.displayAuthorName ? authorName : "Anonymous"}</span>
          <span>•</span>
          <span>{dateStr}</span>
        </div>
        
        {story.mainImage && (
          <div className="story-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={story.mainImage} 
              alt="Story cover" 
              className="story-image"
            />
          </div>
        )}
        
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
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(comment.createdAt)}
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
