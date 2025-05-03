import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase setup
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

const confessionsList = document.getElementById("confessionsList");
const confessionInput = document.getElementById("confessionInput");
const nicknameInput = document.getElementById("nickname");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");

// Dark Mode Toggle
const darkToggle = document.getElementById("darkModeToggle");
const body = document.body;
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark");
}

darkToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("darkMode", body.classList.contains("dark"));
});

// Add confession to Firebase
submitBtn.addEventListener("click", function () {
  const nickname = nicknameInput.value.trim();
  const confessionText = confessionInput.value.trim();
  const category = categorySelect.value;

  // Simple logging to check if the function is triggered
  console.log("Button clicked!");
  console.log("Nickname:", nickname, "Confession:", confessionText, "Category:", category);

  if (nickname && confessionText) {
    const confessionRef = ref(db, 'confessions/' + Date.now());
    set(confessionRef, {
      nickname: nickname,
      text: confessionText,
      category: category,
      timestamp: Date.now()
    }).then(() => {
      // Reset the form inputs after submission
      confessionInput.value = "";
      nicknameInput.value = "";
    }).catch((error) => {
      console.error("Error posting confession:", error);
    });
  } else {
    alert("Please enter a nickname and confession!");
  }
});

// Real-time confessions update
onValue(ref(db, 'confessions'), (snapshot) => {
  confessionsList.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const confession = childSnapshot.val();
    const confessionElement = document.createElement("div");
    confessionElement.classList.add("confession");
    confessionElement.dataset.category = confession.category;

    confessionElement.innerHTML = `
      <h3>${confession.nickname}</h3>
      <p>${confession.text}</p>
      <p class="timestamp">${new Date(confession.timestamp).toLocaleString()}</p>
    `;
    confessionsList.appendChild(confessionElement);
  });
});

// Emoji input handling
const emojis = document.querySelectorAll('.emoji');
emojis.forEach(emoji => {
  emoji.onclick = () => confessionInput.value += emoji.textContent;
});

// Category filter
const filterButtons = document.querySelectorAll('.filterBtn');
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.filter;
    const confs = document.querySelectorAll('.confession');
    confs.forEach(c => {
      c.style.display = (category === 'all' || c.dataset.category === category) ? 'block' : 'none';
    });
  });
});
