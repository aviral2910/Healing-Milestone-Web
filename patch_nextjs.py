import re

with open("src/app/snapshot/[id]/page.tsx", "r") as f:
    content = f.read()

# Remove the BiomarkerTrends from page.tsx entirely
old_trends = """        {viewData.biomarkerTrends && viewData.biomarkerTrends.length > 0 && (
          <BiomarkerTrends trends={viewData.biomarkerTrends} />
        )}"""

content = content.replace(old_trends, "")

with open("src/app/snapshot/[id]/page.tsx", "w") as f:
    f.write(content)
