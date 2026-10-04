import type {
  RGBColor,
  RGBStatistics,
  SampleSignature,
} from '../../types/color'

const DEFAULT_SAMPLE_SIZE = 24

interface PixelSample {
  r: number
  g: number
  b: number
}

function extractCenterPixels(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  sampleSize: number,
): PixelSample[] | null {
  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return null
  }

  const size = Math.min(
    sampleSize,
    video.videoWidth,
    video.videoHeight,
  )

  if (canvas.width !== sampleSize || canvas.height !== sampleSize) {
    canvas.width = sampleSize
    canvas.height = sampleSize
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const sourceX = (video.videoWidth - size) / 2
  const sourceY = (video.videoHeight - size) / 2

  context.drawImage(
    video,
    sourceX,
    sourceY,
    size,
    size,
    0,
    0,
    sampleSize,
    sampleSize,
  )

  const imageData = context.getImageData(
    0,
    0,
    sampleSize,
    sampleSize,
  )

  const pixels = imageData.data
  const samples: PixelSample[] = []

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3]

    if (alpha === 0) {
      continue
    }

    samples.push({
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2],
    })
  }

  return samples.length > 0 ? samples : null
}

function calculateMean(values: number[]): number {
  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  )

  return total / values.length
}

function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

function calculateStandardDeviation(
  values: number[],
  mean: number,
): number {
  const variance =
    values.reduce(
      (sum, value) => sum + (value - mean) ** 2,
      0,
    ) / values.length

  return Math.sqrt(variance)
}

function calculateChannelStatistics(
  values: number[],
): {
  mean: number
  median: number
  stdDev: number
  min: number
  max: number
} {
  const mean = calculateMean(values)

  return {
    mean,
    median: calculateMedian(values),
    stdDev: calculateStandardDeviation(values, mean),
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

function calculateStatistics(
  samples: PixelSample[],
): RGBStatistics {
  const red = samples.map((sample) => sample.r)
  const green = samples.map((sample) => sample.g)
  const blue = samples.map((sample) => sample.b)

  const redStatistics = calculateChannelStatistics(red)
  const greenStatistics = calculateChannelStatistics(green)
  const blueStatistics = calculateChannelStatistics(blue)

  return {
    mean: {
      r: Math.round(redStatistics.mean),
      g: Math.round(greenStatistics.mean),
      b: Math.round(blueStatistics.mean),
    },
    median: {
      r: Math.round(redStatistics.median),
      g: Math.round(greenStatistics.median),
      b: Math.round(blueStatistics.median),
    },
    stdDev: {
      r: Number(redStatistics.stdDev.toFixed(2)),
      g: Number(greenStatistics.stdDev.toFixed(2)),
      b: Number(blueStatistics.stdDev.toFixed(2)),
    },
    min: {
      r: redStatistics.min,
      g: greenStatistics.min,
      b: blueStatistics.min,
    },
    max: {
      r: redStatistics.max,
      g: greenStatistics.max,
      b: blueStatistics.max,
    },
  }
}

export function sampleCenterSignature(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  sampleSize = DEFAULT_SAMPLE_SIZE,
): SampleSignature | null {
  const samples = extractCenterPixels(
    video,
    canvas,
    sampleSize,
  )

  if (!samples) {
    return null
  }

  return {
    statistics: calculateStatistics(samples),
    pixelsAnalyzed: samples.length,
    sampleSize,
  }
}

export function sampleCenterColor(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  sampleSize = DEFAULT_SAMPLE_SIZE,
): RGBColor | null {
  const signature = sampleCenterSignature(
    video,
    canvas,
    sampleSize,
  )

  return signature?.statistics.mean ?? null
}

export function rgbToHex({ r, g, b }: RGBColor): string {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}