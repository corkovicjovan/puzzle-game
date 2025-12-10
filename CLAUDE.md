# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Architecture

This is a React + Vite jigsaw puzzle game that works as a PWA. The app has three screens managed by simple state in App.jsx:

- **HomeScreen**: Settings selection (grid size 3x3/4x4/5x5, hint toggle) and image picker (sample images or custom photo upload)
- **ImageCropper**: Square crop interface using react-image-crop for custom photos
- **GameScreen**: Main puzzle gameplay with drag-and-drop pieces

### Puzzle Piece System

The puzzle uses SVG clip paths to create realistic jigsaw shapes:

1. `puzzleUtils.js` generates edge configurations for each piece (tabs/blanks that interlock)
2. `generatePiecePath()` creates SVG paths with curved tabs using quadratic bezier curves
3. Each piece is an SVG with a clip path that masks the full image to show only that piece's portion

The piece tray at bottom holds unplaced pieces. Dragging uses global mouse/touch event listeners. Snap detection uses a 40% piece-size threshold (adjustable in GameScreen.jsx).

### PWA Configuration

PWA setup is in `vite.config.js` using vite-plugin-pwa with workbox. Images are cached via CacheFirst strategy. Icons should be placed in `public/` folder (pwa-192x192.png, pwa-512x512.png).

### Adding Puzzle Images

Drop images into `src/assets/puzzles/` and they're automatically included at build time via `import.meta.glob`. Supports png, jpg, jpeg, webp. Images should be square or will be cropped.
