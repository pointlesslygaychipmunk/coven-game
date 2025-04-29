// main.js (front-end logic for Journal)
document.getElementById('journalButton').onclick = () => {
    const panel = document.getElementById('journalPanel');
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
  };
  
  // Switch journal tabs
  document.querySelectorAll('.journal-tabs button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.journal-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-tab');
      updateJournalContent(category);
    };
  });
  
  function updateJournalContent(category) {
    const contentDiv = document.querySelector('.journal-content');
    contentDiv.innerHTML = '';
    const entries = gameData.journal.filter(e => e.category === category);  // gameData.journal from backend
    entries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'journal-entry';
      entryDiv.innerHTML = `<h4>${entry.title} <small style="font-weight:normal;">(${entry.turnLabel})</small></h4><p>${entry.text}</p>`;
      contentDiv.appendChild(entryDiv);
    });
  }
  