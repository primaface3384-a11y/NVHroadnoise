import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: '차량 소음 분석기',
  description: '주행 중 발생하는 차량 소음을 실시간으로 분석하는 도구',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NVH 분석',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/NVHroadnoise/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-slate-950">
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
