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

  if (confirm("Are you sure you want to submit your vote?")) {
    // Trigger GitHub Actions to update voterIds.json
    fetch("https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github.everest-preview+json",
        "Authorization": "token YOUR_GITHUB_PAT"
      },
      body: JSON.stringify({
        event_type: "update-voter-data",
        client_payload: { voterId: currentVoterId }
      })
    })
    .then(response => response.json())
    .then(data => {
      alert("Thank you for voting! The data will be updated.");
      setTimeout(() => window.location.reload(), 2000);
    })
    .catch(error => console.error("GitHub API Error:", error));
  }
});
