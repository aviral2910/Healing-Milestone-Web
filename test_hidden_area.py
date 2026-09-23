import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_ref = """<ReferenceArea 
                          y1={data[data.length - 1].range[0]} 
                          y2={data[data.length - 1].range[1]} 
                          fill="rgba(34, 197, 94, 0.15)" 
                          strokeOpacity={0} 
                        />
                      )}"""

new_ref = """<ReferenceArea 
                          y1={data[data.length - 1].range[0]} 
                          y2={data[data.length - 1].range[1]} 
                          fill="rgba(34, 197, 94, 0.15)" 
                          strokeOpacity={0} 
                        />
                      )}
                      <Area type="monotone" dataKey="range" stroke="none" fill="transparent" activeDot={false} />"""
content = content.replace(old_ref, new_ref)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
