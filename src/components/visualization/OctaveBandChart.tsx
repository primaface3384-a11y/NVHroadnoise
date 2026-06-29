'use client'
import { useRef, useEffect } from 'react'
import type { OctaveBandResult } from '@/types/analysis'

interface OctaveBandChartProps {
  bands: OctaveBandResult[]
  width?: number
  height?: number
  minDb?: number
  maxDb?: number
  showAWeighting?: boolean
}

export default function OctaveBandChart({
  bands,
  width = 600,
  height = 250,
  minDb = -80,
  maxDb = -10,
  showAWeighting = true,
}: OctaveBandChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || bands.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 10, right: 10, bottom: 50, left: 45 }
    const chartW = width - pad.left - pad.right
    const chartH = height - pad.top - pad.bottom
    const range = maxDb - minDb

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    ctx.fillStyle = '#64748b'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'right'

    for (let db = minDb; db <= maxDb; db += 10) {
      const y = pad.top + chartH * (1 - (db - minDb) / range)
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(width - pad.right, y)
      ctx.stroke()
      ctx.fillText(`${db}`, pad.left - 5, y + 3)
    }

    const barWidth = Math.max(4, (chartW / bands.length) * 0.7)
    const gap = chartW / bands.length

    bands.forEach((band, i) => {
      const x = pad.left + i * gap + (gap - barWidth) / 2
      const value = showAWeighting ? band.level_dBA : band.level_dB
      const normalizedH = Math.max(0, (value - minDb) / range) * chartH
      const y = pad.top + chartH - normalizedH

      const gradient = ctx.createLinearGradient(x, y, x, pad.top + chartH)
      gradient.addColorStop(0, '#3b82f6')
      gradient.addColorStop(1, '#1e40af')
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, normalizedH)

      if (i % 3 === 0 || bands.length < 15) {
        ctx.save()
        ctx.translate(x + barWidth / 2, height - pad.bottom + 8)
        ctx.rotate(-Math.PI / 4)
        ctx.fillStyle = '#94a3b8'
        ctx.font = '9px system-ui'
        ctx.textAlign = 'right'
        const f = band.centerFrequency
        const label = f >= 1000 ? `${(f / 1000).toFixed(f >= 10000 ? 0 : 1)}k` : `${f}`
        ctx.fillText(label, 0, 0)
        ctx.restore()
      }
    })

    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(showAWeighting ? 'dB(A)' : 'dB', pad.left, pad.top - 2)
  }, [bands, width, height, minDb, maxDb, showAWeighting])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, maxWidth: width }}
      className="block rounded"
    />
  )
}
