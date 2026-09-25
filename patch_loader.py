import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Add Loader2 to imports
if 'Loader2' not in content:
    content = content.replace("import { User, Clock, Calendar, Trash2, Eye, FileText }", "import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2 }")

# Add state for loading
if 'const [loadingSnapshotId, setLoadingSnapshotId]' not in content:
    content = content.replace("const [fetching, setFetching] = useState(true);", "const [fetching, setFetching] = useState(true);\n  const [loadingSnapshotId, setLoadingSnapshotId] = useState<string | null>(null);")

# Add position: 'relative' and update onClick
old_card_start = """                <div 
                  key={item.id} 
                  onClick={() => router.push(`/snapshot/${item.mix_view_id}`)}
                  style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease', cursor: 'pointer' }}"""

new_card_start = """                <div 
                  key={item.id} 
                  onClick={() => { setLoadingSnapshotId(item.mix_view_id); router.push(`/snapshot/${item.mix_view_id}`); }}
                  style={{ position: 'relative', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease', cursor: 'pointer' }}"""

content = content.replace(old_card_start, new_card_start)

# Add the loading overlay
old_card_end = """                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>}
                </div>"""

new_card_end = """                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>}
                  
                  {loadingSnapshotId === item.mix_view_id && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', zIndex: 10 }}>
                      <Loader2 size={32} color="var(--primary)" className="animate-spin" />
                    </div>
                  )}
                </div>"""

content = content.replace(old_card_end, new_card_end)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

