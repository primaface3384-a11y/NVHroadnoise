export interface AudioEngineState {
  context: AudioContext | null
  source: MediaStreamAudioSourceNode | null
  analyser: AnalyserNode | null
  worklet: AudioWorkletNode | null
  stream: MediaStream | null
  isInitialized: boolean
  isCapturing: boolean
  sampleRate: number
  fftSize: number
}

export interface AudioConfig {
  sampleRate: number
  fftSize: number
  channelCount: number
  bufferSize: number
}

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  sampleRate: 48000,
  fftSize: 8192,
  channelCount: 1,
  bufferSize: 4096,
}

export interface WorkletMessage {
  type: 'analysis-buffer' | 'recording-buffer'
  buffer: Float32Array
  timestamp: number
}
