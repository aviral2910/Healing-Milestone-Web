"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StoryCard({ story }: { story: any }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    
    setIsNavigating(true);
    // Programmatically navigate
    router.push(`/story/${story.id}`);
    
    // Note: We don't need to set isNavigating back to false because 
    // the component will unmount when the new page loads. 
    // If they go back, it will remount or restore state.
  };

  const hasImage = !!story.mainImage;

  return (
    <div 
      className={`glass-card story-card ${isNavigating ? "navigating" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {hasImage && (
        <div className="story-card-image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.mainImage} alt={story.heading || "Story"} className="story-card-img" />
          <div className="story-card-image-overlay"></div>
          <div className="story-card-badge">Featured</div>
        </div>
      )}
      
      <div className="story-card-content">
        <h3 className="story-card-title">{story.heading || "A Healing Milestone"}</h3>
        <p className="story-card-desc">
          {story.description 
            ? (story.description.length > 120 
                ? story.description.substring(0, 120) + "..." 
                : story.description) 
            : "Read about this amazing journey..."}
        </p>
        
        <div className="story-card-footer">
          {isNavigating ? (
            <div className="story-card-loader">
              <div className="spinner"></div>
              <span>Loading story...</span>
            </div>
          ) : (
            <span className="story-card-link-text">Read full story &rarr;</span>
          )}
        </div>
      </div>
    </div>
  );
}
