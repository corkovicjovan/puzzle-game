import { useState, useRef } from 'react'

function HomeScreen({ onStartGame, onOpenCropper, currentImage, sampleImages }) {
  const [gridSize, setGridSize] = useState(4)
  const [showHint, setShowHint] = useState(true)
  const [selectedImage, setSelectedImage] = useState(() => {
    return currentImage || sampleImages[Math.floor(Math.random() * sampleImages.length)]
  })
  const fileInputRef = useRef(null)

  const handleStart = () => {
    onStartGame({
      gridSize,
      showHint,
      image: selectedImage,
    })
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onOpenCropper(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Cycle to next random image (always picks a different one if possible)
  const shuffleImage = () => {
    if (sampleImages.length <= 1) {
      setSelectedImage(sampleImages[0])
      return
    }
    const availableImages = sampleImages.filter(img => img !== selectedImage)
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]
    setSelectedImage(randomImage)
  }

  return (
    <div className="home-screen">
      {/* Main play area - kid focused */}
      <div className="home-hero">
        <h1 className="home-title">Puzzle Fun!</h1>

        {/* Preview of puzzle image */}
        <div className="puzzle-preview" onClick={shuffleImage}>
          <img src={selectedImage} alt="Puzzle preview" />
          <div className="shuffle-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 11-3-6.7"/>
              <path d="M21 4v4h-4"/>
            </svg>
          </div>
        </div>

        {/* Big Play Button */}
        <button className="start-btn" onClick={handleStart}>
          ▶ Play!
        </button>

        {/* Use my photo button */}
        <button
          className="my-photo-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          Use my photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Simple bottom bar for parents - always visible but subtle */}
      <div className="parent-controls">
        {/* Difficulty selector - visual stars */}
        <div className="difficulty-selector">
          <button
            className={`diff-btn ${gridSize === 3 ? 'active' : ''}`}
            onClick={() => setGridSize(3)}
            title="Easy"
          >
            ⭐
          </button>
          <button
            className={`diff-btn ${gridSize === 4 ? 'active' : ''}`}
            onClick={() => setGridSize(4)}
            title="Medium"
          >
            ⭐⭐
          </button>
          <button
            className={`diff-btn ${gridSize === 5 ? 'active' : ''}`}
            onClick={() => setGridSize(5)}
            title="Hard"
          >
            ⭐⭐⭐
          </button>
        </div>

        {/* Hint toggle */}
        <button
          className={`toggle-btn ${showHint ? 'active' : ''}`}
          onClick={() => setShowHint(!showHint)}
          title="Show hint"
        >
          💡
        </button>
      </div>
    </div>
  )
}

export default HomeScreen
