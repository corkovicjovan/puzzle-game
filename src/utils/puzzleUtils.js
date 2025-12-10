// Generates SVG path for jigsaw puzzle piece edges
// Each piece has 4 edges: top, right, bottom, left
// Edge types: 0 = flat (border), 1 = tab (outward), -1 = blank (inward)

export function generatePuzzleEdges(rows, cols) {
  // Create a grid of edge types
  // Horizontal edges (between rows) and vertical edges (between cols)
  const horizontalEdges = [] // [row][col] - edges between row and row+1
  const verticalEdges = []   // [row][col] - edges between col and col+1

  // Generate random edges, ensuring adjacent pieces fit together
  for (let row = 0; row < rows - 1; row++) {
    horizontalEdges[row] = []
    for (let col = 0; col < cols; col++) {
      // Randomly choose tab (1) or blank (-1)
      horizontalEdges[row][col] = Math.random() > 0.5 ? 1 : -1
    }
  }

  for (let row = 0; row < rows; row++) {
    verticalEdges[row] = []
    for (let col = 0; col < cols - 1; col++) {
      verticalEdges[row][col] = Math.random() > 0.5 ? 1 : -1
    }
  }

  // Build edge configuration for each piece
  const pieces = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const edges = {
        // Top edge: flat if first row, otherwise opposite of piece above's bottom
        top: row === 0 ? 0 : -horizontalEdges[row - 1][col],
        // Right edge: flat if last column, otherwise the edge value
        right: col === cols - 1 ? 0 : verticalEdges[row][col],
        // Bottom edge: flat if last row, otherwise the edge value
        bottom: row === rows - 1 ? 0 : horizontalEdges[row][col],
        // Left edge: flat if first column, otherwise opposite of piece to left's right
        left: col === 0 ? 0 : -verticalEdges[row][col - 1],
      }
      pieces.push({ row, col, edges })
    }
  }

  return pieces
}

// Generate a classic jigsaw puzzle edge with a rounded knob
// Uses cubic bezier curves for smooth, rounded tabs
// edgeType: 1 = tab (bulge outward), -1 = blank (indent inward), 0 = flat
function generateEdgePath(startX, startY, endX, endY, edgeType, isHorizontal) {
  if (edgeType === 0) {
    return `L ${endX} ${endY}`
  }

  const length = isHorizontal ? (endX - startX) : (endY - startY)
  const absLength = Math.abs(length)
  const dir = length > 0 ? 1 : -1

  // Tab dimensions
  const tabWidth = absLength * 0.32    // Width of the knob head
  const tabHeight = absLength * 0.25   // How far it protrudes
  const neckWidth = absLength * 0.14   // Narrow neck

  if (isHorizontal) {
    const midX = (startX + endX) / 2
    const perpDir = -dir * edgeType
    const bulge = tabHeight * perpDir

    // Key points along the edge
    const p1x = midX - (tabWidth / 2) * dir  // Start of neck
    const p2x = midX - (neckWidth / 2) * dir // Narrow part
    const p3x = midX                          // Center of bulge
    const p4x = midX + (neckWidth / 2) * dir // Other narrow part
    const p5x = midX + (tabWidth / 2) * dir  // End of neck

    // Use cubic bezier (C) for smoother rounded top
    return `
      L ${p1x} ${startY}
      Q ${p2x} ${startY}, ${p2x} ${startY + bulge * 0.4}
      C ${p2x} ${startY + bulge * 0.9}, ${p3x - (neckWidth * 0.4) * dir} ${startY + bulge}, ${p3x} ${startY + bulge}
      C ${p3x + (neckWidth * 0.4) * dir} ${startY + bulge}, ${p4x} ${startY + bulge * 0.9}, ${p4x} ${startY + bulge * 0.4}
      Q ${p4x} ${startY}, ${p5x} ${startY}
      L ${endX} ${endY}
    `
  } else {
    const midY = (startY + endY) / 2
    const perpDir = dir * edgeType
    const bulge = tabHeight * perpDir

    // Key points along the edge
    const p1y = midY - (tabWidth / 2) * dir
    const p2y = midY - (neckWidth / 2) * dir
    const p3y = midY
    const p4y = midY + (neckWidth / 2) * dir
    const p5y = midY + (tabWidth / 2) * dir

    // Use cubic bezier (C) for smoother rounded top
    return `
      L ${startX} ${p1y}
      Q ${startX} ${p2y}, ${startX + bulge * 0.4} ${p2y}
      C ${startX + bulge * 0.9} ${p2y}, ${startX + bulge} ${p3y - (neckWidth * 0.4) * dir}, ${startX + bulge} ${p3y}
      C ${startX + bulge} ${p3y + (neckWidth * 0.4) * dir}, ${startX + bulge * 0.9} ${p4y}, ${startX + bulge * 0.4} ${p4y}
      Q ${startX} ${p4y}, ${startX} ${p5y}
      L ${endX} ${endY}
    `
  }
}

