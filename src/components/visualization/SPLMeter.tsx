'use client'
import { useRef, useEffect } from 'react'

interface SPLMeterProps {
  level: number
  peak: number
  label?: string
  unit?: string
  min?: number
  max?: number
  width?: number
  height?: number
}

export default function SPLMeter({
  level,
  peak,
  label = 'dB(A)',
  min = -60,
  max = 0,
  width = 300,
  height = 60,
}: SPLMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    const barY = 30
    const barHeight = 20
    const padding = 10

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(padding, barY, width - 2 * padding, barHeight)

    const normalizedLevel = Math.max(0, Math.min(1, (level - min) / (max - min)))
    const barWidth = (width - 2 * padding) * normalizedLevel

    const gradient = ctx.createLinearGradient(padding, 0, width - padding, 0)
    gradient.addColorStop(0, '#22c55e')
    gradient.addColorStop(0.6, '#eab308')
    gradient.addColorStop(0.85, '#f97316')
    gradient.addColorStop(1, '#ef4444')
    ctx.fillStyle = gradient
    ctx.fillRect(padding, barY, barWidth, barHeight)

    const normalizedPeak = Math.max(0, Math.min(1, (peak - min) / (max - min)))
    const peakX = padding + (width - 2 * padding) * normalizedPeak
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(peakX, barY)
    ctx.lineTo(peakX, barY + barHeight)
    ctx.stroke()

    ctx.fillStyle = '#f1f5f9'
    ctx.font = 'bold 16px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(`${level.toFixed(1)} ${label}`, padding, 20)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'right'
    ctx.fillText(`Peak: ${peak.toFixed(1)}`, width - padding, 20)
  }, [level, peak, label, min, max, width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  )
}
