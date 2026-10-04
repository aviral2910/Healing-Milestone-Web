'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StoriesCarousel from '@/components/StoriesCarousel';

export default function ProfileTabs({ 
  userId, 
  initialStories, 
  authorName 
}: { 
  userId: string, 
  initialStories: any[],
  authorName: string 
}) {
  const { user } = useAuth();
  const isOwner = user?.uid === userId;
  
  const [activeTab, setActiveTab] = useState<'stories' | 'bookmarked'>('stories');
  
  const [bookmarkedStories, setBookmarkedStories] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [fetchedBookmarks, setFetchedBookmarks] = useState(false);



  // Fetch bookmarked stories if tab is clicked
  useEffect(() => {
    if (activeTab === 'bookmarked' && !fetchedBookmarks && user) {
      const fetchBookmarks = async () => {
        setLoadingBookmarks(true);
        try {
          const token = await user.getIdToken();
          
          // 1. Get profile data to get bookmark IDs
          const profileRes = await fetch(`https://healing-milestones-api.onrender.com/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!profileRes.ok) throw new Error("Failed to fetch profile");
          const profileData = await profileRes.json();
          
          const bookmarkIds = profileData.bookmarkedStories || [];
          
          if (bookmarkIds.length > 0) {
            // 2. Fetch actual stories
            const batchRes = await fetch(`https://healing-milestones-api.onrender.com/api/stories/batch`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ ids: bookmarkIds })
            });
            
            if (batchRes.ok) {
              const batchData = await batchRes.json();
              setBookmarkedStories(batchData.items || []);
            }
          }
          
          setFetchedBookmarks(true);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        } finally {
          setLoadingBookmarks(false);
        }
      };
      
      fetchBookmarks();
    }
  }, [activeTab, fetchedBookmarks, user, userId]);

  // If not owner, just return the stories carousel as before
  if (!isOwner) {
    return (
      <section className="featured-stories-section" style={{ paddingBottom: '120px' }}>
        <h2 className="section-title">Stories by {authorName}</h2>
        {initialStories.length > 0 ? (
          <StoriesCarousel stories={initialStories} />
        ) : (
          <div className="empty-state glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p>This user hasn't published any stories yet.</p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="featured-stories-section" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('stories')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', 
            fontWeight: activeTab === 'stories' ? 'bold' : 'normal',
            color: activeTab === 'stories' ? 'var(--primary)' : 'var(--text-secondary)',
            position: 'relative'
          }}
        >
          My Stories
          {activeTab === 'stories' && <div style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />}
        </button>
        <button 
          onClick={() => setActiveTab('bookmarked')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', 
            fontWeight: activeTab === 'bookmarked' ? 'bold' : 'normal',
            color: activeTab === 'bookmarked' ? 'var(--primary)' : 'var(--text-secondary)',
            position: 'relative'
          }}
        >
          Saved Stories
          {activeTab === 'bookmarked' && <div style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />}
        </button>
      </div>
      
      {activeTab === 'stories' && (
        initialStories.length > 0 ? (
          <StoriesCarousel stories={initialStories} />
        ) : (
          <div className="empty-state glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p>You haven't published any stories yet.</p>
          </div>
        )
      )}

      {activeTab === 'bookmarked' && (
        loadingBookmarks ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner" style={{ border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: '30px', height: '30px', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading saved stories...</p>
          </div>
        ) : bookmarkedStories.length > 0 ? (
          <StoriesCarousel stories={bookmarkedStories.map(story => ({
             id: story.id,
             mainImage: story.mainImage || null,
             heading: story.heading || null,
             description: story.description || null
          }))} />
        ) : (
          <div className="empty-state glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p>You haven't saved any stories yet.</p>
          </div>
        )
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
