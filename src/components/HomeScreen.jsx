import { useState, useRef } from 'react'

function HomeScreen({ onStartGame, onOpenCropper, currentImage, sampleImages }) {
  const [gridSize, setGridSize] = useState(3)
  const [showHint, setShowHint] = useState(true)
  const [selectedImage, setSelectedImage] = useState(currentImage)
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

  const gridOptions = [
    { size: 3, label: 'Easy' },
    { size: 4, label: 'Medium' },
    { size: 5, label: 'Hard' },
  ]

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1 className="home-title">🧩 Puzzle Fun!</h1>
        <p className="home-subtitle">Choose your challenge</p>
      </header>

      {/* Grid Size Selection */}
      <section className="settings-section">
        <h2 className="section-title">
          <span>📐</span> Puzzle Size
        </h2>
        <div className="grid-options">
          {gridOptions.map(({ size, label }) => (
            <button
              key={size}
              className={`grid-btn ${gridSize === size ? 'active' : ''}`}
              onClick={() => setGridSize(size)}
            >
              {size}×{size}
              <span className="grid-btn-label">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hint Toggle */}
      <section className="settings-section">
        <div className="toggle-row">
          <span className="toggle-label">
            <span>💡</span> Show Background Hint
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showHint}
              onChange={(e) => setShowHint(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Image Selection */}
      <section className="settings-section">
        <h2 className="section-title">
          <span>🖼️</span> Choose Image
        </h2>
        <div className="image-grid">
          {/* Custom image button */}
          <button
            className="custom-image-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span>📷</span>
            My Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {/* Sample images */}
          {sampleImages.slice(0, 11).map((img, index) => (
            <div
              key={index}
              className={`image-thumb ${selectedImage === img ? 'selected' : ''}`}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt={`Puzzle ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <button className="start-btn" onClick={handleStart}>
        🎮 Start Puzzle!
      </button>
    </div>
  )
}

export default HomeScreen
