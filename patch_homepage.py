with open('src/app/page.tsx', 'r') as f:
    content = f.read()

import_statement = "import { ExternalLink, MonitorSmartphone, Users } from 'lucide-react';"
content = content.replace("import { ExternalLink, MonitorSmartphone } from 'lucide-react';", import_statement)

# Add to Header next to Web Sync
header_target = """<Link href="/web" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>
          <MonitorSmartphone size={16} />
          Web Sync
        </Link>
      </header>"""
header_replacement = """<div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/connect" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>
            <Users size={16} />
            HM Connect
          </Link>
          <Link href="/web" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>
            <MonitorSmartphone size={16} />
            Web Sync
          </Link>
        </div>
      </header>"""
content = content.replace(header_target, header_replacement)

# Add HM Connect section above Web Sync section
sync_section_target = """{/* Web Sync Section */}
      <section className="share-journey-section" style={{ backgroundColor: '#0f0f11', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>"""
hm_connect_section = """{/* HM Connect Section */}
      <section className="share-journey-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary)' }}>
            <Users size={32} />
          </div>
          <h2 className="section-title">Healing Milestones <span className="text-gold">Connect</span></h2>
          <p className="section-subtitle">
            Securely manage your patient roster and track healing milestones in one place. HM Connect is built for healthcare professionals, caregivers, and family members to stay updated on a patient's health snapshots.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/connect" className="share-journey-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              Open HM Connect <ExternalLink size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Web Sync Section */}
      <section className="share-journey-section" style={{ backgroundColor: '#0f0f11', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>"""
content = content.replace(sync_section_target, hm_connect_section)

# Add to Footer
footer_target = """<div className="footer-links">
            <Link href="/web" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Web Sync</Link>"""
footer_replacement = """<div className="footer-links">
            <Link href="/connect" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>HM Connect</Link>
            <Link href="/web" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Web Sync</Link>"""
content = content.replace(footer_target, footer_replacement)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
