import { saveRecording, saveAudioData } from '@/lib/storage/recording-store'
import type { RecordingMetadata } from '@/types/recording'
import type { AnalysisSnapshot } from '@/types/analysis'

export class AudioRecorder {
  private chunks: Float32Array[] = []
  private startTime: number = 0
  private sampleRate: number

  constructor(sampleRate: number = 48000) {
    this.sampleRate = sampleRate
  }

  onChunksReceived(chunks: Float32Array[]): void {
    this.chunks = chunks
  }

  start(): void {
    this.chunks = []
    this.startTime = Date.now()
  }

  async save(
    analysisResult: AnalysisSnapshot | null,
    metadata: Partial<RecordingMetadata> = {},
  ): Promise<string> {
    const totalLength = this.chunks.reduce((sum, c) => sum + c.length, 0)
    const fullBuffer = new Float32Array(totalLength)
    let offset = 0
    for (const chunk of this.chunks) {
      fullBuffer.set(chunk, offset)
      offset += chunk.length
    }

    const id = crypto.randomUUID()
    const duration = totalLength / this.sampleRate

    const recording: RecordingMetadata = {
      id,
      name: `녹음 ${new Date().toLocaleString('ko-KR')}`,
      createdAt: this.startTime || Date.now(),
      duration,
      sampleRate: this.sampleRate,
      channelCount: 1,
      vehicleModel: metadata.vehicleModel ?? '',
      tireSpec: metadata.tireSpec ?? '',
      speed: metadata.speed ?? 0,
      roadSurface: metadata.roadSurface ?? '아스팔트',
      notes: metadata.notes ?? '',
      analysisResult,
    }

    await saveAudioData({ id, buffer: fullBuffer.buffer, sampleRate: this.sampleRate })
    await saveRecording(recording)

    this.chunks = []
    return id
  }
}
