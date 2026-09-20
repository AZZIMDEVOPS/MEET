'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'

interface SplashScreenProps {
  onFinish?: () => void
  duration?: number // ms
  showAppVersion?: boolean
}

export const APP_VERSION = 'v1.0.0 (MVP)'
export const APP_BUILD = '2026.1.0'

export function SplashScreen({
  onFinish,
  duration = 2400,
  showAppVersion = true,
}: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Top bar: Skip button */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>MEET Mobile</span>
        </div>

        <button
          onClick={() => onFinish?.()}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          <span>Skip to Feed</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Center Brand Identity (Without bg) */}
      <div className="flex flex-col items-center text-center max-w-sm px-4">
        {/* Animated Official Brand Logo without background */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <MeetLogo size="hero" align="center" showTagline />
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-3">
            Making Art Out Of Technology
          </p>
        </motion.div>

        {/* Smooth Loading Progress Line */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden border border-slate-200">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: duration / 1000, ease: 'easeInOut' }}
          />
        </div>

        <motion.p
          className="text-[11px] text-slate-500 mt-3 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading your visual feed...
        </motion.p>
      </div>

      {/* Footer: Version & ReGNL */}
      <motion.div
        className="flex flex-col items-center text-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <span>By</span>
          <span className="text-blue-600">ReGNL</span>
        </div>

        {showAppVersion && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-0.5 rounded-full">
              {APP_VERSION}
            </span>
            <span className="text-[10px] font-mono text-slate-600">
              Build {APP_BUILD}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
