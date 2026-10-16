// 1. Select all the elements
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// Keys used in localStorage
const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

// Character limits
const WARNING_LIMIT = 180;
const MAX_LIMIT = 200;

// 2. Updates both counters and the warning classes
function updateCounts() {
  const text = noteText.value;
  const characters = text.length;
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  charCount.textContent = `${characters} / ${MAX_LIMIT} characters`;
  wordCount.textContent = `${words} words`;

  // Orange when over 180 characters, red and bold when over 200
  charCount.classList.toggle("warning", characters > WARNING_LIMIT);
  charCount.classList.toggle("over", characters > MAX_LIMIT);
}

// Saves the current text as a draft
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, noteText.value);
}

// Empties the textarea, resets the counters and removes the saved draft
function clearAll() {
  noteText.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  noteText.focus();
}

// Shows the correct theme and button label
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

// 3. Update counters and save the draft on every input event
noteText.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

// Clear button empties everything
clearBtn.addEventListener("click", clearAll);

// Pressing Escape inside the textarea also clears everything
noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
  }
});

// Theme button toggles dark mode and remembers the choice
themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// 4. When the page loads, restore the draft and theme, then update the counters
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft !== null) {
  noteText.value = savedDraft;
}

applyTheme(localStorage.getItem(THEME_KEY) === "dark");
updateCounts();
