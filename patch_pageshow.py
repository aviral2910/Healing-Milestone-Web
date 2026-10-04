import re
with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

new_code = """  useEffect(() => {
    // Clear loading state when pathname changes (e.g., when returning to this page via back button)
    setLoadingSnapshotId(null);
    
    // Also clear on pageshow for BFCache
    const handlePageShow = () => setLoadingSnapshotId(null);
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [pathname]);"""

content = content.replace(
"""  useEffect(() => {
    // Clear loading state when pathname changes (e.g., when returning to this page via back button)
    setLoadingSnapshotId(null);
  }, [pathname]);""", new_code)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
