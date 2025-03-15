const fs = require('fs');

// Load current voter IDs
let voterIds = JSON.parse(fs.readFileSync('voterIds.json', 'utf-8'));

// Get voter ID from input (this should be passed via GitHub API)
const voterId = process.env.VOTER_ID;  // GitHub Actions will pass this

// Mark voter as "used"
const voterIndex = voterIds.findIndex(v => v.voterId === voterId);
if (voterIndex !== -1) {
  voterIds[voterIndex].used = true;
  fs.writeFileSync('voterIds.json', JSON.stringify(voterIds, null, 2));
  console.log(`Voter ID ${voterId} marked as used.`);
} else {
  console.error(`Voter ID ${voterId} not found!`);
}
