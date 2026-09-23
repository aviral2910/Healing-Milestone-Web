const fs = require('fs');
fetch("https://healing-milestones-api.onrender.com/api/mix-views/FZwCF5FFsq/public")
  .then(res => res.json())
  .then(data => {
    const trend = data.biomarkerTrends.find(t => t.name === "Cholesterol [Mass/volume] in Serum or Plasma");
    const mapped = trend.dataPoints.map((dp) => ({
      value: dp.value,
      range: (dp.rangeLow != null || dp.rangeHigh != null) ? [dp.rangeLow ?? 0, dp.rangeHigh ?? (dp.rangeLow ? dp.rangeLow * 2 : 100)] : null
    }));
    console.log(JSON.stringify(mapped, null, 2));
  });
