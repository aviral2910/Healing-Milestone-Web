import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_inline = """function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {
  const [expanded, setExpanded] = useState(false);"""

new_inline = """function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);"""

content = content.replace(old_inline, new_inline)

old_button = """            <button 
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
            </button>"""

new_button = """            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsNavigating(true);
                onCompare(); 
              }}
              style={{ 
                background: 'rgba(218, 165, 32, 0.1)', border: '1px solid rgba(218, 165, 32, 0.3)', color: 'var(--primary)', 
                fontSize: '0.8rem', padding: '6px 12px', cursor: 'pointer', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '6px',
                opacity: isNavigating ? 0.6 : 1, pointerEvents: isNavigating ? 'none' : 'auto'
              }}
            >
              {isNavigating ? (
                <div style={{ width: '12px', height: '12px', border: '2px solid rgba(218, 165, 32, 0.2)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              )}
              {isNavigating ? 'Loading...' : 'Compare'}
            </button>"""

content = content.replace(old_button, new_button)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
