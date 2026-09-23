import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Add useRouter import
content = content.replace("import { useParams } from 'next/navigation';", "import { useParams, useRouter } from 'next/navigation';")

# Add router to component
content = content.replace("const params = useParams();", "const params = useParams();\n  const router = useRouter();")

# Fix the href
old_nav = "window.location.href = `/snapshot/${params.id}/compare?base=${encodeURIComponent(b.rawName)}`;"
new_nav = "router.push(`/snapshot/${params.id}/compare?base=${encodeURIComponent(b.rawName)}`);"
content = content.replace(old_nav, new_nav)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
