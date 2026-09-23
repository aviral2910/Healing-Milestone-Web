import re

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "r") as f:
    content = f.read()

# Add draggedItem state
content = content.replace("const [searchQuery, setSearchQuery] = useState('');",
                          "const [searchQuery, setSearchQuery] = useState('');\n  const [draggedItem, setDraggedItem] = useState<string | null>(null);")

# Update the mapping of charts to add drag and drop props
old_chart_map = """{comparing.map((tName, idx) => {"""
new_chart_map = """{comparing.map((tName, idx) => {"""

old_div = """<div key={tName} style={{ 
                    backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' 
                  }}>"""
new_div = """<div 
                    key={tName} 
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem(tName);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!draggedItem || draggedItem === tName) return;
                      const newComparing = [...comparing];
                      const draggedIdx = newComparing.indexOf(draggedItem);
                      const targetIdx = newComparing.indexOf(tName);
                      newComparing.splice(draggedIdx, 1);
                      newComparing.splice(targetIdx, 0, draggedItem);
                      setComparing(newComparing);
                      setDraggedItem(null);
                    }}
                    onDragEnd={() => setDraggedItem(null)}
                    style={{ 
                    backgroundColor: draggedItem === tName ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column',
                    cursor: 'grab', opacity: draggedItem === tName ? 0.5 : 1, transition: 'opacity 0.2s'
                  }}>"""

content = content.replace(old_div, new_div)

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "w") as f:
    f.write(content)

