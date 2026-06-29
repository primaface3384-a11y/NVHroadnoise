'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import Header from '@/components/layout/Header'
import IOSAudioUnlock from '@/components/audio/IOSAudioUnlock'
import SPLMeter from '@/components/visualization/SPLMeter'
import SpectrumChart from '@/components/visualization/SpectrumChart'
import OctaveBandChart from '@/components/visualization/OctaveBandChart'
import Spectrogram from '@/components/visualization/Spectrogram'
import NoiseCategory from '@/components/visualization/NoiseCategory'

export default function MeasurePage() {
  const engine = useAudioEngine()
  const [showUnlock, setShowUnlock] = useState(true)
  const [recordingTime, setRecordingTime] = useState(0)
  const [, setTick] = useState(0)

  const handleUnlock = async () => {
    await engine.initialize()
    engine.startCapture()
    setShowUnlock(false)
  }

  useEffect(() => {
    if (!engine.isRecording) {
      setRecordingTime(0)
      return
    }
    const interval = setInterval(() => {
      setRecordingTime(Math.floor((Date.now() - engine.recordingStartTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [engine.isRecording, engine.recordingStartTime])

  useEffect(() => {
    if (!engine.isCapturing) return
    const interval = setInterval(() => setTick((t) => t + 1), 100)
    return () => clearInterval(interval)
  }, [engine.isCapturing])

  const handleRecord = useCallback(async () => {
    if (engine.isRecording) {
      const id = await engine.stopRecording()
      if (id) {
        alert(`녹음이 저장되었습니다.`)
      }
    } else {
      engine.startRecording()
    }
  }, [engine])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const result = engine.analysisResult

  return (
    <>
      {showUnlock && <IOSAudioUnlock onUnlocked={handleUnlock} />}
      <Header title="실시간 측정" subtitle="NVH 로드노이즈 분석" />

      <div className="p-4 space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-3xl font-bold text-blue-400">
                {result ? result.overallSPL_A.toFixed(1) : '--.-'}
              </span>
              <span className="text-sm text-slate-400 ml-1">dB(A)</span>
            </div>
            <button
              onClick={handleRecord}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                engine.isRecording
                  ? 'bg-red-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {engine.isRecording && (
                <span className="absolute inset-0 rounded-full bg-red-500 pulse-ring" />
              )}
              {engine.isRecording ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              )}
            </button>
          </div>
          {engine.isRecording && (
            <div className="text-center text-red-400 text-sm font-mono">
              녹음 중 {formatTime(recordingTime)}
            </div>
          )}
          <SPLMeter
            level={result?.overallSPL_A ?? -60}
            peak={result?.peakSPL ?? -60}
            width={340}
            height={50}
            min={-60}
            max={0}
          />
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-2">주파수 스펙트럼</h3>
          <SpectrumChart
            data={result?.spectrum ?? null}
            sampleRate={engine.getSampleRate()}
            fftSize={engine.getFFTSize()}
            width={600}
            height={200}
          />
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-2">스펙트로그램</h3>
          <Spectrogram
            buffer={engine.getSpectrogramBuffer()}
            sampleRate={engine.getSampleRate()}
            width={600}
            height={160}
          />
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-2">1/3 옥타브 밴드</h3>
          <OctaveBandChart
            bands={result?.octaveBands ?? []}
            width={600}
            height={200}
          />
        </div>

        {result && (
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-sm text-slate-400 mb-2">NVH 소음 분류</h3>
            <NoiseCategory categories={result.categories} />
          </div>
        )}
      </div>
    </>
  )
}
