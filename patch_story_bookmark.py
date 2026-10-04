import re

with open('src/app/story/[id]/page.tsx', 'r') as f:
    content = f.read()

# Add import
if 'BookmarkButton' not in content:
    content = content.replace(
        "import AuthAwareLogo from '@/components/AuthAwareLogo';",
        "import AuthAwareLogo from '@/components/AuthAwareLogo';\nimport BookmarkButton from '@/components/BookmarkButton';"
    )

old_meta = """            <div className="author-badge">
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
      </div>"""

new_meta = """            <div className="author-badge">
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
          <div style={{ marginTop: '16px' }}>
            <BookmarkButton storyId={id} />
          </div>
        </div>
      </div>"""

content = content.replace(old_meta, new_meta)

with open('src/app/story/[id]/page.tsx', 'w') as f:
    f.write(content)
