export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
}

export function isIOSPWA(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    'standalone' in window.navigator &&
    (window.navigator as unknown as { standalone: boolean }).standalone === true
  )
}

export async function createAudioContext(
  sampleRate: number = 48000,
): Promise<AudioContext> {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  const ctx = new AudioCtx({
    sampleRate,
    latencyHint: 'interactive',
  })

  if (isIOS() && ctx.state === 'suspended') {
    const silentBuffer = ctx.createBuffer(1, 1, sampleRate)
    const source = ctx.createBufferSource()
    source.buffer = silentBuffer
    source.connect(ctx.destination)
    source.start(0)
    await ctx.resume()
  }

  return ctx
}

export async function requestMicrophone(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
      sampleRate: 48000,
    },
  })
}

export function setupVisibilityHandler(ctx: AudioContext): () => void {
  const handler = () => {
    if (
      document.visibilityState === 'visible' &&
      (ctx.state === 'suspended' || ctx.state === ('interrupted' as AudioContextState))
    ) {
      ctx.resume()
    }
  }
  document.addEventListener('visibilitychange', handler)
  return () => document.removeEventListener('visibilitychange', handler)
}
