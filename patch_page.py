import re

with open("src/app/snapshot/[id]/page.tsx", "r") as f:
    content = f.read()

# Remove BiomarkerTrends import and component
content = content.replace('import BiomarkerTrends from "./BiomarkerTrends";\n', '')
content = content.replace("""{viewData.biomarkerTrends && viewData.biomarkerTrends.length > 0 && (
          <BiomarkerTrends trends={viewData.biomarkerTrends} />
        )}""", "")

# Pass biomarkerTrends to SnapshotTimeline
content = content.replace(
    """<SnapshotTimeline timeline={timeline} expiresAt={expiresAt} />""",
    """<SnapshotTimeline timeline={timeline} expiresAt={expiresAt} biomarkerTrends={viewData.biomarkerTrends || []} />"""
)

with open("src/app/snapshot/[id]/page.tsx", "w") as f:
    f.write(content)
