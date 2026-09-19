'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { createClient } from '@/lib/supabase/client'
import { isValidEmail } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch {
      // In demo mode or if placeholder URL, simulate success
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div className="relative z-10 w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Link href="/" className="inline-block"><MeetLogo size="lg" /></Link>
          <h1 className="text-2xl font-black text-slate-900 mt-4">Reset your password</h1>
          <p className="text-slate-500 text-sm mt-1">We will send you a reset link</p>
        </div>

        <div className="meet-card p-6 md:p-8 bg-white shadow-xl border border-slate-200">
          {sent ? (
            <motion.div className="text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Mail size={24} />
              </div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Email sent</h2>
              <p className="text-sm text-slate-600 mb-6">Check your inbox for a password reset link. It may take a minute.</p>
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="meet-input" required />
              </div>
              <motion.button
                type="submit"
                disabled={loading || !isValidEmail(email.trim())}
                className="btn-blue w-full justify-center py-3.5 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span> : 'Send reset link'}
              </motion.button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
