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

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Build settings are auto-detected (Vite)
5. Click "Deploy"

**Custom Domain Setup:**
1. In Netlify: Site settings → Domain management → Add custom domain
2. Add your subdomain (e.g., `puzzle.yourdomain.com`)
3. At your DNS provider: Add a CNAME record pointing to your Netlify URL

### Alternative: Manual Deploy

```bash
npm run build
# Drag the dist/ folder to Netlify
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

Sample puzzle images were generated using Midjourney.
