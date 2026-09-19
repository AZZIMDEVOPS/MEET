'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Camera, MapPin, Check, X, Users, Globe, Calendar, Briefcase, Activity, Sparkles, Heart } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [lookingFor, setLookingFor] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

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

  async function handleFinish() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    router.push('/discover')
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100

  const steps = [
    // Step 0: What's your name?
    <motion.div key="step0" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">What is your name?</h2>
        <p className="text-slate-500 text-sm">Let us start with the basics.</p>
      </div>
      <div className="space-y-3">
        <input className="meet-input" placeholder="First name" defaultValue="Ian" />
        <input className="meet-input" placeholder="Last name" defaultValue="Kariuki" />
      </div>
    </motion.div>,

    // Step 1: Username
    <motion.div key="step1" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Choose your username</h2>
        <p className="text-slate-500 text-sm">This is how people will find you on MEET.</p>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">@</span>
        <input className="meet-input pl-8" placeholder="yourname" defaultValue="ian.kariuki" />
      </div>
      <p className="text-xs text-slate-400">Letters, numbers and underscores only. Min. 3 characters.</p>
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
          <img src="/avatars/ian.jpg" alt="Ian Kariuki" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center">
            <Camera size={24} className="text-white drop-shadow" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg font-bold">+</span>
          </div>
        </motion.div>
        <p className="text-sm font-semibold text-slate-700">Photo set as Ian Kariuki</p>
        <button className="text-xs text-blue-600 font-semibold hover:underline">Change photo</button>
      </div>
    </motion.div>,

    // Step 3: Bio
    <motion.div key="step3" className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Tell us about yourself</h2>
        <p className="text-slate-500 text-sm">A short bio helps people understand who you are.</p>
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
        <p className="text-xs text-slate-400 text-right mt-1">{bio.length}/200</p>
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
      {selectedInterests.length > 0 && (
        <p className="text-xs text-blue-600 font-semibold">{selectedInterests.length} selected</p>
      )}
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
      <p className="text-xs text-slate-400">We only store your city, not your exact street address.</p>
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
        <button onClick={() => router.push('/discover')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
          <X size={14} /> Skip
        </button>
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

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8">
            {step > 0 && (
              <motion.button
                onClick={() => setStep((s) => s - 1)}
                className="btn-outline px-5 py-3 font-semibold text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>
            )}

            <motion.button
              onClick={step === TOTAL_STEPS - 1 ? handleFinish : () => setStep((s) => s + 1)}
              disabled={loading || (step === 4 && selectedInterests.length < 3)}
              className="btn-blue flex-1 justify-center py-3.5 font-bold text-sm"
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

          {step === 4 && selectedInterests.length < 3 && (
            <p className="text-center text-xs text-slate-400 mt-3">Select at least 3 interests to continue</p>
          )}
        </div>
      </div>
    </div>
  )
}
