const fs = require('fs');
const content = fs.readFileSync('src/data/courses.ts', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
let vuStart = -1, vuEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("id: 'vu'") && vuStart === -1) vuStart = i - 1;
  if (lines[i].includes('export const GST_COURSES') && vuEnd === -1) { vuEnd = i - 2; break; }
}
console.log('VU starts at line', vuStart + 1);
console.log('VU ends at line', vuEnd + 1);
