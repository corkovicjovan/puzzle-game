import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { generatePuzzleEdges, generatePiecePath, shuffleArray } from '../utils/puzzleUtils'
import Confetti from './Confetti'

function GameScreen({ settings, onBack }) {
  const { gridSize, showHint, image } = settings
  const [pieces, setPieces] = useState([])
  const [placedPieces, setPlacedPieces] = useState({})
  const [draggingPiece, setDraggingPiece] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [highlightCell, setHighlightCell] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [boardSize, setBoardSize] = useState(300)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const boardRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  
  const pieceSize = boardSize / gridSize
  const tabSize = pieceSize * 0.18
  
  // Generate puzzle edges once
  const puzzleEdges = useMemo(() => {
    return generatePuzzleEdges(gridSize, gridSize)
  }, [gridSize])
  
  // Initialize pieces
  useEffect(() => {
    const initialPieces = puzzleEdges.map((piece, index) => ({
      id: index,
      row: piece.row,
      col: piece.col,
      edges: piece.edges,
    }))
    setPieces(shuffleArray(initialPieces))
    setPlacedPieces({})
    setIsComplete(false)
    setImageLoaded(false)
  }, [puzzleEdges, image])
  
  // Calculate board size based on viewport
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // Leave room for header and tray
      const availableHeight = vh - 200
      const availableWidth = vw - 40
      const size = Math.min(availableWidth, availableHeight, 450)
      setBoardSize(size)
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  // Check for win condition
  useEffect(() => {
    const totalPieces = gridSize * gridSize
    if (Object.keys(placedPieces).length === totalPieces) {
      setIsComplete(true)
    }
  }, [placedPieces, gridSize])
  
  // Get board position
  const getBoardRect = useCallback(() => {
    if (!boardRef.current) return null
    return boardRef.current.getBoundingClientRect()
  }, [])
  
  // Check if piece is near correct position (forgiving for kids!)
  const checkSnapPosition = useCallback((x, y, piece) => {
    const boardRect = getBoardRect()
    if (!boardRect) return null
    
    const relX = x - boardRect.left
    const relY = y - boardRect.top
    
    const targetX = piece.col * pieceSize
    const targetY = piece.row * pieceSize
    
    // Very forgiving snap zone for kids (40% of piece size)
    const snapThreshold = pieceSize * 0.4
    
    const distX = Math.abs(relX - targetX - pieceSize / 2)
    const distY = Math.abs(relY - targetY - pieceSize / 2)
    
    if (distX < snapThreshold && distY < snapThreshold) {
      return { row: piece.row, col: piece.col }
    }
    
    return null
  }, [getBoardRect, pieceSize])
  
  // Determine which cell we're hovering over
  const getHoverCell = useCallback((x, y) => {
    const boardRect = getBoardRect()
    if (!boardRect) return null
    
    const relX = x - boardRect.left
    const relY = y - boardRect.top
    
    if (relX < 0 || relX > boardSize || relY < 0 || relY > boardSize) {
      return null
    }
    
    const col = Math.floor(relX / pieceSize)
    const row = Math.floor(relY / pieceSize)
    
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return { row, col }
    }
    
    return null
  }, [getBoardRect, boardSize, pieceSize, gridSize])
  
  // Handle drag start
  const handleDragStart = useCallback((e, piece) => {
    e.preventDefault()
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const rect = e.currentTarget.getBoundingClientRect()
    dragOffsetRef.current = {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    }
    
    setDraggingPiece(piece)
    setDragPos({ x: clientX, y: clientY })
  }, [])
  
  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!draggingPiece) return
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    setDragPos({ x: clientX, y: clientY })
    
    // Check if we should highlight a cell
    const hoverCell = getHoverCell(clientX, clientY)
    const correctPos = checkSnapPosition(clientX, clientY, draggingPiece)
    
    if (correctPos && !placedPieces[`${correctPos.row}-${correctPos.col}`]) {
      setHighlightCell(correctPos)
    } else {
      setHighlightCell(null)
    }
  }, [draggingPiece, getHoverCell, checkSnapPosition, placedPieces])
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!draggingPiece) return
    
    const snapPos = checkSnapPosition(dragPos.x, dragPos.y, draggingPiece)
    
    if (snapPos && !placedPieces[`${snapPos.row}-${snapPos.col}`]) {
      // Place the piece!
      setPlacedPieces(prev => ({
        ...prev,
        [`${snapPos.row}-${snapPos.col}`]: draggingPiece,
      }))
      
      // Remove from tray
      setPieces(prev => prev.filter(p => p.id !== draggingPiece.id))
      
      // Play success sound
      playSound('snap')
    }
    
    setDraggingPiece(null)
    setHighlightCell(null)
  }, [draggingPiece, dragPos, checkSnapPosition, placedPieces])
  
  // Add global event listeners for drag
  useEffect(() => {
    if (draggingPiece) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove, { passive: false })
      window.addEventListener('touchend', handleDragEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
        window.removeEventListener('touchmove', handleDragMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [draggingPiece, handleDragMove, handleDragEnd])
  
  // Simple sound effects
  const playSound = (type) => {
    // Using Web Audio API for simple sounds
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      
      if (type === 'snap') {
        oscillator.frequency.value = 800
        gain.gain.value = 0.1
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.1)
      }
    } catch (e) {
      // Audio not supported
    }
  }
  
  // Render a puzzle piece
  const renderPiece = (piece, size, forDrag = false) => {
    const pathData = generatePiecePath(size, size, piece.edges)
    const clipId = `piece-${piece.id}${forDrag ? '-drag' : ''}`
    
    // Calculate image position within piece
    const imgX = -piece.col * size + pathData.offsetX
    const imgY = -piece.row * size + pathData.offsetY
    
    return (
      <svg
        width={pathData.width}
        height={pathData.height}
        style={{ display: 'block' }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={pathData.path} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={image}
            x={imgX}
            y={imgY}
            width={size * gridSize}
            height={size * gridSize}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
        {/* Piece border */}
        <path
          d={pathData.path}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
      </svg>
    )
  }
  
  const remainingPieces = pieces.length
  const totalPieces = gridSize * gridSize
  
  return (
    <div className="game-screen">
      <header className="game-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h1 className="game-title">🧩 Puzzle Fun!</h1>
        <div className="pieces-counter">
          {totalPieces - remainingPieces}/{totalPieces}
        </div>
      </header>
      
      <div className="puzzle-area">
        <div
          ref={boardRef}
          className="puzzle-board"
          style={{ width: boardSize, height: boardSize }}
        >
          {/* Hint background image */}
          {showHint && (
            <img
              src={image}
              alt="Hint"
              className="puzzle-hint"
              onLoad={() => setImageLoaded(true)}
            />
          )}
          
          {/* Grid cells */}
          <div className="puzzle-grid">
            {Array.from({ length: gridSize * gridSize }).map((_, index) => {
              const row = Math.floor(index / gridSize)
              const col = index % gridSize
              const isHighlight = highlightCell?.row === row && highlightCell?.col === col
              const isFilled = !!placedPieces[`${row}-${col}`]
              
              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={`grid-cell ${isHighlight ? 'highlight' : ''} ${isFilled ? 'filled' : ''}`}
                  style={{
                    left: col * pieceSize,
                    top: row * pieceSize,
                    width: pieceSize,
                    height: pieceSize,
                  }}
                />
              )
            })}
            
            {/* Placed pieces */}
            {Object.entries(placedPieces).map(([key, piece]) => {
              const pathData = generatePiecePath(pieceSize, pieceSize, piece.edges)
              
              return (
                <div
                  key={`placed-${key}`}
                  className="placed-piece"
                  style={{
                    left: piece.col * pieceSize - pathData.offsetX,
                    top: piece.row * pieceSize - pathData.offsetY,
                  }}
                >
                  {renderPiece(piece, pieceSize)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Piece tray */}
      <div className="piece-tray">
        {pieces.map((piece) => {
          const trayPieceSize = 80
          const pathData = generatePiecePath(trayPieceSize, trayPieceSize, piece.edges)
          
          return (
            <div
              key={piece.id}
              className={`puzzle-piece ${draggingPiece?.id === piece.id ? 'dragging' : ''}`}
              style={{
                width: pathData.width,
                height: pathData.height,
                opacity: draggingPiece?.id === piece.id ? 0 : 1,
              }}
              onMouseDown={(e) => handleDragStart(e, piece)}
              onTouchStart={(e) => handleDragStart(e, piece)}
            >
              {renderPiece(piece, trayPieceSize)}
            </div>
          )
        })}
      </div>
      
      {/* Dragging piece overlay */}
      {draggingPiece && (
        <div
          className="puzzle-piece dragging"
          style={{
            left: dragPos.x - pieceSize / 2,
            top: dragPos.y - pieceSize / 2,
            width: pieceSize + tabSize * 2,
            height: pieceSize + tabSize * 2,
          }}
        >
          {renderPiece(draggingPiece, pieceSize, true)}
        </div>
      )}
      
      {/* Win modal */}
      {isComplete && (
        <>
          <Confetti />
          <div className="win-overlay">
            <div className="win-modal">
              <div className="win-emoji">🎉</div>
              <h2 className="win-title">Amazing!</h2>
              <p className="win-subtitle">You completed the puzzle!</p>
              <div className="win-buttons">
                <button className="win-btn secondary" onClick={onBack}>
                  Home
                </button>
                <button
                  className="win-btn primary"
                  onClick={() => {
                    setPieces(shuffleArray(puzzleEdges.map((p, i) => ({
                      id: i,
                      row: p.row,
                      col: p.col,
                      edges: p.edges,
                    }))))
                    setPlacedPieces({})
                    setIsComplete(false)
                  }}
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default GameScreen
