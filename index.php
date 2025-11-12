<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>🎯 FocalPoint – AI Moodboard Generator</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="brand">FocalPoint</div>
    <ul class="menu">
      <li><button id="newBoard" class="linklike">➕ New Board</button></li>
      <li><button id="savedBoards" class="linklike">💾 Saved Boards</button></li>
      <li><button id="toggleTheme" class="linklike">🌓 Toggle Theme</button></li>
      <li><a class="ext" href="https://unsplash.com" target="_blank" rel="noopener">📸 Unsplash</a></li>
      <li><a class="ext" href="https://github.com" target="_blank" rel="noopener">🐙 GitHub</a></li>
    </ul>
    <div class="sidebar-footer">© 2025 Tristan Sterling</div>
  </aside>

  <!-- Main content -->
  <div class="container">
    <header class="topbar">
      <h1>🎯 FocalPoint</h1>
      <div class="top-actions">
        <button id="downloadBoard" class="btn secondary">Download Moodboard</button>
      </div>
    </header>

    <!-- Search / Actions -->
    <section class="controls">
      <form id="moodForm" autocomplete="off">
        <input type="text" id="query" name="query" placeholder="Try: minimalist workspace, cozy café, cyberpunk neon" required/>
        <button type="submit" class="btn primary">Generate Moodboard</button>
      </form>

      <div class="action-row">
        <button id="loadMore" class="btn outline" style="display:none;">Load More</button>
        <button id="saveBoard" class="btn ghost">Save Board</button>
        <button id="viewBoards" class="btn ghost">View Saved</button>
      </div>
    </section>

    <!-- Board -->
    <section id="boardWrapper">
      <div id="gallery" class="gallery"></div>
    </section>

    <p id="error" class="error"></p>
  </div>

  <!-- Libraries for features -->
  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.2/color-thief.umd.js"></script>

  <!-- App logic -->
  <script src="script.js"></script>
</body>
</html>
