import { useEffect, useState } from 'react'

const COLORS = [
  '#fbbf24', // yellow
  '#f472b6', // pink
  '#818cf8', // purple
  '#34d399', // green
  '#60a5fa', // blue
  '#fb7185', // red
  '#a78bfa', // violet
  '#fcd34d', // amber
]

function Confetti() {
  const [pieces, setPieces] = useState([])
  
  useEffect(() => {
    // Generate confetti pieces
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
    
    setPieces(newPieces)
    
    // Play celebration sound
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      
      // Play a happy chord
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        gain.gain.value = 0.1
        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + 0.5 + i * 0.1)
      })
    } catch (e) {
      // Audio not supported
    }
    
    // Clear confetti after animation
    const timer = setTimeout(() => {
      setPieces([])
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="confetti">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
