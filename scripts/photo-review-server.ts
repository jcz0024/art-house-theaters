import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const PHOTOS_DIR = "./theater-photos";
const SELECTIONS_FILE = "./theater-photos/selections.json";
const PORT = 3457;

// Load existing selections or create empty object
function loadSelections(): Record<string, { selected: number[]; skip: boolean; notes: string }> {
  if (fs.existsSync(SELECTIONS_FILE)) {
    return JSON.parse(fs.readFileSync(SELECTIONS_FILE, "utf-8"));
  }
  return {};
}

// Save selections
function saveSelections(selections: Record<string, { selected: number[]; skip: boolean; notes: string }>) {
  fs.writeFileSync(SELECTIONS_FILE, JSON.stringify(selections, null, 2));
}

// Get all theater folders
function getTheaters(): string[] {
  return fs.readdirSync(PHOTOS_DIR)
    .filter(f => {
      const stat = fs.statSync(path.join(PHOTOS_DIR, f));
      return stat.isDirectory();
    })
    .sort();
}

// Get photos for a theater
function getPhotos(slug: string): string[] {
  const dir = path.join(PHOTOS_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".jpg"))
    .sort();
}

// Serve image file
function serveImage(res: http.ServerResponse, slug: string, filename: string) {
  const filepath = path.join(PHOTOS_DIR, slug, filename);
  if (!fs.existsSync(filepath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const data = fs.readFileSync(filepath);
  res.writeHead(200, { "Content-Type": "image/jpeg" });
  res.end(data);
}

// HTML template
function getHTML(theaters: string[], selections: Record<string, any>): string {
  const reviewed = Object.keys(selections).length;
  const total = theaters.length;

  return `<!DOCTYPE html>
<html>
<head>
  <title>Theater Photo Review</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #111;
      color: #fff;
      min-height: 100vh;
    }
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #222;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
      border-bottom: 1px solid #333;
    }
    .progress { color: #888; }
    .progress strong { color: #4ade80; }
    .nav-buttons { display: flex; gap: 8px; }
    .nav-buttons button {
      padding: 8px 16px;
      background: #333;
      border: none;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    .nav-buttons button:hover { background: #444; }
    .nav-buttons button.primary { background: #2563eb; }
    .nav-buttons button.primary:hover { background: #1d4ed8; }
    .main {
      padding-top: 70px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .theater-header {
      padding: 20px;
      text-align: center;
    }
    .theater-header h1 { font-size: 24px; margin-bottom: 8px; }
    .theater-header .slug { color: #666; font-size: 14px; }
    .theater-header .status {
      margin-top: 8px;
      font-size: 14px;
    }
    .theater-header .status.reviewed { color: #4ade80; }
    .theater-header .status.skipped { color: #f87171; }
    .photos {
      display: flex;
      gap: 16px;
      padding: 0 20px 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .photo-card {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      border: 3px solid transparent;
    }
    .photo-card:hover { transform: scale(1.02); }
    .photo-card.selected {
      border-color: #4ade80;
      box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
    }
    .photo-card img {
      display: block;
      width: 400px;
      height: 300px;
      object-fit: cover;
    }
    .photo-card .number {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 14px;
    }
    .photo-card.selected .number {
      background: #4ade80;
      color: #000;
    }
    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 20px;
      flex-wrap: wrap;
    }
    .actions button {
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .actions .skip { background: #374151; color: #fff; }
    .actions .skip:hover { background: #4b5563; }
    .actions .skip.active { background: #dc2626; }
    .actions .save { background: #16a34a; color: #fff; }
    .actions .save:hover { background: #15803d; }
    .actions .save:disabled { background: #374151; cursor: not-allowed; }
    .notes-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 20px 40px;
    }
    .notes-container textarea {
      width: 100%;
      padding: 12px;
      background: #222;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      resize: vertical;
      min-height: 60px;
    }
    .notes-container textarea:focus {
      outline: none;
      border-color: #4ade80;
    }
    .notes-container label {
      display: block;
      margin-bottom: 8px;
      color: #888;
      font-size: 14px;
    }
    .keyboard-hint {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 13px;
    }
    .keyboard-hint kbd {
      background: #333;
      padding: 2px 8px;
      border-radius: 4px;
      margin: 0 2px;
    }
    .jump-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .jump-input input {
      width: 60px;
      padding: 8px;
      background: #333;
      border: 1px solid #444;
      border-radius: 6px;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
    .jump-input input:focus {
      outline: none;
      border-color: #4ade80;
    }
    .export-section {
      text-align: center;
      padding: 40px 20px;
      border-top: 1px solid #333;
      margin-top: 40px;
    }
    .export-section button {
      padding: 12px 24px;
      font-size: 16px;
      background: #7c3aed;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .export-section button:hover { background: #6d28d9; }
  </style>
</head>
<body>
  <div class="header">
    <div class="progress">
      <strong>${reviewed}</strong> / ${total} reviewed
    </div>
    <div class="nav-buttons">
      <div class="jump-input">
        <span style="color: #888">Go to:</span>
        <input type="number" id="jumpInput" min="1" max="${total}" placeholder="#">
      </div>
      <button onclick="jumpToUnreviewed()">Next Unreviewed</button>
      <button onclick="prev()">← Prev</button>
      <button onclick="next()" class="primary">Next →</button>
    </div>
  </div>

  <div class="main">
    <div class="theater-header">
      <h1 id="theaterName">Loading...</h1>
      <div class="slug" id="theaterSlug"></div>
      <div class="status" id="theaterStatus"></div>
    </div>

    <div class="photos" id="photos"></div>

    <div class="actions">
      <button class="skip" id="skipBtn" onclick="toggleSkip()">Skip (No Good Photos)</button>
      <button class="save" id="saveBtn" onclick="saveAndNext()" disabled>Save & Next</button>
    </div>

    <div class="notes-container">
      <label>Notes (optional)</label>
      <textarea id="notes" placeholder="Any notes about this theater's photos..."></textarea>
    </div>

    <div class="keyboard-hint">
      <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> Select photo &nbsp;|&nbsp;
      <kbd>S</kbd> Skip &nbsp;|&nbsp;
      <kbd>Enter</kbd> Save & Next &nbsp;|&nbsp;
      <kbd>←</kbd> <kbd>→</kbd> Navigate
    </div>

    <div class="export-section">
      <button onclick="exportSelections()">Export Final Selections (JSON)</button>
    </div>
  </div>

  <script>
    const theaters = ${JSON.stringify(theaters)};
    const selections = ${JSON.stringify(selections)};
    let currentIndex = 0;
    let currentSelection = { selected: [false, false, false], skip: false, notes: "" };

    function render() {
      const slug = theaters[currentIndex];
      const saved = selections[slug];

      // Reset current selection
      if (saved && saved.selected) {
        // Convert array of numbers [1,3] to boolean array [true, false, true]
        const sel = [false, false, false];
        saved.selected.forEach(n => { if (n >= 1 && n <= 3) sel[n-1] = true; });
        currentSelection = { selected: sel, skip: saved.skip || false, notes: saved.notes || "" };
      } else {
        currentSelection = { selected: [false, false, false], skip: false, notes: "" };
      }

      // Update header
      document.getElementById("theaterName").textContent = slug.replace(/-/g, " ").replace(/\\b\\w/g, c => c.toUpperCase());
      document.getElementById("theaterSlug").textContent = slug + " (" + (currentIndex + 1) + " of " + theaters.length + ")";

      // Update status
      const statusEl = document.getElementById("theaterStatus");
      if (saved) {
        if (saved.skip) {
          statusEl.textContent = "⏭ Skipped";
          statusEl.className = "status skipped";
        } else {
          const selectedNums = saved.selected.filter(n => n > 0);
          const photoText = selectedNums.length === 1
            ? "Photo " + selectedNums[0] + " selected"
            : "Photos " + selectedNums.join(", ") + " selected";
          statusEl.textContent = "✓ Reviewed - " + photoText;
          statusEl.className = "status reviewed";
        }
      } else {
        statusEl.textContent = "Not yet reviewed";
        statusEl.className = "status";
      }

      // Update photos
      const photosEl = document.getElementById("photos");
      photosEl.innerHTML = "";
      for (let i = 1; i <= 3; i++) {
        const card = document.createElement("div");
        const isSelected = currentSelection.selected[i-1] === true;
        card.className = "photo-card" + (isSelected ? " selected" : "");
        card.onclick = () => togglePhoto(i);
        const checkmark = isSelected ? "✓ " : "";
        card.innerHTML = '<img src="/image/' + slug + '/' + i + '.jpg" alt="Photo ' + i + '" onerror="this.parentElement.style.display=\\'none\\'">' +
          '<div class="number">' + checkmark + i + '</div>';
        photosEl.appendChild(card);
      }

      // Update skip button
      const skipBtn = document.getElementById("skipBtn");
      skipBtn.className = "skip" + (currentSelection.skip ? " active" : "");
      skipBtn.textContent = currentSelection.skip ? "Skipped ✓" : "Skip (No Good Photos)";

      // Update save button
      const hasSelection = currentSelection.selected.some(s => s === true);
      document.getElementById("saveBtn").disabled = !hasSelection && !currentSelection.skip;

      // Update notes
      document.getElementById("notes").value = currentSelection.notes || "";

      // Update jump input
      document.getElementById("jumpInput").value = currentIndex + 1;
    }

    function togglePhoto(num) {
      currentSelection.selected[num-1] = !currentSelection.selected[num-1];
      currentSelection.skip = false;
      render();
    }

    function toggleSkip() {
      currentSelection.skip = !currentSelection.skip;
      if (currentSelection.skip) {
        currentSelection.selected = [false, false, false];
      }
      render();
    }

    async function save() {
      const slug = theaters[currentIndex];
      currentSelection.notes = document.getElementById("notes").value;

      // Convert boolean array to number array for storage [true, false, true] -> [1, 3]
      const selectedNums = [];
      currentSelection.selected.forEach((val, idx) => {
        if (val) selectedNums.push(idx + 1);
      });
      const toSave = { selected: selectedNums, skip: currentSelection.skip, notes: currentSelection.notes };

      await fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, selection: toSave })
      });

      selections[slug] = toSave;

      // Update progress count
      const reviewed = Object.keys(selections).length;
      document.querySelector(".progress").innerHTML = "<strong>" + reviewed + "</strong> / " + theaters.length + " reviewed";
    }

    async function saveAndNext() {
      await save();
      next();
    }

    function next() {
      if (currentIndex < theaters.length - 1) {
        currentIndex++;
        render();
      }
    }

    function prev() {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    }

    function jumpTo(index) {
      if (index >= 0 && index < theaters.length) {
        currentIndex = index;
        render();
      }
    }

    function jumpToUnreviewed() {
      for (let i = currentIndex + 1; i < theaters.length; i++) {
        if (!selections[theaters[i]]) {
          currentIndex = i;
          render();
          return;
        }
      }
      // Wrap around
      for (let i = 0; i < currentIndex; i++) {
        if (!selections[theaters[i]]) {
          currentIndex = i;
          render();
          return;
        }
      }
      alert("All theaters have been reviewed!");
    }

    function exportSelections() {
      const data = JSON.stringify(selections, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "theater-photo-selections.json";
      a.click();
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ignore if typing in textarea or input
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
        if (e.key === "Escape") e.target.blur();
        return;
      }

      if (e.key === "1") togglePhoto(1);
      if (e.key === "2") togglePhoto(2);
      if (e.key === "3") togglePhoto(3);
      if (e.key === "s" || e.key === "S") toggleSkip();
      const hasSelection = currentSelection.selected.some(s => s === true);
      if (e.key === "Enter" && (hasSelection || currentSelection.skip)) saveAndNext();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Jump input
    document.getElementById("jumpInput").addEventListener("change", (e) => {
      const num = parseInt(e.target.value, 10);
      if (num >= 1 && num <= theaters.length) {
        jumpTo(num - 1);
      }
    });

    // Initial render
    render();
  </script>
</body>
</html>`;
}

// Create server
const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);

  // Serve image
  if (url.pathname.startsWith("/image/")) {
    const parts = url.pathname.replace("/image/", "").split("/");
    const slug = parts[0];
    const filename = parts[1];
    serveImage(res, slug, filename);
    return;
  }

  // Save selection
  if (url.pathname === "/save" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const { slug, selection } = JSON.parse(body);
      const selections = loadSelections();
      selections[slug] = selection;
      saveSelections(selections);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // Main page
  const theaters = getTheaters();
  const selections = loadSelections();
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });
  res.end(getHTML(theaters, selections));
});

server.listen(PORT, () => {
  console.log(`\n🎬 Photo Review Tool running at http://localhost:${PORT}\n`);
  console.log("Keyboard shortcuts:");
  console.log("  1, 2, 3  - Select photo");
  console.log("  S        - Skip theater");
  console.log("  Enter    - Save & Next");
  console.log("  ← →      - Navigate\n");
});
