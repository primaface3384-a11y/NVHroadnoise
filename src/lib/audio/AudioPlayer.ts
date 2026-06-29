import { getAudioData } from '@/lib/storage/recording-store'

export class AudioPlayer {
  private context: AudioContext
  private sourceNode: AudioBufferSourceNode | null = null
  private analyser: AnalyserNode
  private startTime: number = 0
  private duration: number = 0

  isPlaying = false

  constructor(context: AudioContext, analyser: AnalyserNode) {
    this.context = context
    this.analyser = analyser
  }

  async load(id: string): Promise<number> {
    const data = await getAudioData(id)
    if (!data) throw new Error('Audio data not found')

    const samples = new Float32Array(data.buffer)
    const audioBuffer = this.context.createBuffer(
      1,
      samples.length,
      data.sampleRate,
    )
    audioBuffer.getChannelData(0).set(samples)

    this.sourceNode = this.context.createBufferSource()
    this.sourceNode.buffer = audioBuffer
    this.sourceNode.connect(this.analyser)
    this.duration = audioBuffer.duration

    this.sourceNode.onended = () => {
      this.isPlaying = false
    }

    return this.duration
  }

  play(): void {
    if (!this.sourceNode || this.isPlaying) return
    this.sourceNode.start(0)
    this.startTime = this.context.currentTime
    this.isPlaying = true
  }

  stop(): void {
    if (!this.sourceNode) return
    try {
      this.sourceNode.stop()
    } catch {
      // already stopped
    }
    this.sourceNode.disconnect()
    this.sourceNode = null
    this.isPlaying = false
  }

  getCurrentTime(): number {
    if (!this.isPlaying) return 0
    return this.context.currentTime - this.startTime
  }

  getDuration(): number {
    return this.duration
  }
}
