import { useState, useCallback } from 'react'
import HomeScreen from './components/HomeScreen'
import GameScreen from './components/GameScreen'
import ImageCropper from './components/ImageCropper'
import InstallButton from './components/InstallButton'
import UpdatePrompt from './components/UpdatePrompt'
import { usePersistedSettings } from './hooks/usePersistedState'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import './index.css'

// Auto-discover all optimized images from src/assets/puzzles-optimized/
// Run `npm run optimize-images` to generate optimized WebP versions
const puzzleImages = import.meta.glob('./assets/puzzles-optimized/*.webp', {
  eager: true,
  import: 'default',
})
const SAMPLE_IMAGES = Object.values(puzzleImages)

function App() {
  const isOnline = useNetworkStatus()
  const [screen, setScreen] = useState('home')
  const [persistedSettings, setPersistedSettings] = usePersistedSettings({
    gridSize: 4,
    showHint: true,
  })
  const [gameSettings, setGameSettings] = useState({
    ...persistedSettings,
    image: null,
  })
  const [customImage, setCustomImage] = useState(null)

  const startGame = useCallback((settings) => {
    let imageToUse = settings.image

    if (!imageToUse) {
      const randomIndex = Math.floor(Math.random() * SAMPLE_IMAGES.length)
      imageToUse = SAMPLE_IMAGES[randomIndex]
    }

    // Persist settings (without image)
    setPersistedSettings({
      gridSize: settings.gridSize,
      showHint: settings.showHint,
    })

    setGameSettings({ ...settings, image: imageToUse })
    setScreen('game')
  }, [setPersistedSettings])

  const openCropper = useCallback((imageData) => {
    setCustomImage(imageData)
    setScreen('cropper')
  }, [])

  const handleCropComplete = useCallback((croppedImage) => {
    setGameSettings(prev => ({ ...prev, image: croppedImage }))
    setScreen('home')
  }, [])

  const goHome = useCallback(() => {
    setScreen('home')
  }, [])

  const nextPuzzle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_IMAGES.length)
    const newImage = SAMPLE_IMAGES[randomIndex]
    setGameSettings(prev => ({ ...prev, image: newImage }))
  }, [])

  return (
    <div className="app">
      <UpdatePrompt />
      <InstallButton />

      {!isOnline && (
        <div className="offline-indicator">
          <span className="offline-dot"></span>
          <span>Offline</span>
        </div>
      )}

      {screen === 'home' && (
        <HomeScreen
          onStartGame={startGame}
          onOpenCropper={openCropper}
          currentImage={gameSettings.image}
          sampleImages={SAMPLE_IMAGES}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          settings={gameSettings}
          onBack={goHome}
          onNextPuzzle={nextPuzzle}
        />
      )}
      {screen === 'cropper' && customImage && (
        <ImageCropper
          imageSrc={customImage}
          onCropComplete={handleCropComplete}
          onCancel={goHome}
        />
      )}
    </div>
  )
}

export default App