// Generate SVG clip path for a puzzle piece with realistic jigsaw edges
export function generatePiecePath(pieceWidth, pieceHeight, edges, padding = 0) {
  // Must match tabHeight in generateEdgePath (0.25) plus a small buffer
  const tabSize = Math.min(pieceWidth, pieceHeight) * 0.28

  // We need extra space for tabs that stick out
  const extraSpace = tabSize + padding

  const w = pieceWidth
  const h = pieceHeight

  // Start position accounting for left and top tabs
  const startX = edges.left === 1 ? extraSpace : padding
  const startY = edges.top === 1 ? extraSpace : padding

  let path = `M ${startX} ${startY}`

  // Top edge (left to right)
  path += generateEdgePath(startX, startY, startX + w, startY, edges.top, true)

  // Right edge (top to bottom)
  path += generateEdgePath(startX + w, startY, startX + w, startY + h, edges.right, false)

  // Bottom edge (right to left)
  path += generateEdgePath(startX + w, startY + h, startX, startY + h, edges.bottom, true)

  // Left edge (bottom to top)
  path += generateEdgePath(startX, startY + h, startX, startY, edges.left, false)

  path += ' Z'

  return {
    path,
    // Return dimensions including tab protrusions
    width: w + (edges.left === 1 ? extraSpace : padding) + (edges.right === 1 ? extraSpace : padding),
    height: h + (edges.top === 1 ? extraSpace : padding) + (edges.bottom === 1 ? extraSpace : padding),
    // Offset for positioning the image inside the clip path
    offsetX: edges.left === 1 ? extraSpace : padding,
    offsetY: edges.top === 1 ? extraSpace : padding,
  }
}

// Generate SVG path for puzzle grid lines (to overlay on hint image)
// This reuses generateEdgePath to ensure perfect sync with piece edges
export function generateGridLinesPath(boardSize, gridSize, puzzleEdges) {
  const pieceSize = boardSize / gridSize
  let path = ''

  // Draw horizontal lines between rows
  // Use the top edge of the piece below (which matches what that piece will show)
  // Negate it because grid draws left-to-right but piece's top edge context differs
  for (let row = 1; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = puzzleEdges.find(p => p.row === row && p.col === col)
      if (!piece) continue

      const startX = col * pieceSize
      const startY = row * pieceSize
      const endX = startX + pieceSize
      const edgeType = piece.edges.top

      path += `M ${startX} ${startY} `
      path += generateEdgePath(startX, startY, endX, startY, edgeType, true)
    }
  }

  // Draw vertical lines between columns
  // Use the left edge of the piece to the right
  for (let row = 0; row < gridSize; row++) {
    for (let col = 1; col < gridSize; col++) {
      const piece = puzzleEdges.find(p => p.row === row && p.col === col)
      if (!piece) continue

      const startX = col * pieceSize
      const startY = row * pieceSize
      const endY = startY + pieceSize
      // Negate edge type because grid draws T→B but piece draws left edge B→T
      const edgeType = -piece.edges.left

      path += `M ${startX} ${startY} `
      path += generateEdgePath(startX, startY, startX, endY, edgeType, false)
    }
  }

  return path
}

// Calculate the bounding box dimensions for a piece
export function getPieceBounds(pieceWidth, pieceHeight, edges) {
  const tabSize = Math.min(pieceWidth, pieceHeight) * 0.22

  return {
    width: pieceWidth +
           (edges.left !== 0 ? tabSize : 0) +
           (edges.right !== 0 ? tabSize : 0),
    height: pieceHeight +
            (edges.top !== 0 ? tabSize : 0) +
            (edges.bottom !== 0 ? tabSize : 0),
    offsetX: edges.left !== 0 ? tabSize : 0,
    offsetY: edges.top !== 0 ? tabSize : 0,
  }
}

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
