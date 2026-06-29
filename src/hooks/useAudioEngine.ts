'use client'
import { useState, useRef, useCallback } from 'react'
import { AudioEngine } from '@/lib/audio/AudioEngine'
import { AnalysisPipeline } from '@/lib/analysis/AnalysisPipeline'
import { AudioRecorder } from '@/lib/audio/AudioRecorder'
import type { AnalysisResult, AnalysisSnapshot } from '@/types/analysis'

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null)
  const pipelineRef = useRef<AnalysisPipeline | null>(null)
  const recorderRef = useRef<AudioRecorder | null>(null)
  const animFrameRef = useRef<number>(0)

  const [isInitialized, setIsInitialized] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0)

  const initialize = useCallback(async () => {
    if (engineRef.current?.isInitialized) return

    const engine = new AudioEngine()
    await engine.initialize()

    const sampleRate = engine.getSampleRate()
    const fftSize = engine.getFFTSize()
    const pipeline = new AnalysisPipeline(fftSize, sampleRate)

    const recorder = new AudioRecorder(sampleRate)

    engine.setRecordingCompleteCallback((chunks) => {
      recorder.onChunksReceived(chunks)
    })

    engineRef.current = engine
    pipelineRef.current = pipeline
    recorderRef.current = recorder
    setIsInitialized(true)
  }, [])

  const startCapture = useCallback(() => {
    const engine = engineRef.current
    const pipeline = pipelineRef.current
    if (!engine || !pipeline) return

    engine.startCapture()
    setIsCapturing(true)

    const analyser = engine.getAnalyser()
    if (!analyser) return

    const loop = () => {
      const result = pipeline.processFromAnalyser(analyser)
      if (result) setAnalysisResult({ ...result })
      animFrameRef.current = requestAnimationFrame(loop)
    }
    animFrameRef.current = requestAnimationFrame(loop)
  }, [])

  const stopCapture = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    engineRef.current?.stopCapture()
    setIsCapturing(false)
    setIsRecording(false)
  }, [])

  const startRecording = useCallback(() => {
    engineRef.current?.startRecording()
    recorderRef.current?.start()
    setIsRecording(true)
    setRecordingStartTime(Date.now())
  }, [])

  const stopRecording = useCallback(async (): Promise<string | null> => {
    const engine = engineRef.current
    const recorder = recorderRef.current
    const pipeline = pipelineRef.current
    if (!engine || !recorder || !pipeline) return null

    engine.stopRecording()
    setIsRecording(false)

    await new Promise((r) => setTimeout(r, 200))

    const snapshot: AnalysisSnapshot = {
      overallSPL: analysisResult?.overallSPL ?? -120,
      overallSPL_A: analysisResult?.overallSPL_A ?? -120,
      peakSPL: pipeline.getPeakSPL(),
      leqSPL: pipeline.getLeq(),
      octaveBands: analysisResult?.octaveBands ?? [],
      categories: analysisResult?.categories ?? [],
      averageSpectrum: analysisResult?.spectrum ? Array.from(analysisResult.spectrum) : [],
    }

    const id = await recorder.save(snapshot)
    return id
  }, [analysisResult])

  const getSpectrogramBuffer = useCallback(() => {
    return pipelineRef.current?.getSpectrogramBuffer() ?? null
  }, [])

  const getAnalyser = useCallback(() => {
    return engineRef.current?.getAnalyser() ?? null
  }, [])

  const getSampleRate = useCallback(() => {
    return engineRef.current?.getSampleRate() ?? 48000
  }, [])

  const getFFTSize = useCallback(() => {
    return engineRef.current?.getFFTSize() ?? 8192
  }, [])

  const destroy = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    engineRef.current?.destroy()
    engineRef.current = null
    pipelineRef.current = null
    setIsInitialized(false)
    setIsCapturing(false)
    setIsRecording(false)
  }, [])

  return {
    isInitialized,
    isCapturing,
    isRecording,
    analysisResult,
    recordingStartTime,
    initialize,
    startCapture,
    stopCapture,
    startRecording,
    stopRecording,
    getSpectrogramBuffer,
    getAnalyser,
    getSampleRate,
    getFFTSize,
    destroy,
  }
}
