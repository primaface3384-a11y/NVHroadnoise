export const UI = {
  appName: 'NVH 로드노이즈 분석기',
  appNameShort: 'NVH 분석',

  nav: {
    home: '홈',
    measure: '측정',
    recordings: '녹음',
    report: '리포트',
    settings: '설정',
  },

  measure: {
    startCapture: '측정 시작',
    stopCapture: '측정 중지',
    recording: '녹음 중',
    startRecording: '녹음 시작',
    stopRecording: '녹음 중지',
    overallSPL: '종합 소음 수준',
    spectrum: '주파수 스펙트럼',
    spectrogram: '스펙트로그램',
    octaveBand: '1/3 옥타브 밴드',
    categories: 'NVH 소음 분류',
  },

  recordings: {
    title: '녹음 목록',
    empty: '녹음된 데이터가 없습니다',
    delete: '삭제',
    play: '재생',
    stop: '정지',
    exportPDF: 'PDF 내보내기',
    duration: '시간',
    date: '날짜',
  },

  metadata: {
    vehicleModel: '차량 모델',
    tireSpec: '타이어 규격',
    speed: '주행 속도 (km/h)',
    roadSurface: '노면 종류',
    notes: '메모',
  },

  report: {
    title: 'NVH 로드노이즈 분석 리포트',
    overallLevel: '종합 소음 수준',
    overall: '종합',
    peak: '최대',
    leq: '등가소음',
    octaveAnalysis: '1/3 옥타브 밴드 분석',
    spectrumAnalysis: '주파수 스펙트럼',
    spectrogramAnalysis: '스펙트로그램',
    categoryAnalysis: 'NVH 소음 분류 결과',
    remarks: '소견',
    generate: 'PDF 생성',
    preview: '미리보기',
    category: '항목',
    level: '수준',
    frequency: '주파수',
    severity: '심각도',
  },

  settings: {
    title: '설정',
    calibration: '교정 오프셋 (dB)',
    fftSize: 'FFT 크기',
    windowFunction: '윈도우 함수',
    vehiclePreset: '차량 프리셋',
    about: '정보',
  },

  ios: {
    tapToStart: '탭하여 시작',
    micPermission: '마이크 권한이 필요합니다',
    installGuide: '홈 화면에 추가하여 앱처럼 사용하세요',
  },

  disclaimer: '본 측정값은 참고용이며, 정밀 측정에는 교정된 측정 마이크를 사용하세요.',
} as const
