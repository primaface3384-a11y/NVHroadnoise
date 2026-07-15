import { NVHCategory, type NVHCategoryDefinition } from '@/types/nvh'

export const NVH_DEFINITIONS: NVHCategoryDefinition[] = [
  {
    category: NVHCategory.HIGH_FREQ_ROAD_NOISE,
    label: '고주파 로드노이즈',
    freqRange: [500, 5000],
    description: '타이어-노면 상호작용에 의한 고주파 소음',
    thresholds: { moderate: -10, high: -5, critical: 0 },
  },
  {
    category: NVHCategory.TIRE_CAVITY_RESONANCE,
    label: '타이어 공명음',
    freqRange: [180, 280],
    description: '타이어 내부 공기 공명에 의한 특정 주파수 피크',
    thresholds: { moderate: -8, high: -3, critical: 2 },
  },
  {
    category: NVHCategory.BOOMING,
    label: '부밍',
    freqRange: [30, 80],
    description: '차체 구조 공진에 의한 저주파 소음',
    thresholds: { moderate: -6, high: -2, critical: 3 },
  },
  {
    category: NVHCategory.RUMBLE,
    label: '럼블',
    freqRange: [20, 100],
    description: '불규칙한 저주파 소음 (노면 불규칙성)',
    thresholds: { moderate: -8, high: -4, critical: 1 },
  },
  {
    category: NVHCategory.PATTERN_NOISE,
    label: '패턴 노이즈',
    freqRange: [200, 2000],
    description: '트레드 패턴에 의한 속도 비례 고조파 소음',
    thresholds: { moderate: -10, high: -5, critical: 0 },
  },
]
