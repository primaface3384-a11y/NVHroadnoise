'use client'
import type { NVHCategoryResult } from '@/types/nvh'
import { SEVERITY_LABELS, SEVERITY_COLORS } from '@/types/nvh'

interface NoiseCategoryProps {
  categories: NVHCategoryResult[]
}

export default function NoiseCategory({ categories }: NoiseCategoryProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {categories.map((cat) => (
        <div
          key={cat.category}
          className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-200 truncate">
              {cat.label}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {cat.frequencyRange[0]}-{cat.frequencyRange[1]}Hz ·{' '}
              피크 {cat.dominantFrequency.toFixed(0)}Hz
            </div>
          </div>
          <div className="flex items-center gap-3 ml-3">
            <span className="text-sm font-mono text-slate-300">
              {cat.level_dBA.toFixed(1)} dBA
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: SEVERITY_COLORS[cat.severity] + '20',
                color: SEVERITY_COLORS[cat.severity],
              }}
            >
              {SEVERITY_LABELS[cat.severity]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
