import re

with open('src/app/story/[id]/page.tsx', 'r') as f:
    content = f.read()

old_badge = """            <div className="author-badge">
              {authorPicture ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={authorPicture} alt={authorName} className="author-avatar-small" />
              ) : (
                <div className="author-avatar-small placeholder">
                  {story.displayAuthorName && authorName ? authorName.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <span className="author-name">By {story.displayAuthorName ? authorName : "Anonymous"}</span>
            </div>"""

new_badge = """            {story.author_id && story.displayAuthorName ? (
              <Link href={`/user/${story.author_id}`} className="author-badge" style={{ textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                {authorPicture ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={authorPicture} alt={authorName} className="author-avatar-small" />
                ) : (
                  <div className="author-avatar-small placeholder">
                    {authorName ? authorName.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <span className="author-name">By {authorName}</span>
              </Link>
            ) : (
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
            )}"""

content = content.replace(old_badge, new_badge)

# Fix onMouseEnter in Server Component
content = content.replace(
    "onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}",
    'className="author-badge hover-opacity"'
)

with open('src/app/story/[id]/page.tsx', 'w') as f:
    f.write(content)
