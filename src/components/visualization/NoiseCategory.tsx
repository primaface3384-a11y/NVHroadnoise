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
          className="rounded-lg bg-slate-750 border border-slate-700 px-4 py-3"
          style={{ backgroundColor: 'rgba(30,41,59,0.8)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200">
                {cat.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {cat.description}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  backgroundColor: SEVERITY_COLORS[cat.severity] + '25',
                  color: SEVERITY_COLORS[cat.severity],
                }}
              >
                {SEVERITY_LABELS[cat.severity]}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {cat.level_dBA.toFixed(1)} dBA
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
