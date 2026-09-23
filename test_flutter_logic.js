const data = [
  { value: 184, rangeLow: null, rangeHigh: 200 },
  { value: 176, rangeLow: null, rangeHigh: 200 }
];

let defaultLow = null;
let defaultHigh = null;

for (let i = data.length - 1; i >= 0; i--) {
  if (data[i].rangeHigh != null && defaultHigh == null) defaultHigh = data[i].rangeHigh;
  if (data[i].rangeLow != null && defaultLow == null) defaultLow = data[i].rangeLow;
}

let minVal = Infinity;
let maxVal = -Infinity;

data.forEach(dp => {
  const rHigh = dp.rangeHigh ?? defaultHigh ?? dp.value;
  const rLow = dp.rangeLow ?? defaultLow ?? dp.value;
  
  dp.range = [rLow, rHigh];
  
  if (dp.value < minVal) minVal = dp.value;
  if (dp.value > maxVal) maxVal = dp.value;
  if (rLow < minVal) minVal = rLow;
  if (rHigh > maxVal) maxVal = rHigh;
});

const padding = (maxVal - minVal) * 0.2;
minVal -= padding;
maxVal += padding;
if (minVal >= maxVal) {
    minVal -= 10;
    maxVal += 10;
}

console.log({ minVal, maxVal, data });
