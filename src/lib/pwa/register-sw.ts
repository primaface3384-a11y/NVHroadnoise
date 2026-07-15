export async function registerServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' })
  } catch {
    // SW registration failed
  }
}
