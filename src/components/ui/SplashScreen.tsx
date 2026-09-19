'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { ArrowRight } from 'lucide-react'

interface SplashScreenProps {
  onFinish?: () => void
  duration?: number // ms
  showAppVersion?: boolean
}

export const APP_VERSION = 'v1.0.0 (MVP)'
export const APP_BUILD = '2026.1.0'

export function SplashScreen({ onFinish, duration = 1600, showAppVersion = true }: SplashScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onFinish?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onFinish])

  function handleSkip() {
    setVisible(false)
    onFinish?.()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-between p-8 select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {/* Top spacer / Skip */}
          <div className="w-full flex justify-end">
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100"
            >
              Skip <ArrowRight size={13} />
            </button>
          </div>

          {/* Center Brand */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <MeetLogo size="lg" />
            </motion.div>

            <motion.p
              className="text-base font-semibold text-blue-600 mt-4 tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              People. Places. Experiences.
            </motion.p>

            <motion.p
              className="text-xs text-slate-600 mt-1 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Making Art Out Of Technology
            </motion.p>

            {/* Progress line */}
            <motion.div
              className="w-32 h-1.5 bg-slate-200 rounded-full mt-8 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          {/* Footer App Version & ReGNL */}
          <motion.div
            className="flex flex-col items-center text-center gap-1.5 text-slate-600 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-bold text-slate-800">By ReGNL</span>
            {showAppVersion && (
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
                MEET {APP_VERSION}
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
