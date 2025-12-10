import { useState, useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateSW, setUpdateSW] = useState(null)

  useEffect(() => {
    const sw = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        console.log('App ready for offline use')
      }
    })
    setUpdateSW(() => sw)
  }, [])

  const handleUpdate = () => {
    updateSW?.()
  }

  const handleDismiss = () => {
    setNeedRefresh(false)
  }

  if (!needRefresh) return null

  return (
    <div className="update-prompt">
      <div className="update-content">
        <span className="update-icon">✨</span>
        <div className="update-text">
          <strong>Update Available!</strong>
          <p>A new version is ready.</p>
        </div>
        <button className="update-btn" onClick={handleUpdate}>
          Update
        </button>
        <button className="update-dismiss" onClick={handleDismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  )
}

export default UpdatePrompt
