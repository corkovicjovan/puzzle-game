# 🧩 Puzzle Fun!

A fun, kid-friendly jigsaw puzzle game built with React + Vite. Works as a Progressive Web App (PWA) - installable on phones and tablets!

## Features

- **Real jigsaw shapes** - Pieces have tabs and blanks like real puzzles
- **3 difficulty levels** - 3×3 (Easy), 4×4 (Medium), 5×5 (Hard)
- **Hint mode** - Show faded background image as guide (toggle on/off)
- **Custom photos** - Use your own images from device gallery
- **Square crop** - Built-in cropper for perfect puzzle images
- **Kid-friendly** - Large snap zones, no timers, fun celebrations
- **PWA** - Install on home screen, works offline

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Your AI-Generated Images

1. Put your images in `public/images/` folder
2. Update `src/App.jsx` to reference them:

```javascript
const SAMPLE_IMAGES = [
  '/images/puzzle1.jpg',
  '/images/puzzle2.jpg',
  // ... add all 100 images
]
```

**Image requirements:**
- Square aspect ratio (or they'll be cropped)
- Recommended: 600×600px or larger
- Formats: JPG, PNG, WebP

## Deployment (Free Hosting)

### Option 1: Netlify (Recommended)

1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com) and sign up free
3. Drag the `dist` folder to Netlify
4. Done! Get your URL like `your-puzzle.netlify.app`

### Option 2: Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Auto-deploys on every push!

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install gh-pages --save-dev

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

## PWA Icons

Before production deployment, generate PWA icons:

1. Use your logo/icon (512×512 PNG recommended)
2. Generate icons at [realfavicongenerator.net](https://realfavicongenerator.net)
3. Replace files in `public/` folder:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png`

## Project Structure

```
puzzle-game/
├── public/
│   ├── favicon.svg
│   └── images/        # Your puzzle images go here
├── src/
│   ├── components/
│   │   ├── HomeScreen.jsx    # Settings & image selection
│   │   ├── GameScreen.jsx    # Main puzzle gameplay
│   │   ├── ImageCropper.jsx  # Square crop for custom photos
│   │   └── Confetti.jsx      # Win celebration
│   ├── utils/
│   │   └── puzzleUtils.js    # Piece shape generation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js            # PWA configuration
└── package.json
```

## Customization

### Change Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: #6366f1;      /* Main purple */
  --secondary: #f472b6;    /* Pink accent */
  --accent: #fbbf24;       /* Yellow/gold */
  --success: #34d399;      /* Green for correct */
  --background: #1e1b4b;   /* Dark purple bg */
}
```

### Adjust Snap Sensitivity

In `src/components/GameScreen.jsx`, find:

```javascript
// Very forgiving snap zone for kids (40% of piece size)
const snapThreshold = pieceSize * 0.4
```

- Increase for easier snapping (0.5 = very easy)
- Decrease for harder snapping (0.25 = precise)

## License

Free to use! Made with ❤️ for kids everywhere.
