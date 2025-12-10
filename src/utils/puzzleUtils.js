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

// Generate SVG clip path for a puzzle piece
export function generatePiecePath(pieceWidth, pieceHeight, edges, padding = 0) {
  const tabSize = Math.min(pieceWidth, pieceHeight) * 0.18
  const neckWidth = tabSize * 0.5
  
  // We need extra space for tabs that stick out
  const extraSpace = tabSize + padding
  
  const w = pieceWidth
  const h = pieceHeight
  
  // Start position accounting for left and top tabs
  const startX = edges.left === 1 ? extraSpace : padding
  const startY = edges.top === 1 ? extraSpace : padding
  
  let path = `M ${startX} ${startY}`
  
  // Top edge (left to right)
  if (edges.top === 0) {
    path += ` L ${startX + w} ${startY}`
  } else {
    const tabDir = edges.top // -1 = inward (blank), 1 = outward (tab)
    const third = w / 3
    const tabY = startY - tabSize * tabDir
    
    path += ` L ${startX + third} ${startY}`
    path += ` L ${startX + third + neckWidth} ${startY}`
    path += ` Q ${startX + third + neckWidth} ${tabY}, ${startX + w/2} ${tabY}`
    path += ` Q ${startX + 2*third - neckWidth} ${tabY}, ${startX + 2*third - neckWidth} ${startY}`
    path += ` L ${startX + w} ${startY}`
  }
  
  // Right edge (top to bottom)
  if (edges.right === 0) {
    path += ` L ${startX + w} ${startY + h}`
  } else {
    const tabDir = edges.right
    const third = h / 3
    const tabX = startX + w + tabSize * tabDir
    
    path += ` L ${startX + w} ${startY + third}`
    path += ` L ${startX + w} ${startY + third + neckWidth}`
    path += ` Q ${tabX} ${startY + third + neckWidth}, ${tabX} ${startY + h/2}`
    path += ` Q ${tabX} ${startY + 2*third - neckWidth}, ${startX + w} ${startY + 2*third - neckWidth}`
    path += ` L ${startX + w} ${startY + h}`
  }
  
  // Bottom edge (right to left)
  if (edges.bottom === 0) {
    path += ` L ${startX} ${startY + h}`
  } else {
    const tabDir = edges.bottom
    const third = w / 3
    const tabY = startY + h + tabSize * tabDir
    
    path += ` L ${startX + 2*third} ${startY + h}`
    path += ` L ${startX + 2*third - neckWidth} ${startY + h}`
    path += ` Q ${startX + 2*third - neckWidth} ${tabY}, ${startX + w/2} ${tabY}`
    path += ` Q ${startX + third + neckWidth} ${tabY}, ${startX + third + neckWidth} ${startY + h}`
    path += ` L ${startX} ${startY + h}`
  }
  
  // Left edge (bottom to top)
  if (edges.left === 0) {
    path += ` L ${startX} ${startY}`
  } else {
    const tabDir = edges.left
    const third = h / 3
    const tabX = startX - tabSize * tabDir
    
    path += ` L ${startX} ${startY + 2*third}`
    path += ` L ${startX} ${startY + 2*third - neckWidth}`
    path += ` Q ${tabX} ${startY + 2*third - neckWidth}, ${tabX} ${startY + h/2}`
    path += ` Q ${tabX} ${startY + third + neckWidth}, ${startX} ${startY + third + neckWidth}`
    path += ` L ${startX} ${startY}`
  }
  
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

// Calculate the bounding box dimensions for a piece
export function getPieceBounds(pieceWidth, pieceHeight, edges) {
  const tabSize = Math.min(pieceWidth, pieceHeight) * 0.18
  
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
