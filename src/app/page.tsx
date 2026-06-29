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

  return (
    <>
      {showUnlock && <IOSAudioUnlock onUnlocked={handleUnlock} />}
      <Header title="NVH 로드노이즈 분석기" subtitle="실시간 차량 소음 분석" />

      <div className="p-4 space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-medium text-slate-400 mb-2">
            종합 소음 수준
          </h2>
          <div className="text-4xl font-bold text-center mb-2">
            <span className="text-blue-400">
              {engine.analysisResult
                ? engine.analysisResult.overallSPL_A.toFixed(1)
                : '--.-'}
            </span>
            <span className="text-lg text-slate-400 ml-1">dB(A)</span>
          </div>
          <SPLMeter
            level={engine.analysisResult?.overallSPL_A ?? -60}
            peak={engine.analysisResult?.peakSPL ?? -60}
            width={340}
            height={50}
            min={-60}
            max={0}
          />
        </div>

        {engine.analysisResult && (
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-medium text-slate-400 mb-3">
              NVH 소음 분류
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
            <span className="block text-sm mt-2">상세 측정</span>
          </Link>
          <Link
            href="/recordings"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl p-4 text-center transition-colors"
          >
            <ListIcon />
            <span className="block text-sm mt-2">녹음 기록</span>
          </Link>
        </div>

        <p className="text-xs text-slate-500 text-center mt-6">
          본 측정값은 참고용이며, 정밀 측정에는 교정된 측정 마이크를 사용하세요.
        </p>
      </div>
    </>
  )
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
