import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# We need to manually remove the old useEffect and fetchRoster, and insert the new one.
# Let's find where they are.
pattern = r"  useEffect\(\(\) => \{\n    if \(user\) \{\n      fetchRoster\(\);\n    \}\n  \}, \[user\]\);\n\n  const fetchRoster = async \(\) => \{.*?\n  \};\n"
match = re.search(pattern, content, re.DOTALL)

new_fetch = """  const fetchRoster = async (firebaseUser: any, searchQuery = '', pageNum = 1) => {
    try {
      setFetching(true);
      const token = await firebaseUser.getIdToken();
      const params = new URLSearchParams({ page: pageNum.toString(), limit: '20' });
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      const res = await fetch(`https://healing-milestones-api.onrender.com/api/connect/roster?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoster(data.items || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
        setPage(data.page || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoster(user, search, page);
    }
  }, [user, search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };
"""

if match:
    content = content[:match.start()] + new_fetch + content[match.end():]
else:
    print("Could not find fetchRoster to replace!")

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
