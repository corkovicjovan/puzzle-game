# Puzzle Fun

A kid-friendly jigsaw puzzle game built with React + Vite. Works as a Progressive Web App (PWA) - installable on phones and tablets.

**100% Free & Private** - No ads, no payments, no tracking. Everything runs locally on your device. No data is ever collected or sent anywhere.

## Features

- **Real jigsaw shapes** - Pieces have tabs and blanks like real puzzles
- **3 difficulty levels** - 3x3 (Easy), 4x4 (Medium), 5x5 (Hard)
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

## Adding Puzzle Images

Drop images into `src/assets/puzzles/` folder and they'll be automatically included at build time.

**Image requirements:**
- Square aspect ratio recommended (or they'll be cropped)
- Recommended: 600x600px or larger
- Formats: PNG, JPG, JPEG, WebP

## Project Structure

```
puzzle-game/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── puzzles/       # Puzzle images (auto-discovered)
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
  --primary: #3b82f6;
  --secondary: #f472b6;
  --accent: #fbbf24;
  --success: #34d399;
  --background: #1e3a5f;
}
```

### Adjust Snap Sensitivity

In `src/components/GameScreen.jsx`:

```javascript
// Very forgiving snap zone for kids (40% of piece size)
const snapThreshold = pieceSize * 0.4
```

- Increase for easier snapping (0.5 = very easy)
- Decrease for harder snapping (0.25 = precise)

## Deployment

### Netlify (Recommended)

1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com) and sign up
3. Drag the `dist` folder to Netlify
4. Done! Get your URL like `your-puzzle.netlify.app`

### Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Auto-deploys on every push

### GitHub Pages

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

1. Use your logo/icon (512x512 PNG recommended)
2. Generate icons at [realfavicongenerator.net](https://realfavicongenerator.net)
3. Replace files in `public/` folder:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png`

## License

MIT License - see [LICENSE](LICENSE) file for details.

Sample puzzle images were generated using Midjourney.
