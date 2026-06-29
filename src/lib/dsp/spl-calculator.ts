export function computeRMSLevel(samples: Float32Array): number {
  let sumSquares = 0
  for (let i = 0; i < samples.length; i++) {
    sumSquares += samples[i] * samples[i]
  }
  const rms = Math.sqrt(sumSquares / samples.length)
  return 20 * Math.log10(rms + 1e-30)
}

export function computeOverallSPL(
  magnitudeSpectrum_dB: Float64Array | Float32Array,
): number {
  let totalPower = 0
  for (let i = 1; i < magnitudeSpectrum_dB.length; i++) {
    totalPower += Math.pow(10, magnitudeSpectrum_dB[i] / 10)
  }
  return 10 * Math.log10(totalPower + 1e-30)
}

export function computeWeightedSPL(
  magnitudeSpectrum_dB: Float64Array | Float32Array,
  aWeightingTable: Float64Array,
): number {
  let totalPower = 0
  for (let i = 1; i < magnitudeSpectrum_dB.length; i++) {
    const weightedDB = magnitudeSpectrum_dB[i] + aWeightingTable[i]
    totalPower += Math.pow(10, weightedDB / 10)
  }
  return 10 * Math.log10(totalPower + 1e-30)
}

export function computePeakLevel(samples: Float32Array): number {
  let peak = 0
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i])
    if (abs > peak) peak = abs
  }
  return 20 * Math.log10(peak + 1e-30)
}

export function computeBandLevel(
  magnitudeSpectrum_dB: Float64Array | Float32Array,
  startBin: number,
  endBin: number,
): number {
  let power = 0
  for (let i = startBin; i <= endBin && i < magnitudeSpectrum_dB.length; i++) {
    power += Math.pow(10, magnitudeSpectrum_dB[i] / 10)
  }
  return 10 * Math.log10(power + 1e-30)
}
