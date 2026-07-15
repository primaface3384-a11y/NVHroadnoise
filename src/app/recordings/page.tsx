'use client'
import { useRecordings } from '@/hooks/useRecordings'
import Header from '@/components/layout/Header'
import Link from 'next/link'

export default function RecordingsPage() {
  const { recordings, loading, remove } = useRecordings()

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Header title="녹음 목록" subtitle="저장된 측정 데이터" />
      <div className="p-4">
        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <span className="animate-spin inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : recordings.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-slate-600">
              <rect x="9" y="1" width="6" height="12" rx="3" />
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
            </svg>
            <p>녹음된 데이터가 없습니다</p>
            <p className="text-sm mt-1">측정 화면에서 녹음을 시작하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.map((rec) => (
              <div key={rec.id} className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <Link href={`/recordings/detail?id=${rec.id}`} className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-200 truncate">
                      {rec.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{formatDate(rec.createdAt)}</span>
                      <span>{formatDuration(rec.duration)}</span>
                      {rec.vehicleModel && <span>{rec.vehicleModel}</span>}
                    </div>
                    {rec.analysisResult && (
                      <div className="mt-2 text-sm">
                        <span className="text-blue-400 font-mono">
                          {rec.analysisResult.overallSPL_A.toFixed(1)} dB(A)
                        </span>
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('이 녹음을 삭제하시겠습니까?')) remove(rec.id)
                    }}
                    className="text-slate-500 hover:text-red-400 p-1 ml-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
