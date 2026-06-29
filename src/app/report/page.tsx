'use client'
import { useState } from 'react'
import { useRecordings } from '@/hooks/useRecordings'
import { generateReport } from '@/lib/pdf/report-generator'
import Header from '@/components/layout/Header'

export default function ReportPage() {
  const { recordings, loading } = useRecordings()
  const [generating, setGenerating] = useState<string | null>(null)

  const handleExport = async (rec: typeof recordings[0]) => {
    if (!rec.analysisResult) return
    setGenerating(rec.id)
    try {
      const blob = await generateReport(rec)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NVH_${rec.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('PDF 생성 실패')
      console.error(e)
    }
    setGenerating(null)
  }

  const recsWithAnalysis = recordings.filter((r) => r.analysisResult)

  return (
    <>
      <Header title="PDF 리포트" subtitle="분석 결과를 PDF로 내보내기" />
      <div className="p-4">
        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <span className="animate-spin inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : recsWithAnalysis.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <p>분석 데이터가 있는 녹음이 없습니다</p>
            <p className="text-sm mt-1">측정 화면에서 녹음을 먼저 진행하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recsWithAnalysis.map((rec) => (
              <div key={rec.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-200 truncate">
                    {rec.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(rec.createdAt).toLocaleString('ko-KR')} ·{' '}
                    {rec.analysisResult!.overallSPL_A.toFixed(1)} dB(A)
                  </p>
                </div>
                <button
                  onClick={() => handleExport(rec)}
                  disabled={generating === rec.id}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg ml-3 transition-colors"
                >
                  {generating === rec.id ? '생성 중...' : 'PDF'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
