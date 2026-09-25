import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

old_end = """                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>}


                </div>"""

new_end = """                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>}
                  
                  {loadingSnapshotId === item.mix_view_id && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', zIndex: 10 }}>
                      <Loader2 size={32} color="var(--primary)" className="animate-spin" />
                    </div>
                  )}
                </div>"""

content = content.replace(old_end, new_end)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

