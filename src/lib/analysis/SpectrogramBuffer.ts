export class SpectrogramBuffer {
  private buffer: Float32Array[]
  private writeIndex = 0
  private width: number
  private height: number

  constructor(width: number = 200, height: number = 0) {
    this.width = width
    this.height = height
    this.buffer = new Array(width)
      .fill(null)
      .map(() => new Float32Array(0))
  }

  push(spectrum: Float32Array): void {
    if (this.height === 0 && spectrum.length > 0) {
      this.height = spectrum.length
    }
    this.buffer[this.writeIndex] = new Float32Array(spectrum)
    this.writeIndex = (this.writeIndex + 1) % this.width
  }

  render(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    minDb: number = -100,
    maxDb: number = -20,
  ): void {
    const w = canvas.width
    const h = canvas.height
    const imageData = ctx.createImageData(w, h)
    const data = imageData.data
    const range = maxDb - minDb

    for (let x = 0; x < w; x++) {
      const bufIdx = (this.writeIndex + Math.floor((x * this.width) / w)) % this.width
      const col = this.buffer[bufIdx]
      if (!col || col.length === 0) continue

      for (let y = 0; y < h; y++) {
        const freqIdx = Math.floor(((h - 1 - y) * col.length) / h)
        const value = col[freqIdx] ?? minDb
        const normalized = Math.max(0, Math.min(1, (value - minDb) / range))

        const pixelIdx = (y * w + x) * 4
        const [r, g, b] = viridisColor(normalized)
        data[pixelIdx] = r
        data[pixelIdx + 1] = g
        data[pixelIdx + 2] = b
        data[pixelIdx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  getWidth(): number {
    return this.width
  }
}

function viridisColor(t: number): [number, number, number] {
  if (t < 0.25) {
    const s = t / 0.25
    return [
      Math.round(68 + s * (33 - 68)),
      Math.round(1 + s * (144 - 1)),
      Math.round(84 + s * (140 - 84)),
    ]
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25
    return [
      Math.round(33 + s * (53 - 33)),
      Math.round(144 + s * (183 - 144)),
      Math.round(140 + s * (121 - 140)),
    ]
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25
    return [
      Math.round(53 + s * (159 - 53)),
      Math.round(183 + s * (210 - 183)),
      Math.round(121 + s * (57 - 121)),
    ]
  } else {
    const s = (t - 0.75) / 0.25
    return [
      Math.round(159 + s * (253 - 159)),
      Math.round(210 + s * (231 - 210)),
      Math.round(57 + s * (37 - 57)),
    ]
  }
}
