const votes = JSON.parse(localStorage.getItem('votes')) || [];
const candidates = [
  { id: 1, name: "John Doe", post: "Head Prefect" },
  { id: 2, name: "Jane Smith", post: "Deputy Prefect" },
  { id: 3, name: "Alice Johnson", post: "Sports Captain" }
];

const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

// Count votes for each candidate
const voteCounts = {};
candidates.forEach(candidate => {
  voteCounts[candidate.id] = 0;
});

votes.forEach(vote => {
  voteCounts[vote.candidateId]++;
});

// Display results
candidates.forEach(candidate => {
  const row = resultsTable.insertRow();
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  cell1.textContent = `${candidate.name} (${candidate.post})`;
  cell2.textContent = voteCounts[candidate.id];
});