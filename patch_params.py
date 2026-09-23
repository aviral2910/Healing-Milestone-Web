with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

content = content.replace("export default function SnapshotTimeline({ timeline, expiresAt, biomarkerTrends }: { timeline: any[], expiresAt: string, biomarkerTrends: any[] }) {",
                          "import { useParams } from 'next/navigation';\n\nexport default function SnapshotTimeline({ timeline, expiresAt, biomarkerTrends }: { timeline: any[], expiresAt: string, biomarkerTrends: any[] }) {\n  const params = useParams();")

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
