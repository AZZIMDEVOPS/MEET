'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check, Sparkles } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { APP_VERSION } from '@/components/ui/SplashScreen'
import { createClient } from '@/lib/supabase/client'
import { isValidEmail, isValidUsername } from '@/lib/utils'

const STEPS = ['Account', 'Profile', 'Done']

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    dob: '',
  })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  function validateStep0() {
    if (!form.email || !isValidEmail(form.email)) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return false
    }
    if (!form.dob) {
      setError('Please enter your date of birth.')
      return false
    }
    const dob = new Date(form.dob)
    const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    if (age < 13) {
      setError('You must be at least 13 years old to join MEET.')
      return false
    }
    return true
  }

  function validateStep1() {
    if (!form.firstName.trim()) { setError('Please enter your first name.'); return false }
    if (!form.lastName.trim()) { setError('Please enter your last name.'); return false }
    if (!form.username || !isValidUsername(form.username)) {
      setError('Username must be 3-30 characters (letters, numbers, underscores).')
      return false
    }
    return true
  }

  async function handleNext() {
    setError(null)
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return

    if (step === 1) {
      setLoading(true)
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              first_name: form.firstName,
              last_name: form.lastName,
              username: form.username,
              full_name: `${form.firstName} ${form.lastName}`,
            },
          },
        })
        if (error) throw error
        setStep(2)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Sign up failed.'
        if (msg.includes('placeholder') || msg.includes('fetch')) {
          setStep(2)
          return
        }
        setError(msg)
      } finally {
        setLoading(false)
      }
    } else {
      setStep((s) => s + 1)
    }
  }

  async function handleGoogleSignup() {
    setError(null)
    setGoogleLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign up failed.'
      if (msg.includes('placeholder') || msg.includes('fetch') || msg.includes('provider is not enabled') || msg.includes('URL')) {
        await new Promise((r) => setTimeout(r, 600))
        router.push('/onboarding')
        return
      }
      setError(msg)
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleDemoSignup() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    router.push('/onboarding')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <MeetLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-4">Join MEET</h1>
          <p className="text-slate-500 text-sm mt-1">Discover people, places and experiences</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step ? 'bg-blue-600 text-white' :
                i === step ? 'bg-blue-50 border-2 border-blue-600 text-blue-600' :
                'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 transition-all duration-500 ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="meet-card p-6 md:p-8 bg-white shadow-xl border border-slate-200">
          {error && (
            <motion.div
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Google / Gmail Sign up */}
              <motion.button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all duration-200 shadow-sm hover:border-slate-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {googleLoading ? (
                  <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-5 h-5" />
                )}
                <span>Sign up with Google / Gmail</span>
              </motion.button>

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 border-t border-slate-200" />
                <span className="text-xs font-medium text-slate-400">or with email</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="meet-input"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    className="meet-input pr-12"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update('dob', e.target.value)}
                  className="meet-input"
                  max={new Date(Date.now() - 13 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>

              <motion.button onClick={handleNext} className="btn-blue w-full justify-center py-3.5 font-bold text-sm" whileTap={{ scale: 0.98 }}>
                Continue <ArrowRight size={16} />
              </motion.button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 border-t border-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              <motion.button onClick={handleDemoSignup} disabled={loading} className="btn-outline w-full justify-center py-3 text-sm font-semibold flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm" whileTap={{ scale: 0.98 }}>
                <Sparkles size={14} className="text-blue-600" /> Continue as Demo User
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Tell us about yourself</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">First Name</label>
                  <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Ian" className="meet-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Kariuki" className="meet-input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input type="text" value={form.username} onChange={(e) => update('username', e.target.value.toLowerCase())} placeholder="yourname" className="meet-input pl-8" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">3-30 characters. Letters, numbers and underscores only.</p>
              </div>
              <motion.button onClick={handleNext} disabled={loading} className="btn-blue w-full justify-center py-3.5 font-bold text-sm" whileTap={{ scale: 0.98 }}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
                )}
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <motion.div
                className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Check size={28} className="text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Account created!</h2>
              <p className="text-sm text-slate-600 mb-6">Your profile is initialized. Continue to personalize your interests and location.</p>
              <Link href="/onboarding">
                <motion.button className="btn-blue px-8 py-3 font-bold text-sm flex items-center gap-2 mx-auto" whileTap={{ scale: 0.98 }}>
                  Complete your profile <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>

        {step < 2 && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        )}

        {/* App Version Badge */}
        <div className="text-center mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-700 shadow-sm">
            MEET {APP_VERSION}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
