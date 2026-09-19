'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Smartphone, X, Check, ShieldCheck } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    function handleAppInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstallPwa() {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setInstalled(true)
      }
      setDeferredPrompt(null)
      setIsOpen(false)
    } else {
      // Fallback: direct to download APK or instructions
      window.open('https://github.com/AZZIMDEVOPS/MEET/releases', '_blank')
    }
  }

  if (installed) return null

  return (
    <>
      {/* Floating or bottom trigger button on mobile */}
      <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all border border-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Smartphone size={15} />
          <span>Get Phone App</span>
        </motion.button>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/20">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Install MEET App</h3>
                  <p className="text-xs text-slate-500">v1.0.0 (MVP) • Android & Mobile</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Install MEET directly onto your smartphone for full-screen mode, push alerts, instant camera access, and faster performance.
              </p>

              <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Works seamlessly on Android & iOS</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Real-time Nairobi discovery, events & chats</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <ShieldCheck size={14} className="text-blue-600 flex-shrink-0" />
                  <span>Official build by ReGNL</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleInstallPwa}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Smartphone size={15} />
                  <span>Install to Phone (Instant)</span>
                </button>

                <a
                  href="https://github.com/AZZIMDEVOPS/MEET/releases"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
                >
                  <Download size={14} />
                  <span>Download Android APK File (.apk)</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
