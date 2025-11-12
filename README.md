<img width="2510" height="1288" alt="image" src="https://github.com/user-attachments/assets/8b154b74-480d-4161-b251-35e717df971d" /><p align="center">
  <br>
  <em>Dark Mode — Personalized Inspiration Board</em>
</p>

---

# 🎯 FocalPoint – AI Moodboard Generator

FocalPoint is a **creative web-based inspiration and moodboard builder** powered by the **Unsplash API**.  
It helps designers, developers, and artists explore visual ideas, collect inspiration, and organize images into themed folders — all within a sleek, noir-inspired UI.

---

## 🖥️ Features

✅ **AI-Like Visual Inspiration Search**  
- Search any mood, style, or color concept (e.g., *“green futuristic design”*).  
- Combine with multiple filters like *Nature*, *Architecture*, *Fashion*, etc.

✅ **Dynamic Filters**  
- Apply or stack multiple filters to refine your moodboard.  
- Includes a **Clear Filters** button to reset easily.

✅ **Smart Home Page**  
- First-time users see a curated random feed.  
- Returning users see a personalized feed of their liked and saved photos.

✅ **Interactive Image Viewer**  
- Click on any image to magnify it in a centered modal window.  
- View related photos instantly, with options to Like or Save.

✅ **Like & Save System (Toggle-Based)**  
- ❤️ Liking an image adds it to the Liked Photos page; clicking again unlikes it.  
- 💾 Save photos to folders for easy project organization; click again to remove.

✅ **Folder Management**  
- Create, open, preview, or delete folders.  
- Folder previews show up to 4 thumbnails per folder.  
- Open a folder in a new window to view all saved images.

✅ **Moodboard Downloading**  
- Export your current gallery as a PNG file using **html2canvas**.

✅ **Dark / Light Theme**  
- Sleek noir design with toggle option (theme preference is remembered).

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Structure of the web app |
| **CSS3 (Grid & Flexbox)** | Responsive layout and dark/light mode design |
| **JavaScript (Vanilla)** | Dynamic logic, API handling, filters, and local storage |
| **Unsplash API** | Fetching curated and random images |
| **html2canvas.js** | Exporting the moodboard as an image |
| **LocalStorage API** | Persisting user likes, folders, and themes |
| **MAMP (Localhost)** | Local testing server for PHP-based deployment |

---

## 📁 Folder Structure


---

## 🧠 How It Works

1. **User opens FocalPoint**  
   - New users see random Unsplash photos.  
   - Returning users see a personalized inspiration feed.

2. **User searches or applies filters**  
   - Fetches images via Unsplash API `/search/photos` or `/random` endpoints.  
   - Filters refine search results dynamically.

3. **Clicking an image**  
   - Opens a pop-up modal with a full-sized preview.  
   - Includes options to ❤️ Like, 💾 Save, and view related images.

4. **LocalStorage Saves Everything**  
   - Likes and folders persist even after refresh or restart.  
   - Folders can be opened in a new window for detailed viewing.

5. **Download Moodboard**  
   - Captures your current board as a PNG file.

---

## 🧩 Installation (Local Setup via MAMP)

1. **Install [MAMP](https://www.mamp.info/en/downloads/)**  
2. Copy your project folder into:  

5. Open `FocalPoint` in **Visual Studio Code** to edit and live-preview updates.

---

## 🔑 Unsplash API Setup

This project uses the Unsplash API for image data.

- Create a free developer account at [Unsplash Developers](https://unsplash.com/developers).  
- Replace the key in `script.js`:
```js
const ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

