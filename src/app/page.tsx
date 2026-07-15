'use client'
import { useState } from 'react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import Header from '@/components/layout/Header'
import IOSAudioUnlock from '@/components/audio/IOSAudioUnlock'
import SPLMeter from '@/components/visualization/SPLMeter'
import NoiseCategory from '@/components/visualization/NoiseCategory'
import Link from 'next/link'

export default function HomePage() {
  const engine = useAudioEngine()
  const [showUnlock, setShowUnlock] = useState(true)

  const handleUnlock = async () => {
    await engine.initialize()
    engine.startCapture()
    setShowUnlock(false)
  }

  const spl = engine.analysisResult?.overallSPL_A ?? null
  const splStatus = getSPLStatus(spl)

  return (
    <>
      {showUnlock && <IOSAudioUnlock onUnlocked={handleUnlock} />}
      <Header title="차량 소음 분석기" subtitle="실시간 소음 측정 및 분석" />

      <div className="p-4 space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-medium text-slate-400 mb-2">
            현재 소음 수준
          </h2>
          <div className="flex items-end justify-center gap-3 mb-1">
            <div className="text-4xl font-bold text-blue-400">
              {spl !== null ? spl.toFixed(1) : '--.-'}
            </div>
            <div className="pb-1 text-lg text-slate-400">dB(A)</div>
          </div>
          {splStatus && (
            <div className="text-center mb-2">
              <span
                className="text-sm font-medium px-3 py-0.5 rounded-full"
                style={{ color: splStatus.color, backgroundColor: splStatus.color + '20' }}
              >
                {splStatus.label}
              </span>
            </div>
          )}
          <SPLMeter
            level={engine.analysisResult?.overallSPL_A ?? -60}
            peak={engine.analysisResult?.peakSPL ?? -60}
            width={340}
            height={50}
            min={-60}
            max={0}
          />
          <p className="text-xs text-slate-600 text-center mt-2">
            참고: 조용한 방 ~-45 · 일상 대화 ~-30 · 도로변 ~-20
          </p>
        </div>

        {engine.analysisResult && (
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-medium text-slate-400 mb-3">
              소음 유형 분석
            </h2>
            <NoiseCategory categories={engine.analysisResult.categories} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/measure"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center transition-colors"
          >
            <MicIcon />
            <span className="block text-sm mt-2">소음 측정 및 녹음</span>
          </Link>
          <Link
            href="/recordings"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl p-4 text-center transition-colors"
          >
            <ListIcon />
            <span className="block text-sm mt-2">측정 기록 보기</span>
          </Link>
        </div>

        <p className="text-xs text-slate-500 text-center mt-6">
          측정값은 참고용입니다. 정밀 측정에는 교정된 장비를 사용하세요.
        </p>
      </div>
    </>
  )
}

function getSPLStatus(spl: number | null): { label: string; color: string } | null {
  if (spl === null) return null
  if (spl < -50) return { label: '매우 조용함', color: '#22c55e' }
  if (spl < -40) return { label: '조용함', color: '#84cc16' }
  if (spl < -28) return { label: '보통', color: '#eab308' }
  if (spl < -18) return { label: '다소 시끄러움', color: '#f97316' }
  if (spl < -8) return { label: '시끄러움', color: '#ef4444' }
  return { label: '매우 시끄러움', color: '#dc2626' }
}

function MicIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}
