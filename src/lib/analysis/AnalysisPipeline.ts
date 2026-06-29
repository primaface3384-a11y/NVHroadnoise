import { computeFFT } from '@/lib/dsp/fft'
import { createWindow, type WindowType } from '@/lib/dsp/windowing'
import { computeThirdOctaveBands } from '@/lib/dsp/octave-band'
import { computeAWeightingTable } from '@/lib/dsp/a-weighting'
import { computeOverallSPL, computeWeightedSPL, computePeakLevel } from '@/lib/dsp/spl-calculator'
import { classifyNoise } from '@/lib/dsp/noise-classifier'
import { SpectrogramBuffer } from './SpectrogramBuffer'
import type { AnalysisResult, OctaveBandResult } from '@/types/analysis'
import type { NVHCategoryResult } from '@/types/nvh'

export class AnalysisPipeline {
  private window: Float64Array
  private aWeightingTable: Float64Array
  private sampleRate: number
  private fftSize: number
  private spectrogramBuffer: SpectrogramBuffer
  private calibrationOffset: number = 0

  private latestResult: AnalysisResult | null = null
  private peakTracker: number = -120
  private leqAccumulator: number[] = []

  constructor(
    fftSize: number = 4096,
    sampleRate: number = 48000,
    windowType: WindowType = 'hann',
  ) {
    this.fftSize = fftSize
    this.sampleRate = sampleRate
    this.window = createWindow(windowType, fftSize)
    this.aWeightingTable = computeAWeightingTable(fftSize, sampleRate)
    this.spectrogramBuffer = new SpectrogramBuffer(200)
  }

  setCalibrationOffset(offset: number): void {
    this.calibrationOffset = offset
  }

  process(samples: Float32Array): AnalysisResult {
    const spectrum = computeFFT(samples, this.window)

    for (let i = 0; i < spectrum.length; i++) {
      spectrum[i] += this.calibrationOffset
    }

    const spectrumF32 = new Float32Array(spectrum.length)
    for (let i = 0; i < spectrum.length; i++) {
      spectrumF32[i] = spectrum[i]
    }

    this.spectrogramBuffer.push(spectrumF32)

    const overallSPL = computeOverallSPL(spectrum) + this.calibrationOffset
    const overallSPL_A = computeWeightedSPL(spectrum, this.aWeightingTable) + this.calibrationOffset
    const peakSPL = computePeakLevel(samples) + this.calibrationOffset

    if (peakSPL > this.peakTracker) this.peakTracker = peakSPL
    this.leqAccumulator.push(Math.pow(10, overallSPL_A / 10))

    const octaveBands: OctaveBandResult[] = computeThirdOctaveBands(
      spectrum,
      this.sampleRate,
      this.fftSize,
    )

    const categories: NVHCategoryResult[] = classifyNoise(
      octaveBands,
      overallSPL_A,
      spectrum,
      this.sampleRate,
      this.fftSize,
    )

    this.latestResult = {
      overallSPL,
      overallSPL_A,
      peakSPL,
      spectrum: spectrumF32,
      octaveBands,
      categories,
      timestamp: Date.now(),
    }

    return this.latestResult
  }

  processFromAnalyser(analyser: AnalyserNode): AnalysisResult | null {
    const freqData = new Float32Array(analyser.frequencyBinCount)
    analyser.getFloatFrequencyData(freqData)

    for (let i = 0; i < freqData.length; i++) {
      freqData[i] += this.calibrationOffset
    }

    this.spectrogramBuffer.push(freqData)

    const overallSPL = computeOverallSPL(freqData)
    const overallSPL_A = computeWeightedSPL(freqData, this.aWeightingTable)

    const timeDomain = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(timeDomain)
    const peakSPL = computePeakLevel(timeDomain)

    if (peakSPL > this.peakTracker) this.peakTracker = peakSPL
    this.leqAccumulator.push(Math.pow(10, overallSPL_A / 10))

    const octaveBands = computeThirdOctaveBands(
      freqData,
      this.sampleRate,
      this.fftSize,
    )

    const categories = classifyNoise(
      octaveBands,
      overallSPL_A,
      freqData,
      this.sampleRate,
      this.fftSize,
    )

    this.latestResult = {
      overallSPL,
      overallSPL_A,
      peakSPL,
      spectrum: freqData,
      octaveBands,
      categories,
      timestamp: Date.now(),
    }

    return this.latestResult
  }

  getSpectrogramBuffer(): SpectrogramBuffer {
    return this.spectrogramBuffer
  }

  getLatestResult(): AnalysisResult | null {
    return this.latestResult
  }

  getPeakSPL(): number {
    return this.peakTracker
  }

  getLeq(): number {
    if (this.leqAccumulator.length === 0) return -120
    const avg =
      this.leqAccumulator.reduce((a, b) => a + b, 0) /
      this.leqAccumulator.length
    return 10 * Math.log10(avg + 1e-30)
  }

  reset(): void {
    this.peakTracker = -120
    this.leqAccumulator = []
    this.latestResult = null
    this.spectrogramBuffer = new SpectrogramBuffer(200)
  }
}
