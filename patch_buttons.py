import os

def replace_in_file(file_path, old, new):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(file_path, 'w') as f:
            f.write(content)
            
# 1. Update homepage header button
page_header_old = """<Link href="/connect" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>
            <Users size={16} />
            HM Connect
          </Link>"""
page_header_new = """<Link href="/connect" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>
            <Users size={16} />
            HM Connect
          </Link>"""
replace_in_file('src/app/page.tsx', page_header_old, page_header_new)

# 2. Update homepage section button (from share-journey-cta to download-btn)
page_section_old = """<Link href="/connect" className="share-journey-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              Open HM Connect <ExternalLink size={18} />
            </Link>"""
page_section_new = """<Link href="/connect" className="download-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              Open HM Connect <ExternalLink size={18} />
            </Link>"""
replace_in_file('src/app/page.tsx', page_section_old, page_section_new)

# 3. Update snapshot dashboard headers
snap_header_old = """<Link href="/connect" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.95rem', letterSpacing: '0.5px' }}>HM Connect</Link>"""
snap_header_new = """<Link href="/connect" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>HM Connect</Link>"""
replace_in_file('src/app/snapshot/[id]/page.tsx', snap_header_old, snap_header_new)
replace_in_file('src/app/snapshot/[id]/compare/page.tsx', snap_header_old, snap_header_new)
