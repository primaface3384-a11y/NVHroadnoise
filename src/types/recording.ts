import type { AnalysisSnapshot } from './analysis'

export interface RecordingMetadata {
  id: string
  name: string
  createdAt: number
  duration: number
  sampleRate: number
  channelCount: number
  vehicleModel: string
  tireSpec: string
  speed: number
  roadSurface: string
  notes: string
  analysisResult: AnalysisSnapshot | null
}

export interface AudioDataRecord {
  id: string
  buffer: ArrayBuffer
  sampleRate: number
}

export type RoadSurface =
  | '아스팔트'
  | '콘크리트'
  | '자갈'
  | '블록'
  | '기타'

export const ROAD_SURFACES: RoadSurface[] = [
  '아스팔트',
  '콘크리트',
  '자갈',
  '블록',
  '기타',
]
