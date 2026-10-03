import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Fix imports
content = content.replace("import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';", 
                          "import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2, Search, ChevronLeft, ChevronRight, MonitorSmartphone } from 'lucide-react';")

# Add button
old_button = """        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)' }}>
              HM Connect
            </h1>
          </div>
        </div>
        <button 
          onClick={logout}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Sign Out
        </button>"""

new_button = """        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)' }}>
              HM Connect
            </h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/web" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
            <MonitorSmartphone size={16} />
            Web Sync
          </Link>
          <button 
            onClick={logout}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>"""

content = content.replace(old_button, new_button)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
