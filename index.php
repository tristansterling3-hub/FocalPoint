<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🎨 FocalPoint</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
</head>
<body>
  <header class="main-header">
    <div class="header-content">
      <h2>🎨 FocalPoint</h2>
      <nav>
        <ul>
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Gallery</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="sidebar">
    <div class="search-container">
      <input type="text" id="sidebarSearch" placeholder="Search galleries...">
      <i class="fas fa-search search-icon"></i>
    </div>
    <div class="sidebar-menu">
      <h3>Categories</h3>
      <ul>
          <li><a href="#" class="category-filter" data-category="food"><i class="fas fa-utensils"></i> Food</a></li>
          <li><a href="#" class="category-filter" data-category="architecture"><i class="fas fa-building"></i> Architecture</a></li>
          <li><a href="#" class="category-filter" data-category="travel"><i class="fas fa-plane"></i> Travel</a></li>
          <li><a href="#" class="category-filter" data-category="music"><i class="fas fa-music"></i> Music</a></li>
          <li><a href="#" class="category-filter" data-category="lifestyle"><i class="fas fa-heart"></i> Lifestyle</a></li>
          <li><a href="#" class="category-filter" data-category="technology"><i class="fas fa-microchip"></i> Technology</a></li>
          <li><a href="#" class="category-filter active" data-category="all"><i class="fas fa-globe"></i> All Categories</a></li>
      </ul>
    </div>
  </div>

  <div class="main-content">
  <div class="container">
  <h1>🎨 FocalPoint</h1>
    <p>Enter a mood or theme and get AI-curated images from Unsplash!</p>

    <form id="moodForm">
      <input type="text" id="query" name="query" placeholder="e.g. futuristic tech, cozy café" required />
      <button type="submit">Generate Moodboard</button>
    </form>

    <div id="gallery" class="gallery"></div>

    <!-- Load More button (hidden until needed) -->
    <button id="loadMore" style="display:none;">Load More</button>

    <p id="error" class="error"></p>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
