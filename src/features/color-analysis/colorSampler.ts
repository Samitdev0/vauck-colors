import type { RGBColor } from '../../types/color'

const DEFAULT_SAMPLE_SIZE = 24

export function sampleCenterColor(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  sampleSize = DEFAULT_SAMPLE_SIZE,
): RGBColor | null {
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

  let red = 0
  let green = 0
  let blue = 0
  let pixelCount = 0

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3]

    if (alpha === 0) {
      continue
    }

    red += pixels[index]
    green += pixels[index + 1]
    blue += pixels[index + 2]

    pixelCount += 1
  }

  if (pixelCount === 0) {
    return null
  }

  return {
    r: Math.round(red / pixelCount),
    g: Math.round(green / pixelCount),
    b: Math.round(blue / pixelCount),
  }
}

export function rgbToHex({ r, g, b }: RGBColor): string {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}