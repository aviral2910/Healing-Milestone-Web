import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

old_block = """                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <FileText size={14} />
                          {snapshotTitle}
                        </div>"""

new_block = """                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                          <FileText size={14} style={{ color: 'var(--text-secondary)' }} />
                          <span style={{ fontWeight: 400 }}>{snapshotTitle}</span>
                        </div>"""

content = content.replace(old_block, new_block)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
