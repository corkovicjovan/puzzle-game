import { useState, useRef, useCallback } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
    aspect: 1,
  })
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)
  
  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget
    
    const { width, height } = e.currentTarget
    const size = Math.min(width, height) * 0.8
    const x = (width - size) / 2
    const y = (height - size) / 2
    
    const newCrop = {
      unit: 'px',
      width: size,
      height: size,
      x,
      y,
      aspect: 1,
    }
    
    setCrop(newCrop)
    setCompletedCrop(newCrop)
  }, [])
  
  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return null
    
    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    // Output size (square)
    const outputSize = 600
    canvas.width = outputSize
    canvas.height = outputSize
    
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    )
    
    return canvas.toDataURL('image/jpeg', 0.9)
  }, [completedCrop])
  
  const handleConfirm = () => {
    const croppedImage = getCroppedImg()
    if (croppedImage) {
      onCropComplete(croppedImage)
    }
  }
  
  return (
    <div className="cropper-screen">
      <header className="cropper-header">
        <button className="cropper-btn cancel" onClick={onCancel}>
          Cancel
        </button>
        <h2 style={{ color: 'white', fontSize: '1.1rem' }}>Crop Image</h2>
        <button className="cropper-btn confirm" onClick={handleConfirm}>
          Done ✓
        </button>
      </header>
      
      <div className="cropper-area">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          circularCrop={false}
        >
          <img
            src={imageSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            style={{ maxHeight: '70vh', maxWidth: '100%' }}
          />
        </ReactCrop>
      </div>
      
      <p style={{ 
        textAlign: 'center', 
        color: '#94a3b8', 
        padding: '16px',
        fontSize: '0.9rem'
      }}>
        Drag to select a square area for your puzzle
      </p>
    </div>
  )
}

export default ImageCropper
