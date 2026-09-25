import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Add lucide-react imports if not there
if "lucide-react" not in content:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { User, Clock, Calendar, Trash2, Eye, FileText } from 'lucide-react';")

old_table_section = """          <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Patient Name</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Added On</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Valid Until</th>
                  <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '500', fontSize: '1.05rem' }}>{item.patient_alias || item.mix_view?.name || 'Unknown Patient'}</div>
                      {item.notes && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.notes}</div>}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {item.mix_view ? new Date(item.mix_view.expires_at).toLocaleDateString() : 'Expired'}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Link 
                          href={`/snapshot/${item.mix_view_id}`}
                          style={{ background: 'var(--primary)', color: '#000', padding: '6px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => removePatient(item.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>"""

new_card_section = """          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {roster.map((item) => {
              const patientName = item.patient_alias || item.mix_view?.name || 'Unknown Patient';
              const initial = patientName.charAt(0).toUpperCase();
              return (
                <div key={item.id} style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        {initial}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {patientName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} color="var(--primary)" />
                      Valid until: <span style={{ color: 'var(--text-primary)' }}>{item.mix_view ? new Date(item.mix_view.expires_at).toLocaleDateString() : 'Expired'}</span>
                    </div>
                    {item.mix_view?.items && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <FileText size={14} color="var(--primary)" />
                        Contains {item.mix_view.items.length} records
                      </div>
                    )}
                  </div>

                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>}

                  <div style={{ flexGrow: 1 }} />
                  
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
                  </div>
                </div>
              );
            })}
          </div>"""

# Ensure proper replacement avoiding regex escaping issues
content = content.replace(old_table_section, new_card_section)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
