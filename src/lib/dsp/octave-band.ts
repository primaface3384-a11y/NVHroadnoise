import { THIRD_OCTAVE_CENTER_FREQUENCIES, THIRD_OCTAVE_BAND_FACTOR } from '@/lib/constants/frequencies'
import { aWeightingCorrection } from './a-weighting'
import type { OctaveBandResult } from '@/types/analysis'

export function computeThirdOctaveBands(
  magnitudeSpectrum_dB: Float64Array | Float32Array,
  sampleRate: number,
  fftSize: number,
): OctaveBandResult[] {
  const freqResolution = sampleRate / fftSize
  const nyquist = sampleRate / 2

  return THIRD_OCTAVE_CENTER_FREQUENCIES
    .filter((fc) => fc < nyquist)
    .map((fc) => {
      const fLow = fc / THIRD_OCTAVE_BAND_FACTOR
      const fHigh = fc * THIRD_OCTAVE_BAND_FACTOR
      const binLow = Math.max(1, Math.round(fLow / freqResolution))
      const binHigh = Math.min(
        magnitudeSpectrum_dB.length - 1,
        Math.round(fHigh / freqResolution),
      )

      let powerSum = 0
      for (let bin = binLow; bin <= binHigh; bin++) {
        powerSum += Math.pow(10, magnitudeSpectrum_dB[bin] / 10)
      }

      const level_dB = 10 * Math.log10(powerSum + 1e-30)
      const level_dBA = level_dB + aWeightingCorrection(fc)

      return {
        centerFrequency: fc,
        lowerEdge: fLow,
        upperEdge: fHigh,
        level_dB,
        level_dBA,
      }
    })
}
