import { createAudioContext, requestMicrophone, setupVisibilityHandler } from './ios-audio-context'
import { DEFAULT_AUDIO_CONFIG } from '@/types/audio'
import type { AudioConfig } from '@/types/audio'

export type AnalysisCallback = (buffer: Float32Array, timestamp: number) => void
export type RecordingCompleteCallback = (chunks: Float32Array[]) => void

export class AudioEngine {
  private context: AudioContext | null = null
  private stream: MediaStream | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private analyserNode: AnalyserNode | null = null
  private workletNode: AudioWorkletNode | null = null
  private gainNode: GainNode | null = null
  private cleanupVisibility: (() => void) | null = null
  private config: AudioConfig
  private onAnalysis: AnalysisCallback | null = null
  private onRecordingComplete: RecordingCompleteCallback | null = null

  isInitialized = false
  isCapturing = false
  isRecording = false

  constructor(config: Partial<AudioConfig> = {}) {
    this.config = { ...DEFAULT_AUDIO_CONFIG, ...config }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    this.context = await createAudioContext(this.config.sampleRate)
    this.stream = await requestMicrophone()

    this.source = this.context.createMediaStreamSource(this.stream)

    this.analyserNode = this.context.createAnalyser()
    this.analyserNode.fftSize = this.config.fftSize
    this.analyserNode.smoothingTimeConstant = 0.3

    this.gainNode = this.context.createGain()
    this.gainNode.gain.value = 0

    try {
      await this.context.audioWorklet.addModule('/NVHroadnoise/worklet/audio-processor.js')
      this.workletNode = new AudioWorkletNode(this.context, 'audio-processor')
      this.workletNode.port.onmessage = (event) => {
        const data = event.data
        if (data.type === 'analysis-buffer' && this.onAnalysis) {
          this.onAnalysis(data.buffer, data.timestamp)
        } else if (
          data.type === 'recording-complete' &&
          this.onRecordingComplete
        ) {
          this.onRecordingComplete(data.chunks)
        }
      }
    } catch {
      this.workletNode = null
    }

    this.cleanupVisibility = setupVisibilityHandler(this.context)
    this.isInitialized = true
  }

  startCapture(): void {
    if (!this.source || !this.analyserNode || !this.gainNode) return

    this.source.connect(this.analyserNode)
    if (this.workletNode) {
      this.source.connect(this.workletNode)
      this.workletNode.connect(this.gainNode)
    }
    this.gainNode.connect(this.context!.destination)
    this.isCapturing = true
  }

  stopCapture(): void {
    if (this.isRecording) this.stopRecording()
    this.source?.disconnect()
    this.workletNode?.disconnect()
    this.gainNode?.disconnect()
    this.isCapturing = false
  }

  startRecording(): void {
    if (!this.workletNode || this.isRecording) return
    this.workletNode.port.postMessage({ type: 'start-recording' })
    this.isRecording = true
  }

  stopRecording(): void {
    if (!this.workletNode || !this.isRecording) return
    this.workletNode.port.postMessage({ type: 'stop-recording' })
    this.isRecording = false
  }

  setAnalysisCallback(cb: AnalysisCallback): void {
    this.onAnalysis = cb
  }

  setRecordingCompleteCallback(cb: RecordingCompleteCallback): void {
    this.onRecordingComplete = cb
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyserNode
  }

  getContext(): AudioContext | null {
    return this.context
  }

  getSampleRate(): number {
    return this.context?.sampleRate ?? this.config.sampleRate
  }

  getFFTSize(): number {
    return this.config.fftSize
  }

  destroy(): void {
    this.stopCapture()
    this.cleanupVisibility?.()
    this.stream?.getTracks().forEach((t) => t.stop())
    this.context?.close()
    this.context = null
    this.stream = null
    this.source = null
    this.analyserNode = null
    this.workletNode = null
    this.gainNode = null
    this.isInitialized = false
  }
}
