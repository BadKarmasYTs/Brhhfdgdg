let confessions = [];
let likedPosts = new Set();
let dislikedPosts = new Set();

function submitConfession() {
  const input = document.getElementById("confessionInput");
  const list = document.getElementById("confessionsList");
  const nickname = document.getElementById("nickname").value.trim() || "Anonymous";
  const category = document.getElementById("category").value;

  const text = input.value.trim();
  if (!text) return;

  const id = Date.now();
  const newConfession = {
    id,
    text,
    nickname,
    category,
    timestamp: new Date(),
    likes: 0,
    dislikes: 0
  };

  confessions.unshift(newConfession);
  updateConfessions();
  input.value = "";
  document.getElementById("confessionCounter").innerText = `Total Confessions: ${confessions.length}`;
}

function updateConfessions() {
  const list = document.getElementById("confessionsList");
  list.innerHTML = "";

  confessions.forEach(conf => {
    const el = document.createElement("div");
    el.className = "confession";

    const timeAgo = timeSince(new Date(conf.timestamp));

    el.innerHTML = `
      <p><strong>${conf.nickname}</strong> • <span class="category">${conf.category}</span> • <span class="time">${timeAgo}</span></p>
      <p>${conf.text}</p>
      <div class="reaction-container">
        <span class="upvote" onclick="likeConfession(${conf.id})">👍 ${conf.likes}</span>
        <span class="downvote" onclick="dislikeConfession(${conf.id})">👎 ${conf.dislikes}</span>
      </div>
    `;
    list.appendChild(el);
  });
}

function likeConfession(id) {
  if (likedPosts.has(id)) return;
  likedPosts.add(id);
  dislikedPosts.delete(id);
  const conf = confessions.find(c => c.id === id);
  if (conf) conf.likes++;
  updateConfessions();
}

function dislikeConfession(id) {
  if (dislikedPosts.has(id)) return;
  dislikedPosts.add(id);
  likedPosts.delete(id);
  const conf = confessions.find(c => c.id === id);
  if (conf) conf.dislikes++;
  updateConfessions();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
    { label: "second", secs: 1 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

document.querySelectorAll(".emoji").forEach(e => {
  e.onclick = () => {
    const input = document.getElementById("confessionInput");
    input.value += e.innerText;
    input.focus();
  };
});
