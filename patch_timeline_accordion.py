import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Add InlineBiomarkerCard component before SnapshotTimeline
inline_card_code = """
const COLORS = ['#eab308', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f97316', '#06b6d4'];

function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {
  const [expanded, setExpanded] = useState(false);

  let data = [];
  if (trend) {
    data = trend.dataPoints.map((dp: any) => ({
      rawDate: new Date(dp.date),
      displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      value: dp.value,
      isAbnormal: dp.isAbnormal
    })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
  }

  const primaryColor = '#eab308';

  return (
    <div 
      onClick={() => setExpanded(!expanded)} 
      style={{ 
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px',
        border: `1px solid ${biomarker.isAbnormal ? 'rgba(239, 68, 68, 0.3)' : (expanded ? 'var(--primary)' : 'rgba(255,255,255,0.05)')}`,
        boxShadow: expanded ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease'
      }} 
      className="biomarker-hover-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BiomarkerIcon name={biomarker.rawName} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>{biomarker.rawName}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            color: biomarker.isAbnormal ? '#ef4444' : 'var(--primary)', 
            fontWeight: 'bold', fontSize: '1.1rem' 
          }}>
            {biomarker.resultType === 'numeric' ? biomarker.valueNumeric : biomarker.valueText}
          </span>
          {biomarker.rawUnit && (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '4px' }}>
              {biomarker.rawUnit}
            </span>
          )}
        </div>
      </div>

      {expanded && trend && data.length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onCompare(); }}
              style={{ 
                background: 'rgba(218, 165, 32, 0.1)', border: '1px solid rgba(218, 165, 32, 0.3)', color: 'var(--primary)', 
                fontSize: '0.8rem', padding: '6px 12px', cursor: 'pointer', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Compare
            </button>
          </div>
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {expanded && !trend && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
          No historical trend data available for this biomarker.
        </div>
      )}
    </div>
  );
}
"""

content = content.replace("export default function SnapshotTimeline", inline_card_code + "\nexport default function SnapshotTimeline")

# Add state to SnapshotTimeline
content = content.replace(
    "const [selectedTrendName, setSelectedTrendName] = useState<string | null>(null);",
    "const [comparing, setComparing] = useState<string[]>([]);\n  const [showCompareModal, setShowCompareModal] = useState(false);"
)

# Replace the inner biomarker mapping
old_biomarkers_mapping = """                              {item.biomarkers.map((b: any, idx: number) => (
                                <div key={idx} onClick={() => setSelectedTrendName(b.rawName)} style={{ 
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                                  padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                                  border: `1px solid ${b.isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }} className="biomarker-hover-card">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <BiomarkerIcon name={b.rawName} />
                                    <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>{b.rawName}</span>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                      color: b.isAbnormal ? '#ef4444' : 'var(--primary)', 
                                      fontWeight: 'bold', fontSize: '1.1rem' 
                                    }}>
                                      {b.resultType === 'numeric' ? b.valueNumeric : b.valueText}
                                    </span>
                                    {b.rawUnit && (
                                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '4px' }}>
                                        {b.rawUnit}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}"""

new_biomarkers_mapping = """                              {item.biomarkers.map((b: any, idx: number) => (
                                <InlineBiomarkerCard 
                                  key={idx} 
                                  biomarker={b} 
                                  trend={biomarkerTrends.find(t => t.name === b.rawName)}
                                  onCompare={() => {
                                    setComparing([b.rawName]);
                                    setShowCompareModal(true);
                                  }}
                                />
                              ))}"""

content = content.replace(old_biomarkers_mapping, new_biomarkers_mapping)

# Add Compare Modal at the bottom, replacing the single chart modal
old_modal = """      {/* TREND MODAL */}
      {selectedTrendName && biomarkerTrends.find(t => t.name === selectedTrendName) && (
        <div 
          onClick={() => setSelectedTrendName(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', cursor: 'pointer'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)', width: '100%', maxWidth: '800px', height: '60vh',
              borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: '1px solid var(--border)', cursor: 'default'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BiomarkerIcon name={selectedTrendName} />
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedTrendName} History</h2>
              </div>
              <button onClick={() => setSelectedTrendName(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ flex: 1, padding: '20px', minHeight: '300px' }}>
              {(() => {
                const trend = biomarkerTrends.find(t => t.name === selectedTrendName);
                if (!trend) return null;
                const data = trend.dataPoints.map((dp: any) => ({
                  rawDate: new Date(dp.date),
                  displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  value: dp.value,
                  isAbnormal: dp.isAbnormal
                })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
                const primaryColor = '#eab308';
                
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                      <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          </div>
        </div>
      )}"""

new_modal = """      {/* COMPARE MODAL */}
      {showCompareModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--background)', width: '100%', maxWidth: '800px', height: '80vh',
            borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            border: '1px solid var(--border)'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Compare Biomarkers</h2>
              <button onClick={() => setShowCompareModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '250px', borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', padding: '0 10px', textTransform: 'uppercase' }}>Select to Compare</div>
                {biomarkerTrends.map(t => (
                  <div 
                    key={t.name}
                    onClick={() => {
                      if (comparing.includes(t.name)) {
                        setComparing(comparing.filter(n => n !== t.name));
                      } else {
                        setComparing([...comparing, t.name]);
                      }
                    }}
                    style={{
                      padding: '10px', cursor: 'pointer', borderRadius: '8px',
                      backgroundColor: comparing.includes(t.name) ? 'rgba(var(--primary-rgb, 218, 165, 32), 0.15)' : 'transparent',
                      border: `1px solid ${comparing.includes(t.name) ? 'var(--primary)' : 'transparent'}`,
                      display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--text-secondary)', backgroundColor: comparing.includes(t.name) ? 'var(--primary)' : 'transparent' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                {(() => {
                  if (comparing.length === 0) {
                    return (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Select biomarkers from the left to compare
                      </div>
                    );
                  }
                  
                  const dataMap: { [date: string]: any } = {};
                  comparing.forEach(tName => {
                    const t = biomarkerTrends.find(x => x.name === tName);
                    if (t) {
                      t.dataPoints.forEach((dp: any) => {
                        const dateStr = new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const rawDate = new Date(dp.date).getTime();
                        if (!dataMap[dateStr]) dataMap[dateStr] = { displayDate: dateStr, rawDate };
                        dataMap[dateStr][tName] = dp.value;
                      });
                    }
                  });
                  const compiledCompareData = Object.values(dataMap).sort((a, b) => a.rawDate - b.rawDate);
                  
                  return (
                    <div style={{ flex: 1, minHeight: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={compiledCompareData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} minTickGap={30} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                          <Legend />
                          {comparing.map((tName, i) => (
                            <Line 
                              key={tName} 
                              type="monotone" 
                              dataKey={tName} 
                              name={tName}
                              stroke={COLORS[i % COLORS.length]} 
                              strokeWidth={3}
                              dot={{ fill: 'var(--surface)', stroke: COLORS[i % COLORS.length], strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6 }}
                              connectNulls
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}"""
content = content.replace(old_modal, new_modal)

# Fix Recharts import
content = content.replace("import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';", "import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';")

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
