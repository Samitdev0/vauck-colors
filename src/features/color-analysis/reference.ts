import type {
  ColorReference,
  ColorReferenceSource,
  RGBColor,
} from '../../types/color'
import { rgbToHex } from './colorSampler'

export function createColorReference(
  rgb: RGBColor,
  source: ColorReferenceSource = 'manual',
  label = 'Reference color',
): ColorReference {
  return {
    label,
    rgb,
    hex: rgbToHex(rgb),
    source,
    createdAt: new Date().toISOString(),
  }
}