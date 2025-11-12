<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>🏠 FocalPoint Home</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="brand">FocalPoint</div>
    <ul class="menu">
      <li><a href="home.php" class="nav-btn">🏠 Home</a></li>
      <li><a href="index.php" class="nav-btn">🎨 Moodboard</a></li>
      <li><a href="index.php#pageLikes" class="nav-btn">❤️ Liked Photos</a></li>
      <li><a href="index.php#pageFolders" class="nav-btn">📁 My Folders</a></li>
      <li><button id="toggleTheme" class="linklike">🌓 Toggle Theme</button></li>
    </ul>
    <hr class="divider"/>
    <h3 class="side-heading">🎨 Filters</h3>
    <div class="filter-list">
      <button class="filter-btn" data-theme="nature">🌿 Nature</button>
      <button class="filter-btn" data-theme="architecture">🏙 Architecture</button>
      <button class="filter-btn" data-theme="fashion">👗 Fashion</button>
      <button class="filter-btn" data-theme="technology">💻 Technology</button>
      <button class="filter-btn" data-theme="travel">✈️ Travel</button>
    </div>
    <div class="sidebar-footer">© 2025 Tristan Sterling</div>
  </aside>

  <!-- Main Home Content -->
  <div class="container">
    <header class="topbar">
      <h1 id="welcomeTitle">🎯 Welcome to FocalPoint</h1>
      <div class="top-actions">
        <a href="index.php" class="btn primary">Explore Moodboard</a>
        <button id="refreshHome" class="btn outline">🔄 Refresh</button>
      </div>
    </header>

    <section id="homeGallery" class="gallery"></section>
    <p id="homeMessage" class="muted"></p>
  </div>

  <!-- Shared popup -->
  <div id="imageModal" class="popup">
    <div class="popup-content">
      <span id="closeModal" class="close">&times;</span>
      <img id="modalImage" src="" alt="Preview" />
      <div class="modal-actions">
        <button id="likeImage" class="btn accent">❤️ Like</button>
        <button id="saveImageToFolder" class="btn primary">💾 Save to Folder</button>
      </div>
      <div class="related">
        <h4>Related Images</h4>
        <div id="relatedGallery" class="related-gallery"></div>
      </div>
    </div>
  </div>

  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script src="script.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", loadHomePage);
  </script>
</body>
</html>
