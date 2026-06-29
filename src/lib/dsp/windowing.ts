export type WindowType = 'hann' | 'hamming' | 'blackman-harris'

export function hannWindow(N: number): Float64Array {
  const w = new Float64Array(N)
  for (let i = 0; i < N; i++) {
    w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1)))
  }
  return w
}

export function hammingWindow(N: number): Float64Array {
  const w = new Float64Array(N)
  for (let i = 0; i < N; i++) {
    w[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (N - 1))
  }
  return w
}

export function blackmanHarrisWindow(N: number): Float64Array {
  const w = new Float64Array(N)
  const a0 = 0.35875,
    a1 = 0.48829,
    a2 = 0.14128,
    a3 = 0.01168
  for (let i = 0; i < N; i++) {
    w[i] =
      a0 -
      a1 * Math.cos((2 * Math.PI * i) / (N - 1)) +
      a2 * Math.cos((4 * Math.PI * i) / (N - 1)) -
      a3 * Math.cos((6 * Math.PI * i) / (N - 1))
  }
  return w
}

export function createWindow(type: WindowType, N: number): Float64Array {
  switch (type) {
    case 'hann':
      return hannWindow(N)
    case 'hamming':
      return hammingWindow(N)
    case 'blackman-harris':
      return blackmanHarrisWindow(N)
  }
}
