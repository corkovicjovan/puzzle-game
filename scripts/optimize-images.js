import sharp from 'sharp'
import { readdir, mkdir, stat } from 'fs/promises'
import { join, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const INPUT_DIR = join(__dirname, '../src/assets/puzzles')
const OUTPUT_DIR = join(__dirname, '../src/assets/puzzles-optimized')
const MAX_SIZE = 1024  // Max dimension (puzzles are square)
const QUALITY = 80     // WebP quality

async function optimizeImages() {
  console.log('Starting image optimization...\n')

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true })

  const files = await readdir(INPUT_DIR)
  const imageFiles = files.filter(f =>
    /\.(png|jpg|jpeg|webp)$/i.test(f)
  )

  console.log(`Found ${imageFiles.length} images to process\n`)

  let totalInputSize = 0
  let totalOutputSize = 0

  for (const file of imageFiles) {
    const inputPath = join(INPUT_DIR, file)
    const outputName = basename(file, extname(file)) + '.webp'
    const outputPath = join(OUTPUT_DIR, outputName)

    const inputStats = await stat(inputPath)
    totalInputSize += inputStats.size

    await sharp(inputPath)
      .resize(MAX_SIZE, MAX_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    const outputStats = await stat(outputPath)
    totalOutputSize += outputStats.size

    const inputKB = (inputStats.size / 1024).toFixed(0)
    const outputKB = (outputStats.size / 1024).toFixed(0)
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(0)

    console.log(`${file}: ${inputKB}KB -> ${outputKB}KB (${savings}% smaller)`)
  }

  const totalInputMB = (totalInputSize / 1024 / 1024).toFixed(2)
  const totalOutputMB = (totalOutputSize / 1024 / 1024).toFixed(2)
  const totalSavings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(0)

  console.log('\n========================================')
  console.log(`Total: ${totalInputMB}MB -> ${totalOutputMB}MB (${totalSavings}% smaller)`)
  console.log('========================================\n')
  console.log('Optimization complete!')
}

optimizeImages().catch(console.error)
