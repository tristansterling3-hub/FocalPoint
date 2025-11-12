/* ====== GLOBAL SETTINGS ====== */
const ACCESS_KEY = "YOUR-ACCESS-KEY";
let currentQuery = "";
let currentPage = 1;

// Apply dark mode if saved
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") document.body.classList.add("dark-mode");

document.addEventListener("click", e => {
  if (e.target.id === "toggleTheme") {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  }
});

/* ====== INTERNAL PAGE NAVIGATION ====== */
document.querySelectorAll("button.nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const pageId = btn.getAttribute("data-page");
    if (!pageId) return;
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    // Highlight active sidebar button
    document.querySelectorAll("button.nav-btn").forEach(b => b.classList.remove("active-btn"));
    btn.classList.add("active-btn");

    if (pageId === "pageLikes") renderLikedPhotos();
    if (pageId === "pageFolders") renderFolderPage();
  });
});

/* ====== ACTIVE SIDEBAR STYLES ====== */
const style = document.createElement("style");
style.innerHTML = `
.active-btn { background: #0078ff !important; color: white !important; }
.link-page { display: block; padding: 10px; color: #ddd; text-decoration: none; border-radius: 6px; transition: 0.3s; }
.link-page:hover { background: #222; color: #fff; }
`;
document.head.appendChild(style);

/* ====== FILTER BUTTONS (SMART FILTERS WITH FALLBACK) ====== */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const filterWord = btn.getAttribute("data-theme");
    if (!filterWord) return;

    const input = document.getElementById("query");
    const gallery = document.getElementById("gallery");
    const homeGallery = document.getElementById("homeGallery");
    const homeMessage = document.getElementById("homeMessage");

    const baseQuery = (input && input.value.trim()) || currentQuery || "";
    const isSearchEmpty = !baseQuery;
    currentQuery = isSearchEmpty ? filterWord : `${baseQuery} ${filterWord}`;
    currentPage = 1;

    // Highlight active filter
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Case 1: Home Page filtering
    if (homeGallery && homeGallery.offsetParent !== null) {
      homeMessage.textContent = isSearchEmpty
        ? `Showing random ${filterWord} inspiration...`
        : `Fetching ${currentQuery}...`;

      try {
        // Use random endpoint if no search term
        const endpoint = isSearchEmpty
          ? `https://api.unsplash.com/photos/random?count=15&query=${encodeURIComponent(
              filterWord
            )}&client_id=${ACCESS_KEY}`
          : `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              currentQuery
            )}&per_page=15&client_id=${ACCESS_KEY}`;

        const res = await fetch(endpoint);
        const data = await res.json();

        homeGallery.innerHTML = "";
        const results = isSearchEmpty ? data : data.results;

        results.forEach(photo => {
          const card = document.createElement("div");
          card.className = "card";
          const img = document.createElement("img");
          img.src = photo.urls.small;
          img.alt = currentQuery;
          img.addEventListener("click", () => openModal(photo));
          card.appendChild(img);
          homeGallery.appendChild(card);
        });

        homeMessage.textContent = "";
      } catch {
        homeMessage.textContent = "⚠️ Could not load images.";
      }
    }

    // Case 2: Moodboard/Search page
    else if (gallery) {
      gallery.innerHTML = "<p class='muted'>Applying filter...</p>";
      try {
        // If no base search, fetch random filter images
        if (isSearchEmpty) {
          const res = await fetch(
            `https://api.unsplash.com/photos/random?count=15&query=${encodeURIComponent(
              filterWord
            )}&client_id=${ACCESS_KEY}`
          );
          const data = await res.json();
          gallery.innerHTML = "";
          data.forEach(photo => {
            const card = document.createElement("div");
            card.className = "card";
            const img = document.createElement("img");
            img.src = photo.urls.small;
            img.addEventListener("click", () => openModal(photo));
            card.appendChild(img);
            gallery.appendChild(card);
          });
        } else {
          await fetchImages(currentQuery, 1, gallery);
        }

        const loadMoreBtn = document.getElementById("loadMore");
        if (loadMoreBtn) loadMoreBtn.style.display = "block";
      } catch {
        gallery.innerHTML = "<p class='error'>Error loading filtered images.</p>";
      }
    }
  });
});

