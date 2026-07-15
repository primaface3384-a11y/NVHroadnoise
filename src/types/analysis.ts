import type { NVHCategoryResult } from './nvh'

export interface SpectrumData {
  frequencyData: Float32Array
  timeDomainData: Float32Array
  sampleRate: number
  fftSize: number
}

export interface OctaveBandResult {
  centerFrequency: number
  lowerEdge: number
  upperEdge: number
  level_dB: number
  level_dBA: number
}

export interface AnalysisResult {
  overallSPL: number
  overallSPL_A: number
  peakSPL: number
  spectrum: Float32Array
  octaveBands: OctaveBandResult[]
  categories: NVHCategoryResult[]
  timestamp: number
}

export interface AnalysisSnapshot {
  overallSPL: number
  overallSPL_A: number
  peakSPL: number
  leqSPL: number
  octaveBands: OctaveBandResult[]
  categories: NVHCategoryResult[]
  averageSpectrum: number[]
}
