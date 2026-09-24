const fs = require('fs');
const file = 'src/app/snapshot/[id]/compare/CompareScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldLogic = `                    if (minVal >= maxVal) {
                      minVal -= 10;
                      maxVal += 10;
                    }`;

const newLogic = `                    if (minVal >= maxVal) {
                      minVal -= 10;
                      maxVal += 10;
                    }
                    minVal = Math.floor(minVal * 10) / 10;
                    maxVal = Math.ceil(maxVal * 10) / 10;`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync(file, code);
