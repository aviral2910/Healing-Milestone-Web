import re

with open('src/app/user/[id]/page.tsx', 'r') as f:
    content = f.read()

# Add import
if 'ProfileTabs' not in content:
    content = content.replace(
        'import StoriesCarousel from "@/components/StoriesCarousel";',
        'import StoriesCarousel from "@/components/StoriesCarousel";\nimport ProfileTabs from "./ProfileTabs";'
    )

old_section = """      {/* Stories Section outside of max-width container */}
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
      </section>"""

new_section = """      {/* Tabbed Profile Sections (Client Component for Auth) */}
      <ProfileTabs 
        userId={user.userId || id} 
        authorName={user.displayName}
        initialStories={userStories.map((story: any) => ({
          id: story.id,
          mainImage: story.mainImage || null,
          heading: story.heading || null,
          description: story.description || null
        }))} 
      />"""

content = content.replace(old_section, new_section)

with open('src/app/user/[id]/page.tsx', 'w') as f:
    f.write(content)
