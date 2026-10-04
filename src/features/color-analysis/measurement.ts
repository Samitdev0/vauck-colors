import type {
  CaptureQuality,
  ColorMeasurement,
  ColorSource,
  RGBColor,
  SampleSignature,
} from '../../types/color'
import { rgbToHex } from './colorSampler'
import { calculateCaptureQuality } from './captureQuality'

const DEFAULT_SAMPLE_SIZE = 24

export function createColorMeasurement(
  rgb: RGBColor,
  source: ColorSource = 'camera',
  sampleSize = DEFAULT_SAMPLE_SIZE,
  signature?: SampleSignature,
): ColorMeasurement {
  const quality: CaptureQuality | undefined = signature
    ? calculateCaptureQuality(signature)
    : undefined

  return {
    rgb,
    hex: rgbToHex(rgb),
    source,
    capturedAt: new Date().toISOString(),
    sampleSize,
    signature,
    quality,
  }
}
