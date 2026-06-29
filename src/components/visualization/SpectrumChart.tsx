'use client'
import { useRef, useEffect } from 'react'

interface SpectrumChartProps {
  data: Float32Array | null
  sampleRate: number
  fftSize: number
  width?: number
  height?: number
  minDb?: number
  maxDb?: number
}

export default function SpectrumChart({
  data,
  sampleRate,
  fftSize,
  width = 600,
  height = 250,
  minDb = -100,
  maxDb = -20,
}: SpectrumChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 10, right: 10, bottom: 35, left: 50 }
    const chartW = width - pad.left - pad.right
    const chartH = height - pad.top - pad.bottom
    const nyquist = sampleRate / 2
    const range = maxDb - minDb

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    ctx.fillStyle = '#64748b'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'right'

    for (let db = minDb; db <= maxDb; db += 20) {
      const y = pad.top + chartH * (1 - (db - minDb) / range)
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(width - pad.right, y)
      ctx.stroke()
      ctx.fillText(`${db}`, pad.left - 5, y + 3)
    }

    ctx.textAlign = 'center'
    const freqLabels = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]
    for (const f of freqLabels) {
      if (f > nyquist) continue
      const logX = (Math.log10(f) - Math.log10(20)) / (Math.log10(nyquist) - Math.log10(20))
      const x = pad.left + chartW * logX
      ctx.strokeStyle = '#334155'
      ctx.beginPath()
      ctx.moveTo(x, pad.top)
      ctx.lineTo(x, pad.top + chartH)
      ctx.stroke()
      const label = f >= 1000 ? `${f / 1000}k` : `${f}`
      ctx.fillText(label, x, height - pad.bottom + 15)
    }

    ctx.fillStyle = '#64748b'
    ctx.fillText('Hz', width / 2, height - 3)

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    let started = false
    for (let i = 1; i < data.length; i++) {
      const freq = (i * sampleRate) / fftSize
      if (freq < 20 || freq > nyquist) continue
      const logX =
        (Math.log10(freq) - Math.log10(20)) /
        (Math.log10(nyquist) - Math.log10(20))
      const x = pad.left + chartW * logX
      const y = pad.top + chartH * (1 - (data[i] - minDb) / range)
      const clampedY = Math.max(pad.top, Math.min(pad.top + chartH, y))

      if (!started) {
        ctx.moveTo(x, clampedY)
        started = true
      } else {
        ctx.lineTo(x, clampedY)
      }
    }
    ctx.stroke()
  }, [data, sampleRate, fftSize, width, height, minDb, maxDb])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, maxWidth: width }}
      className="block rounded"
    />
  )
}
