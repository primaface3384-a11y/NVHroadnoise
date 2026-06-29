import { NVH_DEFINITIONS } from '@/lib/constants/nvh-bands'
import type { OctaveBandResult } from '@/types/analysis'
import type { NVHCategoryResult, Severity } from '@/types/nvh'
import { NVHCategory } from '@/types/nvh'

function computeSpectralFlatness(
  magnitudeSpectrum_dB: Float64Array | Float32Array,
  startBin: number,
  endBin: number,
): number {
  const N = endBin - startBin + 1
  if (N <= 0) return 0

  let logSum = 0
  let linearSum = 0
  for (let i = startBin; i <= endBin && i < magnitudeSpectrum_dB.length; i++) {
    const power = Math.pow(10, magnitudeSpectrum_dB[i] / 10)
    logSum += Math.log(power + 1e-30)
    linearSum += power
  }

  const geometricMean = Math.exp(logSum / N)
  const arithmeticMean = linearSum / N

  return geometricMean / (arithmeticMean + 1e-30)
}

export function classifyNoise(
  octaveBands: OctaveBandResult[],
  overallSPL_dBA: number,
  magnitudeSpectrum_dB: Float64Array | Float32Array,
  sampleRate: number,
  fftSize: number,
): NVHCategoryResult[] {
  return NVH_DEFINITIONS.map((def) => {
    const bandsInRange = octaveBands.filter(
      (b) =>
        b.centerFrequency >= def.freqRange[0] &&
        b.centerFrequency <= def.freqRange[1],
    )

    const bandLevel_dBA =
      bandsInRange.length > 0
        ? 10 *
          Math.log10(
            bandsInRange.reduce(
              (sum, b) => sum + Math.pow(10, b.level_dBA / 10),
              0,
            ) + 1e-30,
          )
        : -100

    const binLow = Math.max(1, Math.round((def.freqRange[0] * fftSize) / sampleRate))
    const binHigh = Math.min(
      magnitudeSpectrum_dB.length - 1,
      Math.round((def.freqRange[1] * fftSize) / sampleRate),
    )

    let peakBin = binLow
    let peakValue = -Infinity
    for (let i = binLow; i <= binHigh && i < magnitudeSpectrum_dB.length; i++) {
      if (magnitudeSpectrum_dB[i] > peakValue) {
        peakValue = magnitudeSpectrum_dB[i]
        peakBin = i
      }
    }
    const dominantFrequency = (peakBin * sampleRate) / fftSize

    const relativeLevel = bandLevel_dBA - overallSPL_dBA
    let severity: Severity = 'low'
    if (relativeLevel >= def.thresholds.critical) severity = 'critical'
    else if (relativeLevel >= def.thresholds.high) severity = 'high'
    else if (relativeLevel >= def.thresholds.moderate) severity = 'moderate'

    if (
      def.category === NVHCategory.BOOMING ||
      def.category === NVHCategory.RUMBLE
    ) {
      const flatness = computeSpectralFlatness(
        magnitudeSpectrum_dB,
        binLow,
        binHigh,
      )
      if (def.category === NVHCategory.BOOMING && flatness > 0.5) {
        severity = 'low'
      }
      if (def.category === NVHCategory.RUMBLE && flatness < 0.3) {
        severity = 'low'
      }
    }

    return {
      category: def.category,
      label: def.label,
      frequencyRange: def.freqRange,
      level_dBA: bandLevel_dBA,
      severity,
      dominantFrequency,
      description: def.description,
    }
  })
}
