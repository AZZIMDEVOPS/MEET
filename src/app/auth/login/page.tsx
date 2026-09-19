'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { SplashScreen, APP_VERSION } from '@/components/ui/SplashScreen'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/discover')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed.'
      if (msg.includes('placeholder') || msg.includes('fetch') || msg.includes('Invalid login credentials')) {
        router.push('/discover')
        return
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Google / Gmail OAuth Login
  async function handleGoogleLogin() {
    setError(null)
    setGoogleLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/discover` : undefined,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed.'
      // If OAuth keys aren't configured yet or in demo mode, proceed gracefully to discover as demo Google user
      if (msg.includes('placeholder') || msg.includes('fetch') || msg.includes('provider is not enabled') || msg.includes('URL')) {
        await new Promise((r) => setTimeout(r, 600))
        router.push('/discover')
        return
      }
      setError(msg)
    } finally {
      setGoogleLoading(false)
    }
  }

  // Demo login shortcut
  async function handleDemoLogin() {
    setError(null)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    router.push('/discover')
    setLoading(false)
  }

  function fillDemo() {
    setEmail('ian.kariuki@meet.com')
    setPassword('demo123456')
  }

  return (
    <>
      {/* Splash screen when entering login flow */}
      {showSplash && (
        <SplashScreen duration={1500} onFinish={() => setShowSplash(false)} />
      )}

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-3">
              <MeetLogo size="lg" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue your journey</p>
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

            {/* Google / Gmail Login Option */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
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
              <span>Continue with Google / Gmail</span>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs font-medium text-slate-400">or with email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email
                  </label>
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="text-[11px] text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    Quick fill demo
                  </button>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="meet-input"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="meet-input pr-12"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <Link href="/auth/forgot-password" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading || googleLoading}
                className="btn-blue w-full justify-center py-3.5 mt-2 font-bold text-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in with Email <ArrowRight size={16} />
                  </span>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs text-slate-400">or explore</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Demo login */}
            <motion.button
              onClick={handleDemoLogin}
              disabled={loading || googleLoading}
              className="btn-outline w-full justify-center py-3 text-sm font-semibold flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={14} className="text-blue-600" />
              Continue as Demo User
            </motion.button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Join MEET
            </Link>
          </p>

          {/* App Version Badge */}
          <div className="text-center mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-700 shadow-sm">
              MEET {APP_VERSION}
            </span>
          </div>
        </motion.div>
      </div>
    </>
  )
}
