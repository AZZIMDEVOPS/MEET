'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, UserPlus, UserCheck, MessageCircle, BadgeCheck } from 'lucide-react'
import type { Profile } from '@/types'
import { formatNumber, getAvatarFallback } from '@/lib/utils'
import { useState } from 'react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

interface ProfileCardProps {
  profile: Profile
  interests?: string[]
  mutualConnections?: number
  compact?: boolean
}

export function ProfileCard({ profile, interests = [], mutualConnections = 0, compact = false }: ProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const displayInterests = interests.slice(0, 3)

  return (
    <motion.div
      className="meet-card p-4 flex flex-col gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href={`/people/${profile.username}`}>
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {getAvatarFallback(profile)}
              </div>
            )}
            {profile.is_verified && (
              <BadgeCheck size={14} className="absolute -bottom-0.5 -right-0.5 text-blue-600 bg-white rounded-full" />
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/people/${profile.username}`} className="hover:underline">
            <h3 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1">
              {profile.full_name}
            </h3>
          </Link>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">@{profile.username}</p>
          {profile.city && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={10} className="text-slate-500" />
              <span className="text-[11px] font-medium text-slate-700">{profile.city}, {profile.country}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-900 font-bold">{formatNumber(profile.followers_count)}</span>
          <span className="text-[11px] font-semibold text-slate-600">followers</span>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && !compact && (
        <p className="text-xs text-slate-800 leading-relaxed line-clamp-2 font-normal">{profile.bio}</p>
      )}

      {/* Interests */}
      {displayInterests.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {displayInterests.map((interest) => (
            <span
              key={interest}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 flex items-center gap-1 font-semibold"
            >
              <CategoryIcon name={interest} size={11} className="text-blue-600" />
              {interest}
            </span>
          ))}
        </div>
      )}

      {/* Mutual connections */}
      {mutualConnections > 0 && (
        <p className="text-[11px] font-semibold text-slate-600">
          {mutualConnections} mutual connection{mutualConnections !== 1 ? 's' : ''}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <motion.button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            isFollowing
              ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          whileTap={{ scale: 0.97 }}
        >
          {isFollowing ? (
            <><UserCheck size={12} /> Following</>
          ) : (
            <><UserPlus size={12} /> Connect</>
          )}
        </motion.button>

        <Link href={`/messages?user=${profile.username}`}>
          <motion.div
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200"
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={14} />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