/* ====== FETCH FUNCTION ====== */
async function fetchImages(query, page, container) {
  container.innerHTML = "<p class='muted'>Loading...</p>";
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=15&client_id=${ACCESS_KEY}`
    );
    const data = await res.json();
    if (page === 1) container.innerHTML = "";
    data.results.forEach(photo => {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = photo.urls.small;
      img.addEventListener("click", () => openModal(photo));
      card.appendChild(img);
      container.appendChild(card);
    });
  } catch {
    container.innerHTML = "<p class='error'>Error loading images.</p>";
  }
}

/* ====== SEARCH BAR ====== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("moodForm");
  const gallery = document.getElementById("gallery");
  const loadMoreBtn = document.getElementById("loadMore");
  if (!form || !gallery) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const input = document.getElementById("query");
    currentQuery = input.value.trim();
    if (!currentQuery) return alert("Please enter a search term!");
    currentPage = 1;
    gallery.innerHTML = "<p class='muted'>Searching images...</p>";
    await fetchImages(currentQuery, currentPage, gallery);
    loadMoreBtn.style.display = "block";
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", async () => {
      if (!currentQuery) return;
      currentPage++;
      await fetchImages(currentQuery, currentPage, gallery);
    });
  }
});

/* ====== POPUP / MODAL ====== */
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const relatedGallery = document.getElementById("relatedGallery");

function openModal(photo) {
  modal.style.display = "flex";
  modal.dataset.photo = JSON.stringify(photo);
  modalImg.src = photo.urls.regular;
  updateModalButtons(photo.urls.small);

  // Load related photos by ID
  if (relatedGallery) loadRelatedImages(photo.id);
}

function openUrlInModal(url) {
  const photoObj = { urls: { small: url, regular: url } };
  modal.style.display = "flex";
  modalImg.src = url;
  modal.dataset.photo = JSON.stringify(photoObj);
  updateModalButtons(url);

  // Fallback: load related using keyword from URL
  if (relatedGallery) loadRelatedImages("", getKeywordFromUrl(url));
}

async function loadRelatedImages(photoId, queryFallback = "") {
  relatedGallery.innerHTML = "<p class='muted'>Loading related images...</p>";

  try {
    let data;

    // Try official Unsplash "related" endpoint first if we have a photo ID
    if (photoId) {
      const res = await fetch(
        `https://api.unsplash.com/photos/${photoId}/related?client_id=${ACCESS_KEY}`
      );
      if (res.ok) {
        const result = await res.json();
        data = result.results;
      }
    }

    // Fallback: keyword search when photoId missing or results empty
    if (!data || data.length === 0) {
      if (!queryFallback) {
        relatedGallery.innerHTML = "<p class='muted'>No related images found.</p>";
        return;
      }
      const search = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          queryFallback
        )}&per_page=8&client_id=${ACCESS_KEY}`
      );
      const searchData = await search.json();
      data = searchData.results;
    }

    // Render related thumbnails
    relatedGallery.innerHTML = "";
    data.forEach(p => {
      const img = document.createElement("img");
      img.src = p.urls.small;
      img.addEventListener("click", () => openModal(p));
      relatedGallery.appendChild(img);
    });
  } catch (err) {
    console.error("Related load error:", err);
    relatedGallery.innerHTML = "<p class='muted'>No related images.</p>";
  }
}



document.getElementById("closeModal").onclick = () => (modal.style.display = "none");

/* ====== LIKE / SAVE TOGGLE ====== */
const likeBtn = document.getElementById("likeImage");
const saveBtn = document.getElementById("saveImageToFolder");

function updateModalButtons(url) {
  const liked = JSON.parse(localStorage.getItem("likedImages") || "[]");
  likeBtn.textContent = liked.includes(url) ? "💔 Unlike" : "❤️ Like";
  likeBtn.dataset.liked = liked.includes(url);

  saveBtn.textContent = isImageInAnyFolder(url) ? "🗑 Remove from Folder" : "💾 Save to Folder";
}

function isImageInAnyFolder(url) {
  const folderData = JSON.parse(localStorage.getItem("folderBoards") || "{}");
  return Object.values(folderData).some(folder => folder.some(item => item.html.includes(url)));
}

if (likeBtn) {
  likeBtn.addEventListener("click", () => {
    const photo = JSON.parse(modal.dataset.photo);
    const liked = JSON.parse(localStorage.getItem("likedImages") || "[]");
    const idx = liked.indexOf(photo.urls.small);
    if (idx >= 0) {
      liked.splice(idx, 1);
      likeBtn.textContent = "❤️ Like";
    } else {
      liked.push(photo.urls.small);
      likeBtn.textContent = "💔 Unlike";
    }
    localStorage.setItem("likedImages", JSON.stringify(liked));
    alert("Likes updated!");
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const folderData = JSON.parse(localStorage.getItem("folderBoards") || "{}");
    const photo = JSON.parse(modal.dataset.photo);
    const url = photo.urls.small;

    // check if exists in any folder
    const exists = isImageInAnyFolder(url);
    if (exists) {
      for (const [folder, items] of Object.entries(folderData)) {
        folderData[folder] = items.filter(item => !item.html.includes(url));
      }
      localStorage.setItem("folderBoards", JSON.stringify(folderData));
      saveBtn.textContent = "💾 Save to Folder";
      alert("Removed from folders.");
      return;
    }

    const folderName = prompt("Enter folder name:");
    if (!folderName) return;
    if (!folderData[folderName]) folderData[folderName] = [];
    const html = `<div class='card'><img src='${url}'/></div>`;
    folderData[folderName].push({ html });
    localStorage.setItem("folderBoards", JSON.stringify(folderData));
    saveBtn.textContent = "🗑 Remove from Folder";
    alert(`Saved to folder: ${folderName}`);
  });
}

/* ====== LIKED PHOTOS PAGE ====== */
function renderLikedPhotos() {
  const gallery = document.getElementById("likesGallery");
  const message = document.getElementById("likesMessage");
  const liked = JSON.parse(localStorage.getItem("likedImages") || "[]");
  gallery.innerHTML = "";
  if (liked.length === 0) {
    message.style.display = "block";
    return;
  }
  message.style.display = "none";
  liked.forEach(url => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = url;
    img.addEventListener("click", () => openUrlInModal(url));
    card.appendChild(img);
    gallery.appendChild(card);
  });
}

/* ====== FOLDER PAGE ====== */
function renderFolderPage() {
  const folderList = document.getElementById("folderListPage");
  const message = document.getElementById("folderMessage");
  const folderData = JSON.parse(localStorage.getItem("folderBoards") || "{}");
  folderList.innerHTML = "";
  const folderNames = Object.keys(folderData);
  if (folderNames.length === 0) {
    message.style.display = "block";
    return;
  }
  message.style.display = "none";

  folderNames.forEach(folder => {
    const div = document.createElement("div");
    div.className = "folder-preview card";
    const title = document.createElement("h3");
    title.textContent = `📁 ${folder}`;

    const row = document.createElement("div");
    row.className = "preview-row";
    folderData[folder].slice(0, 4).forEach(item => {
      const temp = document.createElement("div");
      temp.innerHTML = item.html;
      const img = temp.querySelector("img");
      if (img) {
        const thumb = document.createElement("img");
        thumb.src = img.src;
        thumb.alt = folder;
        thumb.className = "clickable-folder-img";
        thumb.dataset.full = img.src;
        row.appendChild(thumb);
      }
    });

    // Delete Folder
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn small secondary";
    deleteBtn.textContent = "🗑 Delete Folder";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete folder '${folder}'?`)) {
        delete folderData[folder];
        localStorage.setItem("folderBoards", JSON.stringify(folderData));
        renderFolderPage();
      }
    });

    const openBtn = document.createElement("button");
    openBtn.className = "btn small accent";
    openBtn.textContent = "Open Folder";
    openBtn.addEventListener("click", () => openFolder(folder));

    div.appendChild(title);
    div.appendChild(row);
    div.appendChild(openBtn);
    div.appendChild(deleteBtn);
    folderList.appendChild(div);
  });
}

