with open('src/app/snapshot/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import SnapshotTimeline from "./SnapshotTimeline";',
    'import SnapshotTimeline from "./SnapshotTimeline";\nimport SaveToRosterButton from "./SaveToRosterButton";'
)

content = content.replace(
    '<div className="dashboard-header-content" style={{ maxWidth: \'1400px\', margin: \'0 auto\', display: \'flex\', justifyContent: \'space-between\', alignItems: \'flex-start\' }}>',
    '<div className="dashboard-header-content" style={{ maxWidth: \'1400px\', margin: \'0 auto\', display: \'flex\', justifyContent: \'space-between\', alignItems: \'flex-start\', flexWrap: \'wrap\', gap: \'16px\' }}>'
)

header_end_target = """</div>
        </div>
      </div>"""
header_end_replacement = """</div>
          <div style={{ alignSelf: 'center' }}>
            <SaveToRosterButton mixViewId={id} viewName={viewData.viewName} />
          </div>
        </div>
      </div>"""
content = content.replace(header_end_target, header_end_replacement)

with open('src/app/snapshot/[id]/page.tsx', 'w') as f:
    f.write(content)
