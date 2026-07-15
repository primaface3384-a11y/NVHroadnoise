'use client'
import { useState } from 'react'

interface IOSAudioUnlockProps {
  onUnlocked: () => Promise<void>
}

export default function IOSAudioUnlock({ onUnlocked }: IOSAudioUnlockProps) {
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!visible) return null

  const handleTap = async () => {
    setLoading(true)
    setError(null)
    try {
      await onUnlocked()
      setVisible(false)
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? '마이크 권한이 거부되었습니다. 설정에서 마이크 접근을 허용해주세요.'
          : '오디오 초기화에 실패했습니다. 다시 시도해주세요.',
      )
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
      onClick={handleTap}
    >
      <div className="text-center px-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.5"
          className="mx-auto mb-6"
        >
          <rect x="9" y="1" width="6" height="12" rx="3" />
          <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">
          NVH 로드노이즈 분석기
        </h2>
        <p className="text-slate-300 mb-6">
          실시간 소음 분석을 위해 마이크 접근이 필요합니다
        </p>
        {error ? (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        ) : null}
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium">
          {loading ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : null}
          <span>{loading ? '초기화 중...' : '탭하여 시작'}</span>
        </div>
        <p className="text-slate-500 text-xs mt-8">
          본 측정값은 참고용이며, 정밀 측정에는 교정된 측정 마이크를 사용하세요.
        </p>
      </div>
    </div>
  )
}
