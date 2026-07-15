import { NVHCategory, type NVHCategoryDefinition } from '@/types/nvh'

export const NVH_DEFINITIONS: NVHCategoryDefinition[] = [
  {
    category: NVHCategory.HIGH_FREQ_ROAD_NOISE,
    label: '고음 로드노이즈',
    freqRange: [500, 5000],
    description: '날카롭고 거슬리는 고음역 소음 (쉬~, 찍찍 소리)',
    thresholds: { moderate: -10, high: -5, critical: 0 },
  },
  {
    category: NVHCategory.TIRE_CAVITY_RESONANCE,
    label: '타이어 울림 소음',
    freqRange: [180, 280],
    description: '특정 속도에서 타이어 내부 공기가 울리는 소음 (웅~ 소리)',
    thresholds: { moderate: -8, high: -3, critical: 2 },
  },
  {
    category: NVHCategory.BOOMING,
    label: '저음 울림 (부밍)',
    freqRange: [30, 80],
    description: '차 실내를 가득 채우는 저음 울림 (붕붕 소리)',
    thresholds: { moderate: -6, high: -2, critical: 3 },
  },
  {
    category: NVHCategory.RUMBLE,
    label: '노면 진동 소음',
    freqRange: [20, 100],
    description: '거친 노면에서 느껴지는 진동성 소음 (우르릉 소리)',
    thresholds: { moderate: -8, high: -4, critical: 1 },
  },
  {
    category: NVHCategory.PATTERN_NOISE,
    label: '타이어 패턴 소음',
    freqRange: [200, 2000],
    description: '속도에 따라 변하는 규칙적인 타이어 소음 (위이잉 소리)',
    thresholds: { moderate: -10, high: -5, critical: 0 },
  },
]
