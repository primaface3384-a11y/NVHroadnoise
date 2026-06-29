export function fft(re: Float64Array, im: Float64Array): void {
  const N = re.length
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1
    while (j & bit) {
      j ^= bit
      bit >>= 1
    }
    j ^= bit
    if (i < j) {
      ;[re[i], re[j]] = [re[j], re[i]]
      ;[im[i], im[j]] = [im[j], im[i]]
    }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const halfLen = len >> 1
    const angle = (-2 * Math.PI) / len
    const wRe = Math.cos(angle)
    const wIm = Math.sin(angle)
    for (let i = 0; i < N; i += len) {
      let curRe = 1,
        curIm = 0
      for (let j = 0; j < halfLen; j++) {
        const tRe = curRe * re[i + j + halfLen] - curIm * im[i + j + halfLen]
        const tIm = curRe * im[i + j + halfLen] + curIm * re[i + j + halfLen]
        re[i + j + halfLen] = re[i + j] - tRe
        im[i + j + halfLen] = im[i + j] - tIm
        re[i + j] += tRe
        im[i + j] += tIm
        const newCurRe = curRe * wRe - curIm * wIm
        curIm = curRe * wIm + curIm * wRe
        curRe = newCurRe
      }
    }
  }
}

export function magnitudeSpectrum(re: Float64Array, im: Float64Array): Float64Array {
  const N = re.length
  const mag = new Float64Array(N / 2)
  for (let i = 0; i < N / 2; i++) {
    mag[i] = 20 * Math.log10(Math.sqrt(re[i] * re[i] + im[i] * im[i]) / N + 1e-30)
  }
  return mag
}

export function computeFFT(samples: Float32Array, window: Float64Array): Float64Array {
  const N = samples.length
  const re = new Float64Array(N)
  const im = new Float64Array(N)
  for (let i = 0; i < N; i++) {
    re[i] = samples[i] * window[i]
  }
  fft(re, im)
  return magnitudeSpectrum(re, im)
}
