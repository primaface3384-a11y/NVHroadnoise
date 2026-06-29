'use client'
import { useRef, useEffect } from 'react'

interface WaveformViewProps {
  data: Float32Array | null
  width?: number
  height?: number
}

export default function WaveformView({
  data,
  width = 600,
  height = 100,
}: WaveformViewProps) {
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

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1
    ctx.beginPath()

    const step = Math.max(1, Math.floor(data.length / width))
    for (let i = 0; i < width; i++) {
      const idx = Math.floor((i * data.length) / width)
      const y = (1 - data[idx]) * height / 2
      if (i === 0) ctx.moveTo(i, y)
      else ctx.lineTo(i, y)
    }
    ctx.stroke()
  }, [data, width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, maxWidth: width }}
      className="block rounded"
    />
  )
}
