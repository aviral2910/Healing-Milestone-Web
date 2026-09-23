import re

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "r") as f:
    content = f.read()

old_main = "<main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#09090b' }}>"
new_main = """<main 
        id="compare-scroll-container"
        onDragOver={(e) => {
          e.preventDefault();
          if (!draggedItem) return;
          const container = e.currentTarget;
          const threshold = 150;
          const rect = container.getBoundingClientRect();
          const y = e.clientY - rect.top;
          
          if (y < threshold) {
            container.scrollTop -= (threshold - y) / 5;
          } else if (y > rect.height - threshold) {
            container.scrollTop += (y - (rect.height - threshold)) / 5;
          }
        }}
        style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#09090b' }}
      >"""

content = content.replace(old_main, new_main)

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "w") as f:
    f.write(content)
