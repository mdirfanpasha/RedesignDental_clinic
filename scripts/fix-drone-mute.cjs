const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find the WRONG mute button (line ~521 in navbar area) and remove it
// It starts with "<!-- Mute / Unmute Toggle Button -->" around line 521
// and ends with "</button>" around line 537

let wrongStart = -1;
let wrongEnd = -1;

// Find the first occurrence of the mute comment
const firstMuteComment = content.indexOf('<!-- Mute / Unmute Toggle Button -->');
// Find the second occurrence (the correct one)
const secondMuteComment = content.indexOf('<!-- Mute / Unmute Toggle Button -->', firstMuteComment + 1);

if (firstMuteComment === -1 || secondMuteComment === -1) {
  console.log('First comment at:', firstMuteComment, 'Second at:', secondMuteComment);
  console.error('Cannot find both occurrences');
  process.exit(1);
}

// The first (wrong) mute button block: from "\n\n<!-- Mute..." to "</button>"
// Find the \n right before the comment
const blockStart = content.lastIndexOf('\n', firstMuteComment - 1);
// Find the closing </button> tag of this wrong block
const blockEnd = content.indexOf('</button>', firstMuteComment) + 9;

console.log('Wrong mute button block: chars', blockStart, '-', blockEnd);
console.log('Preview:', content.slice(blockStart, blockStart + 100));

// Remove it
content = content.slice(0, blockStart) + content.slice(blockEnd);

// Verify only one mute button remains
const remaining = (content.match(/droneMuteBtn/g) || []).length;
console.log('droneMuteBtn occurrences after removal:', remaining);

// Also verify the correct one is near clinicDroneVideo
const droneIdx = content.indexOf('clinicDroneVideo');
const muteIdx = content.indexOf('<button id="droneMuteBtn"');
console.log('clinicDroneVideo char pos:', droneIdx, '| droneMuteBtn char pos:', muteIdx);
console.log('Gap (should be ~600-2000):', muteIdx - droneIdx);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! Wrong mute button removed.');
