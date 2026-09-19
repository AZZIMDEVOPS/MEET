'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shield, AlertTriangle, Check, ArrowRight, X } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'

export default function MeetAndMeatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [verified, setVerified] = useState(false)
  const [dob, setDob] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [safetyAgreed, setSafetyAgreed] = useState(false)
  const [error, setError] = useState('')

  function handleVerify() {
    setError('')
    if (!dob) { setError('Please enter your date of birth.'); return }
    const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    if (age < 18) { setError('You must be 18 or older to access MEET & MEAT.'); return }
    if (!agreed || !safetyAgreed) { setError('Please accept both acknowledgements.'); return }
    setVerified(true)
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <MeetLogo size="md" />
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold">
                MEET & MEAT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                18+ Only
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-xl">
            {/* Warning */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">Adults Only</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  MEET & MEAT is an adult section containing content and interactions for users 18 and older. By entering you confirm you are of legal age.
                </p>
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="meet-input"
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>

            {/* Agreements */}
            <div className="space-y-3">
              {[
                { state: agreed, setState: setAgreed, label: 'I confirm I am 18 years or older and consent to entering adult content.' },
                { state: safetyAgreed, setState: setSafetyAgreed, label: 'I understand MEET & MEAT safety guidelines and agree to treat all users with respect.' },
              ].map(({ state, setState, label }, i) => (
                <button
                  key={i}
                  onClick={() => setState(!state)}
                  className="w-full flex items-start gap-3 text-left"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all duration-200 ${state ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                    {state && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">{label}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Safety note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Shield size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                MEET & MEAT is completely isolated from the main MEET experience. Your adult profile and activity will never appear in general discovery, communities or public search.
              </p>
            </div>

            <motion.button
              onClick={handleVerify}
              className="btn-blue w-full py-3.5 rounded-xl font-bold text-sm"
              whileTap={{ scale: 0.98 }}
            >
              Enter MEET & MEAT <ArrowRight size={16} />
            </motion.button>

            <button
              onClick={() => router.push('/discover')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={12} className="inline mr-1" /> Return to MEET
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Adult section header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MeetLogo size="sm" />
            <span className="text-blue-600 text-sm font-bold">& MEAT</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase">18+</span>
          </div>
          <button onClick={() => router.push('/discover')} className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
            <X size={14} /> Exit
          </button>
        </div>
      </header>
      <div className="pt-14">{children}</div>
    </div>
  )
}
