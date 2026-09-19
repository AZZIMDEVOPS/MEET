'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Camera, MapPin, Check, Users, Globe, Calendar, Briefcase, Activity, Sparkles, Heart } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { createClient } from '@/lib/supabase/client'

const INTERESTS = [
  'Technology', 'Photography', 'Music', 'Business', 'Entrepreneurship',
  'Fitness', 'Travel', 'Food', 'Gaming', 'Sports', 'Fashion', 'Art',
  'Design', 'Education', 'Finance', 'Film', 'Cars', 'Nature', 'Books', 'Wellness',
]

const LOOKING_FOR = [
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'communities', label: 'Communities', icon: Globe },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'professional', label: 'Professional connections', icon: Briefcase },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'experiences', label: 'Experiences', icon: Sparkles },
  { id: 'dating', label: 'Dating', icon: Heart },
]

const TOTAL_STEPS = 7

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [firstName, setFirstName] = useState('Ian')
  const [lastName, setLastName] = useState('Kariuki')
  const [username, setUsername] = useState('ian.kariuki')
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Photography', 'Business'])
  const [lookingFor, setLookingFor] = useState<string[]>(['friends', 'communities'])
  const [bio, setBio] = useState('Product designer and explorer based in Nairobi. Passionate about technology, art, and vibrant local experiences.')
  const [city, setCity] = useState('Nairobi, Kenya')
  const [loading, setLoading] = useState(false)

  // Prefill user details if authenticated
  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const meta = user.user_metadata || {}
          if (meta.first_name) setFirstName(meta.first_name)
          if (meta.last_name) setLastName(meta.last_name)
          if (meta.username) setUsername(meta.username)
        }
      } catch {
        // Fallback for offline or demo testing
      }
    }
    loadUser()
  }, [])

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  function toggleLookingFor(id: string) {
    setLookingFor((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function getStepValidation(stepIdx: number): { valid: boolean; hint?: string } {
    switch (stepIdx) {
      case 0:
        if (firstName.trim().length < 2) return { valid: false, hint: 'First name must be at least 2 characters.' }
        if (lastName.trim().length < 2) return { valid: false, hint: 'Last name must be at least 2 characters.' }
        return { valid: true }
      case 1:
        if (username.trim().length < 3) return { valid: false, hint: 'Username must be at least 3 characters.' }
        if (!/^[a-zA-Z0-9._]+$/.test(username.trim())) return { valid: false, hint: 'Username can only contain letters, numbers, dots, and underscores.' }
        return { valid: true }
      case 2:
        return { valid: true }
      case 3:
        if (bio.trim().length < 10) return { valid: false, hint: `Bio must be at least 10 characters (${bio.trim().length}/10 entered).` }
        return { valid: true }
      case 4:
        if (selectedInterests.length < 3) return { valid: false, hint: `Select at least 3 interests (${selectedInterests.length}/3 selected).` }
        return { valid: true }
      case 5:
        if (city.trim().length < 2) return { valid: false, hint: 'Please specify your city or location.' }
        return { valid: true }
      case 6:
        if (lookingFor.length < 1) return { valid: false, hint: 'Please select at least 1 goal to complete onboarding.' }
        return { valid: true }
      default:
        return { valid: true }
    }
  }

  const currentStepValidation = getStepValidation(step)

  async function handleFinish() {
    if (!currentStepValidation.valid) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fullName = `${firstName.trim()} ${lastName.trim()}`
        await supabase.from('profiles').upsert({
          id: user.id,
          username: username.trim().toLowerCase(),
          full_name: fullName,
          bio: bio.trim(),
          city: city.trim(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (e) {
      console.warn('Profile sync error:', e)
    } finally {
      await new Promise((r) => setTimeout(r, 600))
      router.push('/discover')
    }
  }

  function handleNext() {
    if (!currentStepValidation.valid) return
    if (step === TOTAL_STEPS - 1) {
      handleFinish()
    } else {
      setStep((s) => s + 1)
    }
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100

  const steps = [
    // Step 0: What's your name?
    <motion.div key="step0" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">What is your name?</h2>
        <p className="text-slate-500 text-sm">Please provide your real first and last name to verify your identity on MEET.</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">First Name</label>
          <input
            className="meet-input"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Last Name</label>
          <input
            className="meet-input"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
    </motion.div>,

    // Step 1: Username
    <motion.div key="step1" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Choose your username</h2>
        <p className="text-slate-500 text-sm">This is how people will find and tag you across MEET.</p>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
        <input
          className="meet-input pl-8"
          placeholder="yourname"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
        />
      </div>
      <p className="text-xs text-slate-500 font-medium">Letters, numbers, dots and underscores only. Min. 3 characters.</p>
    </motion.div>,

    // Step 2: Profile picture
    <motion.div key="step2" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Add a profile picture</h2>
        <p className="text-slate-500 text-sm">A photo helps members recognize and connect with you.</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-28 h-28 rounded-full overflow-hidden relative cursor-pointer ring-4 ring-blue-600 shadow-xl shadow-blue-600/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/avatars/ian.jpg" alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center">
            <Camera size={24} className="text-white drop-shadow" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg font-bold">+</span>
          </div>
        </motion.div>
        <p className="text-sm font-semibold text-slate-700">Photo verified for {firstName} {lastName}</p>
        <button className="text-xs text-blue-600 font-semibold hover:underline">Change photo</button>
      </div>
    </motion.div>,

    // Step 3: Bio
    <motion.div key="step3" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Tell us about yourself</h2>
        <p className="text-slate-500 text-sm">A short bio helps members understand who you are and what you do.</p>
      </div>
      <div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="I am a designer and developer based in Nairobi who loves exploring new places and meeting interesting people..."
          rows={4}
          maxLength={200}
          className="meet-input resize-none"
        />
        <div className="flex justify-between items-center text-xs mt-1.5">
          <span className={bio.trim().length < 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-semibold'}>
            {bio.trim().length < 10 ? `Minimum 10 characters required (${bio.trim().length}/10)` : 'Bio meets requirements'}
          </span>
          <span className="text-slate-400">{bio.length}/200</span>
        </div>
      </div>
    </motion.div>,

    // Step 4: Interests
    <motion.div key="step4" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">What are you into?</h2>
        <p className="text-slate-500 text-sm">Select your interests to find relevant events and communities. Pick at least 3.</p>
      </div>
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto scrollbar-none">
        {INTERESTS.map((interest) => {
          const selected = selectedInterests.includes(interest)
          return (
            <motion.button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all duration-200 ${
                selected
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-slate-100'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <CategoryIcon name={interest} size={14} className={selected ? 'text-blue-600' : 'text-slate-400'} />
              {interest}
              {selected && <Check size={12} className="text-blue-600 ml-1" />}
            </motion.button>
          )
        })}
      </div>
      <div className="flex items-center justify-between text-xs pt-1">
        <span className={selectedInterests.length >= 3 ? 'text-blue-600 font-semibold' : 'text-amber-600 font-medium'}>
          {selectedInterests.length} selected (minimum 3 required)
        </span>
      </div>
    </motion.div>,

    // Step 5: Location
    <motion.div key="step5" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Where are you located?</h2>
        <p className="text-slate-500 text-sm">We will use your city to show you nearby people, events and places.</p>
      </div>
      <div>
        <div className="relative">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="meet-input pl-10"
            placeholder="e.g. Nairobi, Kenya"
          />
        </div>
      </div>
      <p className="text-xs text-slate-500">We only store your general city or region, never your exact street address.</p>
    </motion.div>,

    // Step 6: Looking for
    <motion.div key="step6" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">What are you looking for?</h2>
        <p className="text-slate-500 text-sm">Select all that apply to tailor your recommendations.</p>
      </div>
      <div className="space-y-2">
        {LOOKING_FOR.map(({ id, label, icon: Icon }) => {
          const selected = lookingFor.includes(id)
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => toggleLookingFor(id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 text-left ${
                selected
                  ? 'border-blue-600 bg-blue-50 text-slate-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600'}`}>
                <Icon size={16} />
              </div>
              <span className="flex-1">{label}</span>
              {selected && <Check size={16} className="text-blue-600" />}
            </motion.button>
          )
        })}
      </div>
    </motion.div>,
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
        <MeetLogo size="sm" />
        <span className="text-xs font-semibold text-slate-500">
          Account Setup
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <p className="text-xs text-slate-500 mb-6 font-semibold">Step {step + 1} of {TOTAL_STEPS}</p>

          <AnimatePresence mode="wait">
            {steps[step]}
          </AnimatePresence>

          {/* Validation Feedback Warning if Incomplete */}
          {!currentStepValidation.valid && currentStepValidation.hint && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <span>{currentStepValidation.hint}</span>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <motion.button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-outline px-5 py-3 font-semibold text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={handleNext}
              disabled={loading || !currentStepValidation.valid}
              className="btn-blue flex-1 justify-center py-3.5 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finishing setup...
                </span>
              ) : step === TOTAL_STEPS - 1 ? (
                <span className="flex items-center gap-2">Start using MEET <ArrowRight size={16} /></span>
              ) : (
                <span className="flex items-center gap-2">Continue <ArrowRight size={16} /></span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
