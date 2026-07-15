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
        <div className="bg-slate-800 rounded-xl p-4">
          <label className="block text-sm text-slate-400 mb-2">
            교정 오프셋 (dB)
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
          <p className="text-xs text-slate-500 mt-1">
            교정된 소음계와 비교하여 차이값을 입력하세요
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <label className="block text-sm text-slate-400 mb-2">FFT 크기</label>
          <select
            value={fftSize}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              setFftSize(v)
              save('fftSize', v)
            }}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
          >
            <option value={2048}>2048 (낮은 해상도, 빠른 응답)</option>
            <option value={4096}>4096 (보통)</option>
            <option value={8192}>8192 (높은 해상도, 권장)</option>
            <option value={16384}>16384 (최고 해상도)</option>
          </select>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <label className="block text-sm text-slate-400 mb-2">
            윈도우 함수
          </label>
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

        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-2">정보</h3>
          <div className="text-sm text-slate-300 space-y-1">
            <p>NVH 로드노이즈 분석기 v1.0.0</p>
            <p className="text-slate-500">
              본 앱은 차량 NVH 개발을 위한 현장 분석 도구입니다.
            </p>
            <p className="text-slate-500">
              측정값은 참고용이며, 정밀 측정에는 교정된 측정 장비를 사용하세요.
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-sm text-slate-400 mb-2">PWA 설치 방법</h3>
          <div className="text-sm text-slate-300 space-y-1">
            <p>1. Safari로 이 페이지를 엽니다</p>
            <p>2. 하단 공유 버튼(⬆)을 탭합니다</p>
            <p>3. &quot;홈 화면에 추가&quot;를 선택합니다</p>
            <p>4. 홈 화면에서 앱처럼 실행됩니다</p>
          </div>
        </div>
      </div>
    </>
  )
}
