const confessionsKey = 'confessions';

function loadConfessions() {
  const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
  const confessionsList = document.getElementById('confessionsList');
  confessionsList.innerHTML = ''; 

  // Sort confessions by upvotes
  confessions.sort((a, b) => b.upvotes - a.upvotes);

  confessions.forEach((confession, index) => {
    const confessionDiv = document.createElement('div');
    confessionDiv.classList.add('confession');
    confessionDiv.innerHTML = `
      <p><strong>Anonymous:</strong> ${confession.text}</p>
      <div class="reaction-container">
        <span class="upvote" onclick="vote(${index}, 'upvote')">👍 ${confession.upvotes}</span>
        <span class="downvote" onclick="vote(${index}, 'downvote')">👎 ${confession.downvotes}</span>
        <span class="heart" onclick="reactToConfession(${index}, 'heart')">❤️</span>
        <span class="star" onclick="reactToConfession(${index}, 'star')">⭐</span>
      </div>
    `;
    confessionsList.appendChild(confessionDiv);
  });

  document.getElementById('confessionCounter').innerText = `Total Confessions: ${confessions.length}`;
}

function postConfession() {
  const confessionInput = document.getElementById('confessionInput');
  const confessionText = confessionInput.value.trim();

  if (confessionText) {
    const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
    const newConfession = { text: confessionText, upvotes: 0, downvotes: 0, heartReacted: false, starReacted: false };
    confessions.push(newConfession);
    localStorage.setItem(confessionsKey, JSON.stringify(confessions));
    confessionInput.value = '';
    loadConfessions();
    confetti();  // Trigger confetti animation
  }
}

function vote(index, type) {
  const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
  
  if (type === 'upvote') {
    // Ensure users can't vote more than once
    if (!confessions[index].votedUp) {
      confessions[index].upvotes++;
      confessions[index].votedUp = true;
      confetti(); // Trigger confetti explosion on upvote
    }
  } else if (type === 'downvote') {
    // Ensure users can't vote more than once
    if (!confessions[index].votedDown) {
      confessions[index].downvotes++;
      confessions[index].votedDown = true;
    }
  }
  
  localStorage.setItem(confessionsKey, JSON.stringify(confessions));
  loadConfessions();
}

function reactToConfession(index, reaction) {
  const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
  if (reaction === 'heart' && !confessions[index].heartReacted) {
    confessions[index].heartReacted = true;
  } else if (reaction === 'star' && !confessions[index].starReacted) {
    confessions[index].starReacted = true;
  }
  localStorage.setItem(confessionsKey, JSON.stringify(confessions));
  loadConfessions();
}

function addEmoji(emoji) {
  const confessionInput = document.getElementById('confessionInput');
  confessionInput.value += emoji;
}

loadConfessions();
