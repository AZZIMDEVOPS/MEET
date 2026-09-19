import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MEET — People. Places. Experiences.',
    template: '%s | MEET',
  },
  description:
    'MEET is a next-generation social discovery platform. Discover people worth knowing, places worth exploring and experiences worth sharing. By ReGNL.',
  keywords: ['social', 'discovery', 'events', 'communities', 'people', 'experiences', 'Nairobi'],
  authors: [{ name: 'ReGNL', url: 'https://regnl.com' }],
  creator: 'ReGNL',
  openGraph: {
    type: 'website',
    title: 'MEET — People. Places. Experiences.',
    description: 'Discover people worth knowing, places worth exploring and experiences worth sharing.',
    siteName: 'MEET',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEET — People. Places. Experiences.',
    description: 'Discover people worth knowing, places worth exploring and experiences worth sharing.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MEET',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563EB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
