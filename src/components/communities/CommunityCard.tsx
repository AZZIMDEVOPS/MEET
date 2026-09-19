'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Lock, Check } from 'lucide-react'
import type { Community } from '@/types'
import { formatNumber } from '@/lib/utils'
import { useState } from 'react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

interface CommunityCardProps {
  community: Community
}

export function CommunityCard({ community }: CommunityCardProps) {
  const [isMember, setIsMember] = useState(community.is_member ?? false)

  return (
    <motion.div
      className="meet-card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Cover */}
      <Link href={`/communities/${community.slug}`}>
        <div className="h-28 bg-slate-50 border-b border-slate-200 relative flex items-center justify-center">
          {community.cover_url ? (
            <img src={community.cover_url} alt={community.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <CategoryIcon name={community.category} size={24} />
            </div>
          )}
          {community.is_private && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 text-[10px] text-white">
              <Lock size={10} /> Private
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name + Category */}
        <div>
          <Link href={`/communities/${community.slug}`}>
            <h3 className="font-bold text-slate-900 text-sm leading-tight hover:text-blue-600 transition-colors">
              {community.name}
            </h3>
          </Link>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">{community.category}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
          {community.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-slate-600" />
            <span className="text-xs text-slate-700 font-semibold">{formatNumber(community.members_count)} members</span>
          </div>
          <span className="text-xs text-slate-700 font-semibold">{formatNumber(community.posts_count)} posts</span>
        </div>

        {/* Join Button */}
        <motion.button
          onClick={() => setIsMember(!isMember)}
          className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isMember
              ? 'bg-blue-100 border border-blue-300 text-blue-800 font-bold'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
          whileTap={{ scale: 0.97 }}
        >
          {isMember ? (
            <>
              <Check size={13} /> Member
            </>
          ) : (
            'Join Community'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export function CommunityCardSkeleton() {
  return (
    <div className="meet-card overflow-hidden">
      <div className="skeleton h-28 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-8 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-8 rounded-lg" />
      </div>
    </div>
  )
}
