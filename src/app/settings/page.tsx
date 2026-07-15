'use client'
import { useState, useEffect } from 'react'
import { getSetting, setSetting } from '@/lib/storage/recording-store'
import Header from '@/components/layout/Header'

export default function SettingsPage() {
  const [calibration, setCalibration] = useState(0)
  const [fftSize, setFftSize] = useState(8192)
  const [windowFn, setWindowFn] = useState('hann')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      getSetting('calibration', 0),
      getSetting('fftSize', 8192),
      getSetting('windowFunction', 'hann'),
    ]).then(([cal, fft, win]) => {
      setCalibration(cal)
      setFftSize(fft)
      setWindowFn(win)
      setLoaded(true)
    })
  }, [])

  const save = async (key: string, value: unknown) => {
    await setSetting(key, value)
  }

  if (!loaded) return null

  return (
    <>
      <Header title="설정" />
      <div className="p-4 space-y-4">

        {/* 기본 설정 */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">마이크 보정</h3>
          <label className="block text-xs text-slate-500 mb-2">
            보정값 (dB) — 다른 소음계와 비교해 차이가 있을 때 입력하세요
          </label>
          <input
            type="number"
            step="0.1"
            value={calibration}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || 0
              setCalibration(v)
              save('calibration', v)
            }}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
          />
          <p className="text-xs text-slate-600 mt-1">
            기본값 0 · 스마트폰 마이크는 기기마다 차이가 있을 수 있습니다
          </p>
        </div>

        {/* 앱으로 설치하기 */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">앱으로 설치하는 방법</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
              <span>iPhone의 <span className="text-blue-400">Safari 브라우저</span>로 이 페이지를 열어주세요</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
              <span>하단의 <span className="text-blue-400">공유 버튼 ⬆</span>을 탭하세요</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
              <span><span className="text-blue-400">&quot;홈 화면에 추가&quot;</span>를 선택하세요</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">4</span>
              <span>홈 화면에 아이콘이 생기고 앱처럼 실행됩니다</span>
            </div>
          </div>
        </div>

        {/* 고급 설정 */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">고급 설정 <span className="text-xs font-normal text-slate-500">(일반적으로 변경 불필요)</span></h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">분석 정밀도</label>
              <select
                value={fftSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  setFftSize(v)
                  save('fftSize', v)
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
              >
                <option value={2048}>빠른 응답 (정밀도 낮음)</option>
                <option value={4096}>보통</option>
                <option value={8192}>높은 정밀도 (권장)</option>
                <option value={16384}>최고 정밀도 (느릴 수 있음)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">분석 방법</label>
              <select
                value={windowFn}
                onChange={(e) => {
                  setWindowFn(e.target.value)
                  save('windowFunction', e.target.value)
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
              >
                <option value="hann">Hann (권장)</option>
                <option value="hamming">Hamming</option>
                <option value="blackman-harris">Blackman-Harris</option>
              </select>
            </div>
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2">앱 정보</h3>
          <div className="text-sm text-slate-500 space-y-1">
            <p>차량 소음 분석기 v1.0.0</p>
            <p>주행 중 발생하는 소음을 실시간으로 분석하는 도구입니다.</p>
            <p className="text-slate-600 text-xs mt-2">
              측정값은 참고용이며, 정밀 측정에는 교정된 측정 장비를 사용하세요.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
