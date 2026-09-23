import re

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "r") as f:
    content = f.read()

content = content.replace("const [draggedItem, setDraggedItem] = useState<string | null>(null);",
                          "const [draggedItem, setDraggedItem] = useState<string | null>(null);\n  const [isNavigating, setIsNavigating] = useState(false);")


old_back = """        <button onClick={() => router.push(`/snapshot/${snapshotId}`)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>"""

new_back = """        <button 
          onClick={() => { setIsNavigating(true); router.push(`/snapshot/${snapshotId}`); }} 
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: isNavigating ? 0.5 : 1, pointerEvents: isNavigating ? 'none' : 'auto' }}
        >
          {isNavigating ? (
            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          )}
        </button>"""

content = content.replace(old_back, new_back)

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "w") as f:
    f.write(content)
