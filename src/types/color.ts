export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface RGBStatistics {
  mean: RGBColor
  median: RGBColor
  stdDev: RGBColor
  min: RGBColor
  max: RGBColor
}

export interface SampleSignature {
  statistics: RGBStatistics
  pixelsAnalyzed: number
  sampleSize: number
}

export type CaptureQualityStatus =
  | 'good'
  | 'warning'
  | 'poor'

export interface CaptureQuality {
  score: number
  uniformity: number
  exposure: number
  validPixelRatio: number
  colorVariation: number
  status: CaptureQualityStatus
}

export type ColorSource = 'camera'

export interface ColorMeasurement {
  rgb: RGBColor
  hex: string
  source: ColorSource
  capturedAt: string
  sampleSize: number
  signature?: SampleSignature
  quality?: CaptureQuality
}

export type ColorReferenceSource =
  | 'manual'
  | 'measurement'

export interface ColorReference {
  label: string
  rgb: RGBColor
  hex: string
  source: ColorReferenceSource
  createdAt: string
}
