# DesignYst — Video Editor Portfolio

A responsive, vertical-scrolling video editor portfolio with a dark cinematic look, horizontal-free project grids, YouTube modal playback, and scroll reveal animations.

## Files
- `index.html` — page structure
- `styles.css` — design and responsive styles
- `script.js` — project rendering and YouTube player modal
- `projects.json` — your supplied video links and categories

## Preview locally
Open `index.html` in a browser. For best results, run a local static server because the project list is loaded from `projects.json`:
- VS Code: install Live Server, right-click `index.html`, choose **Open with Live Server**.
- Or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Publish free with GitHub Pages
1. Create a **public** GitHub repository named `designyst`.
2. Upload all four files (`index.html`, `styles.css`, `script.js`, `projects.json`) to the repository root.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages deployment. Your URL will look like `https://YOUR-USERNAME.github.io/designyst/`.

## Personalise before publishing
- Replace `YOUR_EMAIL@example.com` in `index.html`.
- Add a real resume PDF and update the resume link.
- Confirm software skills in the About section.
- Replace generic project titles with accurate project names.
- The supplied URL `SwVmBRHuOxU` appeared in both Talking Head and Gaming. It is included once under Talking Head to avoid duplication; move it in `projects.json` if Gaming is the correct category.
- YouTube thumbnails are loaded from YouTube. Some videos may not provide the `hqdefault.jpg` image; replace those thumbnail URLs with your own images if needed.
- YouTube embedding must be allowed by each video's owner. Private, age-restricted, or embedding-disabled videos may not play.
