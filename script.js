// ============================================================
// EDIT YOUR CONTENT HERE
// Change the level names, codes and task text below.
// ============================================================

const LEVELS = [
  {
    id: 1,
    name: "LVL 1",
    code: "46",
    content: "Sprawdź odpowiedź do zadania 1."
  },
  {
    id: 2,
    name: "LVL 2",
    code: "874",
    content: "Sprawdź odpowiedź do zadania 2."
  },
  {
    id: 3,
    name: "LVL 3",
    code: "4872",
    content: "Sprawdź odpowiedź do zadania 3."
  },
  {
    id: 4,
    name: "LVL 4",
    code: "2",
    content: "Sprawdź odpowiedź do zadania 4."
  },
  {
    id: 5,
    name: "LVL 5",
    code: "428",
    content: "Sprawdź odpowiedź do zadania 5."
  },
  {
    id: 6,
    name: "LVL 6",
    code: "28",
    content: "Sprawdź odpowiedź do zadania 6."
  }
];

// ============================================================
// PAGE LOGIC
// Normally you do not need to edit anything below this line.
// ============================================================

function normalize(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

const levelGrid = document.getElementById("levelGrid");
const modal = document.getElementById("levelModal");
const closeModal = document.getElementById("closeModal");
const backButton = document.getElementById("backButton");
const modalTitle = document.getElementById("modalTitle");
const levelContent = document.getElementById("levelContent");
const codeForm = document.getElementById("codeForm");
const codeInput = document.getElementById("codeInput");
const feedback = document.getElementById("feedback");

let activeLevel = null;
let completedLevels = new Set();

try {
  const saved = JSON.parse(localStorage.getItem("pixelLevelCheckCompleted") || "[]");
  completedLevels = new Set(saved.filter((id) => LEVELS.some((level) => level.id === id)));
} catch (_) {
  completedLevels = new Set();
}

function saveProgress() {
  try {
    localStorage.setItem("pixelLevelCheckCompleted", JSON.stringify([...completedLevels]));
  } catch (_) {}
}

function renderLevels() {
  levelGrid.innerHTML = "";

  LEVELS.forEach((level) => {
    const card = document.createElement("article");
    card.className = "level-card";
    card.innerHTML = `
      <div>
        <div class="level-top">
          <h2 class="level-name">${level.name}</h2>
          <div class="status">${completedLevels.has(level.id) ? "CODE ACCEPTED" : ""}</div>
        </div>
        <p class="level-hint">OPEN LEVEL TO VIEW THE CONTENT AND VERIFY THE CODE.</p>
      </div>
      <button class="open-level" type="button" data-level-id="${level.id}">OPEN LEVEL</button>
    `;

    levelGrid.appendChild(card);
  });

  document.querySelectorAll(".open-level").forEach((button) => {
    button.addEventListener("click", () => openLevel(Number(button.dataset.levelId)));
  });
}

function openLevel(levelId) {
  const level = LEVELS.find((item) => item.id === levelId);
  if (!level) return;

  activeLevel = levelId;
  modalTitle.textContent = level.name;
  levelContent.innerHTML = level.content;
  codeInput.value = "";
  feedback.textContent = completedLevels.has(levelId) ? "CODE ACCEPTED" : "";
  feedback.className = completedLevels.has(levelId) ? "feedback success" : "feedback";
  modal.classList.remove("hidden");

  setTimeout(() => codeInput.focus(), 50);
}

function closeLevel() {
  modal.classList.add("hidden");
  activeLevel = null;
  codeInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
}

codeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const level = LEVELS.find((item) => item.id === activeLevel);
  if (!level) return;

  if (normalize(codeInput.value) === normalize(level.code)) {
    completedLevels.add(level.id);
    saveProgress();
    feedback.textContent = "GOOD CODE";
    feedback.className = "feedback success";
    renderLevels();
  } else {
    feedback.textContent = "INCORRECT CODE";
    feedback.className = "feedback error";
  }
});

closeModal.addEventListener("click", closeLevel);
backButton.addEventListener("click", closeLevel);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeLevel();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeLevel();
  }
});

renderLevels();
