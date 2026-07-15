export function aWeightingCorrection(f: number): number {
  if (f < 1) return -Infinity
  const f2 = f * f
  const f4 = f2 * f2
  const numerator = 12194 * 12194 * f4
  const denominator =
    (f2 + 20.6 * 20.6) *
    Math.sqrt((f2 + 107.7 * 107.7) * (f2 + 737.9 * 737.9)) *
    (f2 + 12194 * 12194)
  const Ra = numerator / (denominator + 1e-30)
  return 20 * Math.log10(Ra + 1e-30) + 2.0
}

export function computeAWeightingTable(
  fftSize: number,
  sampleRate: number,
): Float64Array {
  const table = new Float64Array(fftSize / 2)
  for (let i = 0; i < fftSize / 2; i++) {
    const freq = (i * sampleRate) / fftSize
    table[i] = freq < 10 ? -70.4 : aWeightingCorrection(freq)
  }
  return table
}
