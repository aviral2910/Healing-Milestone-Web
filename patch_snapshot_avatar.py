import re

with open('src/app/snapshot/[id]/page.tsx', 'r') as f:
    content = f.read()

old_author_def = """  const authorName = viewData.journeys?.[0]?.authorName || "Patient";
  const expiresAt = viewData.expiresAt ? safeUtcDate(viewData.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Unknown";"""

new_author_def = """  const authorName = viewData.journeys?.[0]?.authorName || "Patient";
  const authorId = viewData.journeys?.[0]?.authorId;
  const expiresAt = viewData.expiresAt ? safeUtcDate(viewData.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Unknown";"""

content = content.replace(old_author_def, new_author_def)

old_avatar_block = """              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.7rem' }}>
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{authorName}</span>
              </div>"""

new_avatar_block = """              {authorId ? (
                <Link href={`/user/${authorId}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                  <div style={{ width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.7rem' }}>
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{authorName}</span>
                </Link>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.7rem' }}>
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{authorName}</span>
                </div>
              )}"""

content = content.replace(old_avatar_block, new_avatar_block)

with open('src/app/snapshot/[id]/page.tsx', 'w') as f:
    f.write(content)
