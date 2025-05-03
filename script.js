import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuwF7_iRb0CIqApyk3_bBFPCoUHVTbn1Q",
  authDomain: "website-e08f0.firebaseapp.com",
  databaseURL: "https://website-e08f0-default-rtdb.firebaseio.com",
  projectId: "website-e08f0",
  storageBucket: "website-e08f0.firebasestorage.app",
  messagingSenderId: "738977165779",
  appId: "1:738977165779:web:8b54334e8306aa5932bf26",
  measurementId: "G-5DC7NWVJGD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const confessionsRef = ref(db, "confessions");
const likedPosts = new Set();
const dislikedPosts = new Set();

document.getElementById("submitBtn").onclick = submitConfession;

function submitConfession() {
  const input = document.getElementById("confessionInput");
  const nickname = document.getElementById("nickname").value.trim() || "Anonymous";
  const category = document.getElementById("category").value;
  const text = input.value.trim();
  if (!text) return;

  const newConfession = {
    text,
    nickname,
    category,
    timestamp: Date.now(),
    likes: 0,
    dislikes: 0
  };

  push(confessionsRef, newConfession);
  input.value = "";
}

onValue(confessionsRef, (snapshot) => {
  const data = snapshot.val();
  const list = document.getElementById("confessionsList");
  list.innerHTML = "";
  const entries = data ? Object.entries(data).reverse() : [];

  entries.forEach(([id, conf]) => {
    const el = document.createElement("div");
    el.className = "confession";

    const timeAgo = timeSince(new Date(conf.timestamp));

    el.innerHTML = 
      <p><strong>${conf.nickname}</strong> • <span class="category">${conf.category}</span> • <span class="time">${timeAgo}</span></p>
      <p>${conf.text}</p>
      <div class="reaction-container">
        <span class="upvote" data-id="${id}" onclick="likeConfession('${id}')">👍 ${conf.likes || 0}</span>
        <span class="downvote" data-id="${id}" onclick="dislikeConfession('${id}')">👎 ${conf.dislikes || 0}</span>
      </div>
    ;
    list.appendChild(el);
  });

  document.getElementById("confessionCounter").innerText = Total Confessions: ${entries.length};
});

window.likeConfession = function(id) {
  if (likedPosts.has(id)) return;
  likedPosts.add(id);
  dislikedPosts.delete(id);
  const postRef = ref(db, confessions/${id});
  update(postRef, {
    likes: (parseInt(document.querySelector([data-id="${id}"]).textContent.split(" ")[1]) || 0) + 1
  });
};

window.dislikeConfession = function(id) {
  if (dislikedPosts.has(id)) return;
  dislikedPosts.add(id);
  likedPosts.delete(id);
  const postRef = ref(db, confessions/${id});
  update(postRef, {
    dislikes: (parseInt(document.querySelector(.downvote[data-id="${id}"]).textContent.split(" ")[1]) || 0) + 1
  });
};

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
    if (count >= 1) return ${count} ${i.label}${count > 1 ? "s" : ""} ago;
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
