with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

content = content.replace("window.location.href =", "const router = require('next/navigation').useRouter; if(router) { router().push( ")

# Actually wait, using hook inside a callback like `require('next/navigation').useRouter()` is bad practice, it's better to get router at component level.
