<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>🎯 FocalPoint Moodboard</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="brand">FocalPoint</div>

    <ul class="menu">
      <li><a href="home.php" class="link-page">🏠 Home</a></li>
      <li><button class="nav-btn" data-page="pageMoodboard">🎨 Moodboard</button></li>
      <li><button class="nav-btn" data-page="pageLikes">❤️ Liked Photos</button></li>
      <li><button class="nav-btn" data-page="pageFolders">📁 My Folders</button></li>
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

  <!-- Main Content -->
  <div class="container">
    <!-- 🎨 Moodboard Page -->
    <section id="pageMoodboard" class="page active">
      <header class="topbar">
        <h1>🎯 FocalPoint Moodboard</h1>
        <div class="top-actions">
          <button id="downloadBoard" class="btn secondary">Download PNG</button>
        </div>
      </header>

      <section class="controls">
        <form id="moodForm" autocomplete="off">
  <input type="text" id="query" placeholder="Try: minimalist workspace, cozy café..." required />
  <button type="submit" class="btn primary">Generate</button>
</form>


        <div class="action-row">
          <button id="loadMore" class="btn outline" style="display:none;">Load More</button>
          <button id="saveBoard" class="btn ghost">Save Board to Folder</button>
          <button id="viewBoards" class="btn ghost">View Saved</button>
        </div>
      </section>

      <section id="boardWrapper">
        <div id="gallery" class="gallery"></div>
      </section>

      <p id="error" class="error"></p>
    </section>

    <!-- ❤️ Liked Photos Page -->
    <section id="pageLikes" class="page">
      <header class="topbar">
        <h1>❤️ Liked Photos</h1>
      </header>

      <section id="likesWrapper" class="controls">
        <div id="likesGallery" class="gallery"></div>
        <p id="likesMessage" class="muted">No liked photos yet. Try liking some from the Moodboard!</p>
      </section>
    </section>

    <!-- 📁 My Folders Page -->
    <section id="pageFolders" class="page">
      <header class="topbar">
        <h1>📁 My Folders</h1>
        <button id="createFolder" class="btn accent small">+ New Folder</button>
      </header>

      <section id="folderWrapper" class="controls">
        <div id="folderListPage" class="gallery"></div>
        <p id="folderMessage" class="muted">No folders created yet.</p>
      </section>
    </section>
  </div>

  <!-- Popup -->
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
</body>
</html>
