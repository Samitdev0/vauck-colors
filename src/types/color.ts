export interface RGBColor {
  r: number
  g: number
  b: number
}

export type ColorSource = 'camera'

export interface ColorMeasurement {
  rgb: RGBColor
  hex: string
  source: ColorSource
  capturedAt: string
  sampleSize: number
}