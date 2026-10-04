import type {
  ColorMeasurement,
  ColorSource,
  RGBColor,
} from '../../types/color'
import { rgbToHex } from './colorSampler'

const DEFAULT_SAMPLE_SIZE = 24

export function createColorMeasurement(
  rgb: RGBColor,
  source: ColorSource = 'camera',
  sampleSize = DEFAULT_SAMPLE_SIZE,
): ColorMeasurement {
  return {
    rgb,
    hex: rgbToHex(rgb),
    source,
    capturedAt: new Date().toISOString(),
    sampleSize,
  }
}