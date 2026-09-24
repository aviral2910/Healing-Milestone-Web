with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""  const { user, loading, logout } = useAuth();""",
"""  const { user, loading, needsOnboarding, logout } = useAuth();"""
)

content = content.replace(
"""  if (loading || !user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }""",
"""  if (loading || !user || needsOnboarding) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }"""
)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
