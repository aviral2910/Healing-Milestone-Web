import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Make grid wider
content = content.replace("minmax(320px, 1fr)", "minmax(400px, 1fr)")

# 2. Add owner name and layout adjustments
old_card_header = """                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {patientName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>"""

new_card_header = """                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {patientName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <User size={14} />
                          {item.mix_view?.author?.display_name || item.mix_view?.user?.display_name || 'Patient Snapshot'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>"""
content = content.replace(old_card_header, new_card_header)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
