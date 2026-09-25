import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Update Card Div to be clickable
old_card_div = """                <div key={item.id} style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>"""

new_card_div = """                <div 
                  key={item.id} 
                  onClick={() => router.push(`/snapshot/${item.mix_view_id}`)}
                  style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease', cursor: 'pointer' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>"""

content = content.replace(old_card_div, new_card_div)

# 2. Add Remove button to Card Header
old_header_end = """                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>"""

new_header_end = """                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removePatient(item.id); }}
                      style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                      title="Remove from roster"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>"""

content = content.replace(old_header_end, new_header_end)

# 3. Remove the old Actions row entirely
old_actions = """                  <div style={{ flexGrow: 1 }} />
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button 
                      onClick={() => removePatient(item.id)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                    <Link 
                      href={`/snapshot/${item.mix_view_id}`}
                      style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg, var(--primary) 0%, #b89326 100%)', color: '#000', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)' }}
                    >
                      <Eye size={16} strokeWidth={2.5} /> View Snapshot
                    </Link>
                  </div>"""

# Remove old actions
content = content.replace(old_actions, "")

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

