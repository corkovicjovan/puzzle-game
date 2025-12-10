import { useState, useCallback } from 'react'
import HomeScreen from './components/HomeScreen'
import GameScreen from './components/GameScreen'
import ImageCropper from './components/ImageCropper'
import './index.css'

// Sample images - replace with your AI-generated images later
const SAMPLE_IMAGES = [
  'https://picsum.photos/seed/puzzle1/600/600',
  'https://picsum.photos/seed/puzzle2/600/600',
  'https://picsum.photos/seed/puzzle3/600/600',
  'https://picsum.photos/seed/puzzle4/600/600',
  'https://picsum.photos/seed/puzzle5/600/600',
  'https://picsum.photos/seed/puzzle6/600/600',
  'https://picsum.photos/seed/puzzle7/600/600',
  'https://picsum.photos/seed/puzzle8/600/600',
  'https://picsum.photos/seed/puzzle9/600/600',
  'https://picsum.photos/seed/puzzle10/600/600',
  'https://picsum.photos/seed/puzzle11/600/600',
  'https://picsum.photos/seed/puzzle12/600/600',
]

function App() {
  const [screen, setScreen] = useState('home')
  const [gameSettings, setGameSettings] = useState({
    gridSize: 3,
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

  return (
    <div className="app">
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
