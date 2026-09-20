'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SplashScreen } from '@/components/ui/SplashScreen'

export default function RootPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  function handleSplashFinish() {
    setShowSplash(false)
    router.replace('/feed')
  }

  return (
    <div className="min-h-screen bg-white">
      {showSplash && (
        <SplashScreen
          duration={2200}
          onFinish={handleSplashFinish}
        />
      )}
    </div>
  )
}
