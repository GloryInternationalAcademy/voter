// Load JSON data
let voterIds = [];
let candidates = [];
let votes = JSON.parse(localStorage.getItem('votes')) || [];

fetch('voterIds.json')
  .then(response => response.json())
  .then(data => {
    voterIds = data;
    console.log('Voter IDs loaded:', voterIds); // Debugging
  });

fetch('candidates.json')
  .then(response => response.json())
  .then(data => {
    candidates = data;
    console.log('Candidates loaded:', candidates); // Debugging
  });

// DOM Elements
const voterIdInput = document.getElementById('voterId');
const verifyVoterIdButton = document.getElementById('verifyVoterId');
const voterIdMessage = document.getElementById('voterIdMessage');
const votingSection = document.getElementById('votingSection');
const candidatesDiv = document.getElementById('candidates');
const submitVoteButton = document.getElementById('submitVote');

let currentVoterId = null;

// Verify Voter ID
verifyVoterIdButton.addEventListener('click', () => {
  const voterId = voterIdInput.value.trim();
  if (!voterId) {
    voterIdMessage.textContent = 'Please enter a Voter ID.';
    return;
  }

  console.log('Checking Voter ID:', voterId); // Debugging

  const voter = voterIds.find(v => v.voterId === voterId);
  console.log('Found Voter:', voter); // Debugging

  if (!voter || voter.used) {
    voterIdMessage.textContent = 'Invalid or already used Voter ID.';
    return;
  }

  currentVoterId = voterId;
  voterIdMessage.textContent = 'Voter ID verified!';
  voterIdInput.disabled = true;
  verifyVoterIdButton.disabled = true;
  votingSection.style.display = 'block';
  loadCandidates();
});

// Load Candidates
function loadCandidates() {
  candidates.forEach(candidate => {
    const candidateDiv = document.createElement('div');
    candidateDiv.className = 'candidate';
    candidateDiv.innerHTML = `
      <input type="radio" name="candidate" value="${candidate.id}">
      <img src="${candidate.photo}" alt="${candidate.name}" width="50">
      <span>${candidate.name} (${candidate.post})</span>
    `;
    candidatesDiv.appendChild(candidateDiv);
  });
}

// Submit Vote
submitVoteButton.addEventListener('click', () => {
  const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
  if (!selectedCandidate) {
    alert('Please select a candidate.');
    return;
  }

  // Save the vote
  votes.push({
    voterId: currentVoterId,
    candidateId: selectedCandidate.value,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('votes', JSON.stringify(votes));

  // Mark Voter ID as used
  const voterIndex = voterIds.findIndex(v => v.voterId === currentVoterId);
  voterIds[voterIndex].used = true;

  alert('Thank you for voting!');
  window.location.reload(); // Reset the page
});