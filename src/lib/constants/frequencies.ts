export const THIRD_OCTAVE_CENTER_FREQUENCIES = [
  12.5, 16, 20, 25, 31.5, 40, 50, 63, 80, 100,
  125, 160, 200, 250, 315, 400, 500, 630, 800, 1000,
  1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000,
  12500, 16000, 20000,
] as const

export const THIRD_OCTAVE_BAND_FACTOR = Math.pow(2, 1 / 6)

export function getBandEdges(centerFreq: number): [number, number] {
  return [
    centerFreq / THIRD_OCTAVE_BAND_FACTOR,
    centerFreq * THIRD_OCTAVE_BAND_FACTOR,
  ]
}
