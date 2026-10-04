import re

with open('src/app/user/[id]/ProfileTabs.tsx', 'r') as f:
    content = f.read()

# I will find the block of the early return and move it below the useEffect

early_return = """  // If not owner, just return the stories carousel as before
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
  }"""

use_effect = """  // Fetch bookmarked stories if tab is clicked
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
  }, [activeTab, fetchedBookmarks, user, userId]);"""

# Replace early return with nothing
content = content.replace(early_return, "")

# Insert early return AFTER the useEffect
content = content.replace(use_effect, use_effect + "\n\n" + early_return)

with open('src/app/user/[id]/ProfileTabs.tsx', 'w') as f:
    f.write(content)
