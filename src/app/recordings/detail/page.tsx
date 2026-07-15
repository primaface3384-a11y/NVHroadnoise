'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getRecording } from '@/lib/storage/recording-store'
import { generateReport } from '@/lib/pdf/report-generator'
import Header from '@/components/layout/Header'
import OctaveBandChart from '@/components/visualization/OctaveBandChart'
import NoiseCategory from '@/components/visualization/NoiseCategory'
import type { RecordingMetadata } from '@/types/recording'
import { SEVERITY_LABELS } from '@/types/nvh'

function RecordingDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [recording, setRecording] = useState<RecordingMetadata | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (id) getRecording(id).then((r) => setRecording(r ?? null))
  }, [id])

  const handleExportPDF = useCallback(async () => {
    if (!recording?.analysisResult) return
    setGenerating(true)
    try {
      const blob = await generateReport(recording)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NVH_${recording.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('PDF 생성 중 오류가 발생했습니다.')
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }, [recording])

  if (!id || !recording) {
    return (
      <>
        <Header title="녹음 상세" />
        <div className="p-4 text-center text-slate-400 py-12">
          {!id ? '녹음을 선택해주세요.' : '불러오는 중...'}
        </div>
      </>
    )
  }

  const a = recording.analysisResult
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}분 ${sec}초`
  }

  return (
    <>
      <Header
        title={recording.name}
        subtitle={new Date(recording.createdAt).toLocaleString('ko-KR')}
      />

      <div className="p-4 space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-3">측정 정보</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <InfoRow label="시간" value={formatDuration(recording.duration)} />
            <InfoRow label="차량" value={recording.vehicleModel || '-'} />
            <InfoRow label="타이어" value={recording.tireSpec || '-'} />
            <InfoRow
              label="속도"
              value={recording.speed ? `${recording.speed} km/h` : '-'}
            />
            <InfoRow label="노면" value={recording.roadSurface || '-'} />
          </div>
          {recording.notes && (
            <p className="text-sm text-slate-300 mt-2">{recording.notes}</p>
          )}
        </div>

        {a && (
          <>
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-sm text-slate-400 mb-3">종합 소음 수준</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {a.overallSPL_A.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">종합 dB(A)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    {a.peakSPL.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">최대 dB</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {a.leqSPL.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">Leq dB(A)</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-sm text-slate-400 mb-2">1/3 옥타브 밴드</h3>
              <OctaveBandChart bands={a.octaveBands} width={600} height={200} />
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-sm text-slate-400 mb-2">NVH 소음 분류</h3>
              <NoiseCategory categories={a.categories} />
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-sm text-slate-400 mb-3">분석 소견</h3>
              <div className="space-y-2 text-sm text-slate-300">
                {a.categories
                  .filter((c) => c.severity !== 'low')
                  .map((c) => (
                    <p key={c.category}>
                      · {c.label}이(가) {c.dominantFrequency.toFixed(0)}Hz에서{' '}
                      {SEVERITY_LABELS[c.severity]} 수준(
                      {c.level_dBA.toFixed(1)} dBA)으로 감지됨
                    </p>
                  ))}
                {a.categories.every((c) => c.severity === 'low') && (
                  <p>· 전반적 소음 수준이 양호합니다.</p>
                )}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleExportPDF}
          disabled={!a || generating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl py-3 text-center font-medium transition-colors flex items-center justify-center gap-2"
        >
          {generating ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
            </svg>
          )}
          {generating ? 'PDF 생성 중...' : 'PDF 리포트 내보내기'}
        </button>
      </div>
    </>
  )
}

export default function RecordingDetailPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header title="녹음 상세" />
          <div className="p-4 text-center text-slate-400 py-12">불러오는 중...</div>
        </>
      }
    >
      <RecordingDetailContent />
    </Suspense>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-300">{value}</span>
    </div>
  )
}
