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

export type ColorReferenceSource = 'manual' | 'measurement'

export interface ColorReference {
  label: string
  rgb: RGBColor
  hex: string
  source: ColorReferenceSource
  createdAt: string
}