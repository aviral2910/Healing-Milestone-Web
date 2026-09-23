with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "r") as f:
    content = f.read()

old_use_effect = """  useEffect(() => {
    const base = searchParams.get('base');
    if (base && comparing.length === 0) {
      setComparing([base]);
    }
  }, [searchParams]);"""

new_use_effect = """  useEffect(() => {
    const base = searchParams.get('base');
    if (base && comparing.length === 0) {
      const actualTrend = biomarkerTrends.find((t: any) => t.name === base || (t.rawNames && t.rawNames.includes(base)));
      if (actualTrend) {
        setComparing([actualTrend.name]);
      } else {
        setComparing([base]);
      }
    }
  }, [searchParams, biomarkerTrends, comparing.length]);"""

content = content.replace(old_use_effect, new_use_effect)

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "w") as f:
    f.write(content)
