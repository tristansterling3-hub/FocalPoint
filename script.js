let currentPage = 1;
let currentQuery = "";
let currentCategory = "all";
const accessKey = "L4qf31bFXKpPBkP5bHzil-pLepiex28oQPu9m819ZNo"; // your Unsplash Access Key

const form = document.getElementById("moodForm");
const gallery = document.getElementById("gallery");
const errorMsg = document.getElementById("error");
const loadMoreBtn = document.getElementById("loadMore");
const categoryLinks = document.querySelectorAll('.category-filter');
const mainSearchInput = document.getElementById('query');
const sidebarSearchInput = document.getElementById('sidebarSearch');

function setActiveCategory(category) {
  if (!categoryLinks) return;
  categoryLinks.forEach(l => {
    if (l.getAttribute('data-category') === category) l.classList.add('active');
    else l.classList.remove('active');
  });
}

// Category click -> use category as the search term
if (categoryLinks) {
  categoryLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const category = link.getAttribute('data-category');
      currentCategory = category || 'all';
        // keep any typed query; we'll combine category + query when searching
        currentQuery = (mainSearchInput.value || '').trim();
      setActiveCategory(currentCategory);

      currentPage = 1;
      gallery.innerHTML = '';
      errorMsg.textContent = 'Loading images...';
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';

      await loadImages();
    });
  });
}

// Main form submit -> use text input as search across all categories
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    currentQuery = (mainSearchInput.value || '').trim();
    // keep the currentCategory so searches combine (category + query)

    if (!currentQuery) return;

    currentPage = 1;
    gallery.innerHTML = '';
    errorMsg.textContent = 'Loading images...';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    await loadImages();
  });
}

// Optional: allow the small sidebar search box to submit on Enter
if (sidebarSearchInput) {
  sidebarSearchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      currentQuery = (sidebarSearchInput.value || '').trim();
      // keep currentCategory so sidebar search combines with selected category if any

      if (!currentQuery) return;

      currentPage = 1;
      gallery.innerHTML = '';
      errorMsg.textContent = 'Loading images...';
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';

      await loadImages();
    }
  });
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    await loadImages();
  });
}

async function loadImages() {
  // Combine category + query when both exist. Examples:
  // - category=technology, query=neon -> "technology neon"
  // - category=technology, query empty -> "technology"
  // - category=all, query=neon -> "neon"
  const q = (currentQuery || '').trim();
  let searchTerm = '';
  if (currentCategory && currentCategory !== 'all') {
    searchTerm = q ? `${currentCategory} ${q}` : currentCategory;
  } else {
    searchTerm = q;
  }
  if (!searchTerm) {
    errorMsg.textContent = 'Please enter a search term or select a category.';
    return;
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&page=${currentPage}&per_page=30&client_id=${accessKey}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch images.');

    const data = await response.json();

    if (currentPage === 1) gallery.innerHTML = '';
    errorMsg.textContent = '';

    if (!data.results || data.results.length === 0) {
      if (currentPage === 1) {
        errorMsg.textContent = 'No images found. Try another keyword.';
      } else {
        errorMsg.textContent = 'No more images to load.';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      }
      return;
    }

    data.results.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.urls.small;
      img.alt = photo.alt_description || 'Moodboard image';
      gallery.appendChild(img);
    });

    if (data.total_pages && data.total_pages > currentPage) {
      if (loadMoreBtn) loadMoreBtn.style.display = 'block';
    } else {
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'Error loading images. Please check your API key or network connection.';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  }
}
