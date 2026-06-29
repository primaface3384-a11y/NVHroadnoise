'use client'
import { useRef, useEffect } from 'react'
import type { SpectrogramBuffer } from '@/lib/analysis/SpectrogramBuffer'

interface SpectrogramProps {
  buffer: SpectrogramBuffer | null
  width?: number
  height?: number
  minDb?: number
  maxDb?: number
  sampleRate?: number
}

export default function Spectrogram({
  buffer,
  width = 600,
  height = 200,
  minDb = -100,
  maxDb = -20,
  sampleRate = 48000,
}: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !buffer) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const pad = { left: 45, bottom: 20 }
    const plotW = width - pad.left
    const plotH = height - pad.bottom

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.translate(pad.left, 0)

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = plotW
    tempCanvas.height = plotH
    const tempCtx = tempCanvas.getContext('2d')
    if (tempCtx) {
      buffer.render(tempCtx, tempCanvas, minDb, maxDb)
      ctx.drawImage(tempCanvas, 0, 0, plotW, plotH)
    }
    ctx.restore()

    ctx.fillStyle = '#64748b'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'right'
    const nyquist = sampleRate / 2
    const freqSteps = [0, nyquist / 4, nyquist / 2, (nyquist * 3) / 4, nyquist]
    freqSteps.forEach((f) => {
      const y = plotH * (1 - f / nyquist)
      const label = f >= 1000 ? `${(f / 1000).toFixed(1)}k` : `${Math.round(f)}`
      ctx.fillText(label, pad.left - 5, y + 3)
    })

    ctx.fillStyle = '#64748b'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('시간 →', width / 2, height - 3)
  }, [buffer, width, height, minDb, maxDb, sampleRate])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, maxWidth: width }}
      className="block rounded"
    />
  )
}
