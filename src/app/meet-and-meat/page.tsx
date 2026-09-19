'use client'

import { motion } from 'framer-motion'
import { Heart, MapPin, Shield, Flag, Ban, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { DEMO_PROFILES } from '@/lib/demo-data'

const ADULT_PROFILES = DEMO_PROFILES.map((p, i) => ({
  ...p,
  age: 24 + i * 2,
  distance: `${2 + i * 3}km away`,
  adult_interests: ['Travel', 'Music', 'Food', 'Art', 'Fitness'].slice(0, 3 + (i % 3)),
  adult_bio: `${p.bio} Looking for genuine connections and shared experiences.`,
}))

export default function MeetAndMeatPage() {
  const [liked, setLiked] = useState<string[]>([])
  const [passed, setPassed] = useState<string[]>([])

  const visibleProfiles = ADULT_PROFILES.filter(
    (p) => !liked.includes(p.id) && !passed.includes(p.id)
  )

  function handleLike() {
    const profile = visibleProfiles[0]
    if (!profile) return
    setLiked((prev) => [...prev, profile.id])
  }

  function handlePass() {
    const profile = visibleProfiles[0]
    if (!profile) return
    setPassed((prev) => [...prev, profile.id])
  }

  const profile = visibleProfiles[0]

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Discover</h1>
        <p className="text-sm text-blue-600 font-medium">Adults only • Respectful connections</p>
      </div>

      {/* Safety reminder */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 mb-6">
        <Shield size={14} className="text-blue-600 flex-shrink-0" />
        <p className="text-xs text-slate-600">Only profiles you explicitly connect with will see you. Your general MEET profile remains private.</p>
      </div>

      {profile ? (
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="rounded-3xl border border-slate-200 bg-white overflow-hidden mb-6 shadow-md"
        >
          {/* Photo area */}
          <div className="h-80 bg-slate-50 border-b border-slate-200 flex items-center justify-center relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black text-white">
                {profile.first_name[0]}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/95 border-t border-slate-200">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{profile.first_name}, {profile.age}</h2>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-blue-600" />
                    <span className="text-xs text-slate-600">{profile.distance}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors">
                    <Flag size={12} className="text-slate-500" />
                  </button>
                  <button className="p-1.5 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors">
                    <Ban size={12} className="text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile info */}
          <div className="p-5">
            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">{profile.adult_bio}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.adult_interests.map((interest) => (
                <span key={interest} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg font-bold text-slate-900 mb-2">You have seen everyone</p>
          <p className="text-sm">Check back later for new profiles near you.</p>
        </div>
      )}

      {/* Actions */}
      {profile && (
        <div className="flex items-center justify-center gap-8">
          <motion.button
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all duration-200 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          <motion.button
            onClick={() => {}}
            className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-all duration-200 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={18} />
          </motion.button>

          <motion.button
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-blue-600 border border-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={24} className="fill-white" />
          </motion.button>
        </div>
      )}

      {/* Matches count */}
      {liked.length > 0 && (
        <motion.div
          className="mt-6 text-center p-4 rounded-xl bg-blue-50 border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-blue-700 font-semibold flex items-center justify-center gap-1.5">
            <Heart size={14} className="fill-blue-600 text-blue-600" /> {liked.length} like{liked.length !== 1 ? 's' : ''} sent
          </p>
          <p className="text-xs text-slate-500 mt-1">You will be notified when they like you back.</p>
        </motion.div>
      )}
    </div>
  )
}