/* ====== FOLDER IMAGE CLICK ====== */
document.addEventListener("click", e => {
  if (e.target.matches(".clickable-folder-img")) {
    const url = e.target.dataset.full || e.target.src;
    openUrlInModal(url);
  }
});

/* ====== OPEN FOLDER VIEW ====== */
function openFolder(folderName) {
  const folderData = JSON.parse(localStorage.getItem("folderBoards") || "{}");
  const folder = folderData[folderName];
  if (!folder) return alert("Folder not found");
  const newWin = window.open("", "_blank");
  newWin.document.write(`<title>${folderName} - FocalPoint</title><style>body{font-family:Poppins,sans-serif;background:#121212;color:white;display:flex;flex-wrap:wrap;gap:10px;padding:20px;justify-content:center;}img{width:200px;height:200px;object-fit:cover;border-radius:10px;cursor:pointer;transition:transform 0.25s;}img:hover{transform:scale(1.05);}</style>`);
  folder.forEach(item => {
    const temp = document.createElement("div");
    temp.innerHTML = item.html;
    const img = temp.querySelector("img");
    if (img) newWin.document.write(img.outerHTML);
  });
}

/* ====== HOME PAGE ====== */
async function loadHomePage() {
  const homeGallery = document.getElementById("homeGallery");
  const homeTitle = document.getElementById("welcomeTitle");
  const homeMessage = document.getElementById("homeMessage");
  if (!homeGallery) return;

  const liked = JSON.parse(localStorage.getItem("likedImages") || "[]");
  const folderData = JSON.parse(localStorage.getItem("folderBoards") || "{}");
  const savedImages = [];

  Object.values(folderData).forEach(folder => {
    folder.forEach(b => {
      const div = document.createElement("div");
      div.innerHTML = b.html;
      const img = div.querySelector("img");
      if (img) savedImages.push(img.src);
    });
  });

  const combined = [...new Set([...liked, ...savedImages])];

  if (combined.length > 0) {
    homeTitle.textContent = "✨ Welcome Back — Your Inspiration Board";
    renderHomeImages(combined);
  } else {
    homeTitle.textContent = "🎯 Welcome to FocalPoint — Explore Inspiration";
    loadRandomImages();
  }

  document.getElementById("refreshHome").addEventListener("click", loadRandomImages);

  async function loadRandomImages() {
    homeMessage.textContent = "Fetching random inspiration...";
    try {
      const res = await fetch(`https://api.unsplash.com/photos/random?count=15&client_id=${ACCESS_KEY}`);
      const data = await res.json();
      renderHomeImages(data.map(p => p.urls.small));
      homeMessage.textContent = "";
    } catch {
      homeMessage.textContent = "⚠️ Could not load random images.";
    }
  }

  function renderHomeImages(urls) {
    homeGallery.innerHTML = "";
    urls.forEach(url => {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = url;
      img.addEventListener("click", () => openUrlInModal(url));
      card.appendChild(img);
      homeGallery.appendChild(card);
    });
  }
}
function getKeywordFromUrl(url) {
  // Tries to extract something meaningful from the image URL
  const parts = url.split("/");
  const guess = parts[parts.length - 2] || "inspiration";
  return guess.replace(/[-_0-9]/g, "");
}


document.addEventListener("DOMContentLoaded", loadHomePage);
