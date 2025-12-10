import { useState, useCallback } from 'react'
import HomeScreen from './components/HomeScreen'
import GameScreen from './components/GameScreen'
import ImageCropper from './components/ImageCropper'
import InstallButton from './components/InstallButton'
import './index.css'

// Auto-discover all images from src/assets/puzzles/
// Just drop images in that folder and they'll be included automatically
const puzzleImages = import.meta.glob('./assets/puzzles/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})
const SAMPLE_IMAGES = Object.values(puzzleImages)

function App() {
  const [screen, setScreen] = useState('home')
  const [gameSettings, setGameSettings] = useState({
    gridSize: 4,
    showHint: true,
    image: null,
  })
  const [customImage, setCustomImage] = useState(null)

  const startGame = useCallback((settings) => {
    let imageToUse = settings.image

    if (!imageToUse) {
      const randomIndex = Math.floor(Math.random() * SAMPLE_IMAGES.length)
      imageToUse = SAMPLE_IMAGES[randomIndex]
    }

    setGameSettings({ ...settings, image: imageToUse })
    setScreen('game')
  }, [])

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
      <InstallButton />
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
