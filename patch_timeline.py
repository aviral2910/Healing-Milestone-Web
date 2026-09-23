import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# 1. Add useParams import if missing
if "useParams" not in content:
    content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter, useParams } from 'next/navigation';")
    if "import { useParams } " not in content and "useParams" not in content:
        content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useParams } from 'next/navigation';")

# 2. Get params in SnapshotTimeline
if "const params = useParams();" not in content:
    content = content.replace("export default function SnapshotTimeline({ timeline, expiresAt, biomarkerTrends }: { timeline: any[], expiresAt: string, biomarkerTrends: any[] }) {", 
                              "export default function SnapshotTimeline({ timeline, expiresAt, biomarkerTrends }: { timeline: any[], expiresAt: string, biomarkerTrends: any[] }) {\n  const params = useParams();")

# 3. Modify InlineBiomarkerCard props to include snapshotId
if "snapshotId: string" not in content:
    content = content.replace("function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {",
                              "function InlineBiomarkerCard({ biomarker, trend, onCompare, snapshotId }: { biomarker: any, trend: any, onCompare: () => void, snapshotId: string }) {")

    # In SnapshotTimeline, pass snapshotId to InlineBiomarkerCard
    content = content.replace("trend={biomarkerTrends.find(t => t.name === b.rawName || (t.rawNames && t.rawNames.includes(b.rawName)))}",
                              "trend={biomarkerTrends.find(t => t.name === b.rawName || (t.rawNames && t.rawNames.includes(b.rawName)))}\n                                  snapshotId={params.id as string}")

# 4. Modify the onCompare click handler inside SnapshotTimeline
old_compare = """onCompare={() => {
                                    setComparing([b.rawName]);
                                    setShowCompareModal(true);
                                  }}"""
new_compare = """onCompare={() => {
                                    const router = require('next/navigation').useRouter;
                                    // this is dirty inside a loop, better to handle it properly
                                  }}"""
# Let's just fix it properly below.
