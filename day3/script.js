// 1. Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const ALLOWED_CATEGORIES = ["personal", "work", "study"];

// Helper for testing edge cases: temporarily swaps in different notes,
// runs the function, then restores the original notes.
function withNotes(temporaryNotes, fn) {
  const savedNotes = notes;
  notes = temporaryNotes;
  const result = fn();
  notes = savedNotes;
  return result;
}

// 2. Returns every note whose text contains the word (ignores upper and lower case)
function searchNotes(word) {
  const search = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(search));
}

// 3. Returns the note with the most characters, or null if there are no notes
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  return notes.reduce((longest, note) =>
    note.text.length > longest.text.length ? note : longest
  );
}

// 4. Returns an object counting notes per category, e.g. { personal: 2, study: 2, work: 1 }
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category] = counts[note.category] + 1;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

// 5. Returns a summary sentence, e.g. "5 notes: 2 personal, 2 study, 1 work."
function getSummary() {
  if (notes.length === 0) {
    return "0 notes.";
  }
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";
  const parts = Object.entries(counts).map(
    ([category, count]) => `${count} ${category}`
  );
  return `${notes.length} ${word}: ${parts.join(", ")}.`;
}

// Cleans text so extra spaces and capital letters do not affect comparisons
function normalise(text) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

// 6. Returns true if a note with the same text (ignoring case and extra spaces) exists
function isDuplicate(text) {
  const target = normalise(text);
  return notes.some((note) => normalise(note.text) === target);
}

// 7. Adds a note only if the text is 1-200 characters, not a duplicate, and the category is allowed
function addNote(text, category) {
  const cleanText = text.trim();

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log("Not added: text must be between 1 and 200 characters.");
    return false;
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    console.log(`Not added: category must be personal, work or study (got "${category}").`);
    return false;
  }

  if (isDuplicate(cleanText)) {
    console.log(`Not added: a note with the text "${cleanText}" already exists.`);
    return false;
  }

  const newId = notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1;
  notes.push({ id: newId, text: cleanText, category: category });
  console.log(`Added note ${newId}: "${cleanText}" (${category})`);
  return true;
}

// ---------- 8. TESTS ----------

// searchNotes: normal case and no-results case
console.log("searchNotes('milk'):", searchNotes("milk"));
// Expected: [ { id: 1, text: "Buy milk and bread", category: "personal" } ]
console.log("searchNotes('xyz'):", searchNotes("xyz"));
// Expected: []

// longestNote: normal case and empty-list case
console.log("longestNote():", longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }
console.log("longestNote() with no notes:", withNotes([], longestNote));
// Expected: null

// countByCategory: normal case and empty-list case
console.log("countByCategory():", countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }
console.log("countByCategory() with no notes:", withNotes([], countByCategory));
// Expected: {}

// getSummary: normal case, single-note case, and empty-list case
console.log("getSummary():", getSummary());
// Expected: "5 notes: 2 personal, 2 study, 1 work."
console.log("getSummary() with one note:", withNotes([{ id: 1, text: "Call mum", category: "personal" }], getSummary));
// Expected: "1 note: 1 personal."
console.log("getSummary() with no notes:", withNotes([], getSummary));
// Expected: "0 notes."

// isDuplicate: duplicate with different case and spacing, and a new note
console.log("isDuplicate('  buy MILK and bread '):", isDuplicate("  buy MILK and bread "));
// Expected: true
console.log("isDuplicate('Call dad'):", isDuplicate("Call dad"));
// Expected: false

// addNote: successful add, then the failure cases
console.log("addNote('Plan the trip', 'personal'):", addNote("Plan the trip", "personal"));
// Expected: true (note added with id 6)
console.log("addNote('', 'work'):", addNote("", "work"));
// Expected: false (text is empty)
console.log("addNote('a' repeated 201 times, 'work'):", addNote("a".repeat(201), "work"));
// Expected: false (text is too long)
console.log("addNote('  call   MUM ', 'personal'):", addNote("  call   MUM ", "personal"));
// Expected: false (duplicate of "Call mum")
console.log("addNote('Plan a trip', 'fun'):", addNote("Plan a trip", "fun"));
// Expected: false (category not allowed)

// Summary after the successful add
console.log("getSummary() after adding:", getSummary());
// Expected: "6 notes: 3 personal, 2 study, 1 work."
