'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark, Loader2 } from 'lucide-react';

export default function BookmarkButton({ storyId }: { storyId: string }) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const token = await user.getIdToken();
        // Fetch user profile securely to get their bookmarks
        const res = await fetch(`https://healing-milestones-api.onrender.com/api/users/${user.uid}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const bookmarks = data.bookmarkedStories || [];
          setIsBookmarked(bookmarks.includes(storyId));
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, storyId]);

  const handleToggle = async () => {
    if (!user || toggling) return;
    
    setToggling(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`https://healing-milestones-api.onrender.com/api/stories/${storyId}/bookmarks`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.status === 'added');
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setToggling(false);
    }
  };

  if (loading || !user) return null;

  return (
    <button 
      onClick={handleToggle} 
      disabled={toggling}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(255,255,255,0.1)',
        color: isBookmarked ? 'var(--primary)' : 'var(--text-secondary)',
        cursor: toggling ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: toggling ? 0.7 : 1,
      }}
      title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
    >
      {toggling ? <Loader2 size={20} className="spin" /> : <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />}
    </button>
  );
}
