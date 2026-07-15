export enum NVHCategory {
  HIGH_FREQ_ROAD_NOISE = 'high_freq_road_noise',
  TIRE_CAVITY_RESONANCE = 'tire_cavity_resonance',
  BOOMING = 'booming',
  RUMBLE = 'rumble',
  PATTERN_NOISE = 'pattern_noise',
}

export type Severity = 'low' | 'moderate' | 'high' | 'critical'

export interface NVHCategoryResult {
  category: NVHCategory
  label: string
  frequencyRange: [number, number]
  level_dBA: number
  severity: Severity
  dominantFrequency: number
  description: string
}

export interface NVHCategoryDefinition {
  category: NVHCategory
  label: string
  freqRange: [number, number]
  description: string
  thresholds: { moderate: number; high: number; critical: number }
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: '낮음',
  moderate: '보통',
  high: '높음',
  critical: '심각',
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}
