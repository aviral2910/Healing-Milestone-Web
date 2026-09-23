import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Add 'biomarkers' to filter union type
content = content.replace("const [filter, setFilter] = useState<'all' | 'milestones' | 'medical_records' | 'reports' | 'prescriptions'>('all');",
                          "const [filter, setFilter] = useState<'all' | 'milestones' | 'medical_records' | 'reports' | 'prescriptions' | 'biomarkers'>('all');")

# Fix search logic
old_search_logic = """    const matchesSearch = item.title?.toLowerCase().includes(searchLower) || 
                          (item.description && item.description.toLowerCase().includes(searchLower)) ||
                          (item.category && item.category.toLowerCase().includes(searchLower)) ||
                          (item.data?.notes && item.data.notes.toLowerCase().includes(searchLower));"""

new_search_logic = """    const biomarkerMatch = item.data?.biomarkers?.some((b: any) => 
        b.rawName?.toLowerCase().includes(searchLower) || 
        b.valueText?.toLowerCase().includes(searchLower)
    );
    const matchesSearch = item.title?.toLowerCase().includes(searchLower) || 
                          (item.description && item.description.toLowerCase().includes(searchLower)) ||
                          (item.category && item.category.toLowerCase().includes(searchLower)) ||
                          (item.data?.notes && item.data.notes.toLowerCase().includes(searchLower)) ||
                          biomarkerMatch;"""

content = content.replace(old_search_logic, new_search_logic)

# Fix filter logic
old_filter_logic = """    if (filter === 'reports') return item.itemType === 'record' && item.category === 'report';"""

new_filter_logic = """    if (filter === 'reports') return item.itemType === 'record' && item.category === 'report';
    if (filter === 'biomarkers') return item.data?.biomarkers && item.data.biomarkers.length > 0;"""

content = content.replace(old_filter_logic, new_filter_logic)

# Add button
old_button = """          <button 
            onClick={() => setFilter('milestones')}"""

new_button = """          <button 
            onClick={() => setFilter('biomarkers')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'biomarkers' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'biomarkers' ? '#000' : 'var(--text-primary)',
              border: filter === 'biomarkers' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            🧪 Has Biomarkers
          </button>
          <button 
            onClick={() => setFilter('milestones')}"""

content = content.replace(old_button, new_button)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
