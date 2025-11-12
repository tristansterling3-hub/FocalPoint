/* =========================
   FocalPoint – App Logic
   ========================= */

// Replace this with your Unsplash Access Key (NOT secret key)
const ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY_HERE";

let currentPage = 1;
let currentQuery = "";

const form = document.getElementById("moodForm");
const queryInput = document.getElementById("query");
const gallery = document.getElementById("gallery");
const errorMsg = document.getElementById("error");
const loadMoreBtn = document.getElementById("loadMore");
const newBoardBtn = document.getElementById("newBoard");
const savedBoardsBtn = document.getElementById("savedBoards");
const toggleThemeBtn = document.getElementById("toggleTheme");
const saveBoardBtn = document.getElementById("saveBoard");
const viewBoardsBtn = document.getElementById("viewBoards");

// ================= Theme (persisted)
(function initTheme(){
  const savedTheme = localStorage.getItem("focalpoint_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
})();
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "focalpoint_theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

// ================= Generate / Load More
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentQuery = queryInput.value.trim();
  if (!currentQuery) return;

  currentPage = 1;
  gallery.innerHTML = loadingUI();
  errorMsg.textContent = "";
  loadMoreBtn.style.display = "none";

  await loadImages();
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage++;
  await loadImages();
});

async function loadImages() {
  try {
    const url =
      `https://api.unsplash.com/search/photos` +
      `?query=${encodeURIComponent(currentQuery)}` +
      `&page=${currentPage}&per_page=30&client_id=${ACCESS_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Unsplash request failed");
    const data = await res.json();

    if (currentPage === 1) gallery.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      if (currentPage === 1) {
        gallery.innerHTML = "";
        errorMsg.textContent = "No images found. Try another theme.";
      } else {
        errorMsg.textContent = "No more images to load.";
        loadMoreBtn.style.display = "none";
      }
      return;
    }

    renderImagesWithPalettes(data.results);

    // show Load More if more pages exist
    if (data.total_pages > currentPage) {
      loadMoreBtn.style.display = "inline-flex";
    } else {
      loadMoreBtn.style.display = "none";
    }

  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Error loading images. Check your API key or network.";
    loadMoreBtn.style.display = "none";
  }
}

function renderImagesWithPalettes(items){
  const colorThief = new ColorThief();
  items.forEach(photo => {
    const card = document.createElement("div");
    card.className = "card";

    const wrap = document.createElement("div");
    wrap.className = "imgwrap";

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = photo.urls.small;
    img.alt = photo.alt_description || "Moodboard image";

    wrap.appendChild(img);
    card.appendChild(wrap);

    // Palette container
    const pal = document.createElement("div");
    pal.className = "palette";

    img.addEventListener("load", () => {
      try {
        // getPalette(image, n) returns [[r,g,b], ...]
        const palette = colorThief.getPalette(img, 5);
        palette.forEach(rgb => {
          const sw = document.createElement("div");
          sw.className = "swatch";
          sw.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
          pal.appendChild(sw);
        });
      } catch(e){
        // silently ignore if crossOrigin blocks or similar
      }
    });

    card.appendChild(pal);
    gallery.appendChild(card);
  });
}

function loadingUI(){
  return `
    <div style="display:flex;align-items:center;gap:10px;justify-content:center;padding:16px;">
      <span class="loader"></span>
      <span>Loading images…</span>
    </div>
  `;
}

// ================= Board actions
newBoardBtn.addEventListener("click", () => {
  queryInput.value = "";
  currentQuery = "";
  currentPage = 1;
  gallery.innerHTML = "";
  errorMsg.textContent = "";
  loadMoreBtn.style.display = "none";
  queryInput.focus();
});

// Save current board (HTML snapshot) to localStorage
saveBoardBtn.addEventListener("click", () => {
  if (!gallery.children.length) {
    alert("Generate a moodboard first, then save.");
    return;
  }
  const boards = JSON.parse(localStorage.getItem("focalpoint_boards") || "[]");
  boards.push({
    id: Date.now(),
    query: currentQuery || "(untitled)",
    html: gallery.innerHTML,
    ts: new Date().toISOString()
  });
  localStorage.setItem("focalpoint_boards", JSON.stringify(boards));
  alert("Board saved!");
});

// View saved boards (renders them below)
viewBoardsBtn.addEventListener("click", () => {
  const boards = JSON.parse(localStorage.getItem("focalpoint_boards") || "[]");
  if (!boards.length) {
    alert("No saved boards yet.");
    return;
  }
  gallery.innerHTML = "";
  boards
    .slice() // copy
    .reverse() // newest first
    .forEach(b => {
      const section = document.createElement("div");
      section.style.marginBottom = "18px";
      const meta = document.createElement("div");
      meta.style.margin = "8px 0 6px";
      meta.style.color = "var(--muted)";
      meta.style.fontSize = ".95rem";
      meta.textContent = `Saved: ${new Date(b.ts).toLocaleString()} • Query: ${b.query}`;
      const box = document.createElement("div");
      box.className = "gallery";
      box.innerHTML = b.html;

      section.appendChild(meta);
      section.appendChild(box);
      gallery.appendChild(section);
    });

  errorMsg.textContent = "";
  loadMoreBtn.style.display = "none";
});

// Download current grid as PNG
document.getElementById("downloadBoard").addEventListener("click", async () => {
  if (!gallery.children.length) {
    alert("Nothing to download. Generate a board first.");
    return;
  }
  const boardWrapper = document.getElementById("boardWrapper");
  try {
    const canvas = await html2canvas(boardWrapper, {backgroundColor: null, useCORS: true});
    const link = document.createElement("a");
    link.download = "FocalPoint-Moodboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch(e){
    console.error(e);
    alert("Could not capture the board. Try again after images finish loading.");
  }
});

// Quick access buttons in sidebar
savedBoardsBtn.addEventListener("click", () => viewBoardsBtn.click());
