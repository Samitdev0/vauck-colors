import type {
  CaptureQuality,
  CaptureQualityStatus,
  SampleSignature,
} from '../../types/color'

const GOOD_SCORE_THRESHOLD = 80
const WARNING_SCORE_THRESHOLD = 55

const MAX_ACCEPTABLE_CHANNEL_STD_DEV = 12
const MAX_WARNING_CHANNEL_STD_DEV = 20

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max)
}

function calculateValidPixelRatio(
  pixelsAnalyzed: number,
  sampleSize: number,
): number {
  const expectedPixels = sampleSize * sampleSize

  if (expectedPixels <= 0) {
    return 0
  }

  return clamp(
    pixelsAnalyzed / expectedPixels,
    0,
    1,
  )
}

function calculateUniformity(
  signature: SampleSignature,
): number {
  const { stdDev } = signature.statistics

  const averageStdDev =
    (stdDev.r + stdDev.g + stdDev.b) / 3

  const normalizedVariation =
    averageStdDev / MAX_WARNING_CHANNEL_STD_DEV

  return clamp(
    1 - normalizedVariation,
    0,
    1,
  )
}

function calculateExposure(
  signature: SampleSignature,
): number {
  const { mean } = signature.statistics

  const channels = [mean.r, mean.g, mean.b]

  const distanceFromCenter =
    channels.reduce(
      (total, value) =>
        total + Math.abs(value - 128),
      0,
    ) / channels.length

  return clamp(
    1 - distanceFromCenter / 128,
    0,
    1,
  )
}

function calculateColorVariation(
  signature: SampleSignature,
): number {
  const { stdDev } = signature.statistics

  const averageStdDev =
    (stdDev.r + stdDev.g + stdDev.b) / 3

  if (
    averageStdDev <=
    MAX_ACCEPTABLE_CHANNEL_STD_DEV
  ) {
    return 1
  }

  if (
    averageStdDev >=
    MAX_WARNING_CHANNEL_STD_DEV
  ) {
    return 0
  }

  const range =
    MAX_WARNING_CHANNEL_STD_DEV -
    MAX_ACCEPTABLE_CHANNEL_STD_DEV

  return clamp(
    1 -
      (averageStdDev -
        MAX_ACCEPTABLE_CHANNEL_STD_DEV) /
        range,
    0,
    1,
  )
}

function determineStatus(
  score: number,
): CaptureQualityStatus {
  if (score >= GOOD_SCORE_THRESHOLD) {
    return 'good'
  }

  if (score >= WARNING_SCORE_THRESHOLD) {
    return 'warning'
  }

  return 'poor'
}

export function calculateCaptureQuality(
  signature: SampleSignature,
): CaptureQuality {
  const validPixelRatio =
    calculateValidPixelRatio(
      signature.pixelsAnalyzed,
      signature.sampleSize,
    )

  const uniformity =
    calculateUniformity(signature)

  const exposure =
    calculateExposure(signature)

  const colorVariation =
    calculateColorVariation(signature)

  const score =
    (
      validPixelRatio * 0.25 +
      uniformity * 0.35 +
      exposure * 0.20 +
      colorVariation * 0.20
    ) * 100

  const roundedScore = Math.round(
    clamp(score, 0, 100),
  )

  return {
    score: roundedScore,
    uniformity: Math.round(
      uniformity * 100,
    ),
    exposure: Math.round(
      exposure * 100,
    ),
    validPixelRatio: Math.round(
      validPixelRatio * 100,
    ),
    colorVariation: Math.round(
      colorVariation * 100,
    ),
    status: determineStatus(
      roundedScore,
    ),
  }
}
