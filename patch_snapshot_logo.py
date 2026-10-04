import re

with open('src/app/snapshot/[id]/page.tsx', 'r') as f:
    content = f.read()

old_logo = """            <div className="banner-title">
              <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
              <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
            </div>"""

new_logo = """            <div className="banner-title">
              <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
              <div style={{ letterSpacing: '0.2px' }}>
                MILESTONES 
                <span id="snapshot-connect-badge" style={{ color: 'var(--primary)', display: 'none' }}> CONNECT</span>
              </div>
            </div>"""

content = content.replace(old_logo, new_logo)

with open('src/app/snapshot/[id]/page.tsx', 'w') as f:
    f.write(content)
