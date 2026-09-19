'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface MeetLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  variant?: 'full' | 'icon'
  color?: string
  withIcon?: boolean
}

const sizeMap = {
  sm: { logo: 'text-xl', tagline: 'text-[10px]', dot: 'w-2 h-2', iconSize: 22, iconClass: 'w-5 h-5 rounded-md' },
  md: { logo: 'text-2xl', tagline: 'text-xs', dot: 'w-2.5 h-2.5', iconSize: 28, iconClass: 'w-7 h-7 rounded-lg' },
  lg: { logo: 'text-4xl', tagline: 'text-sm', dot: 'w-3 h-3', iconSize: 42, iconClass: 'w-10 h-10 rounded-xl' },
  xl: { logo: 'text-6xl', tagline: 'text-base', dot: 'w-4 h-4', iconSize: 64, iconClass: 'w-16 h-16 rounded-2xl' },
}

export function MeetLogo({
  size = 'md',
  showTagline = false,
  variant = 'full',
  color = 'text-blue-600',
  withIcon = true,
}: MeetLogoProps) {
  const sizes = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div className={`relative ${sizes.iconClass} overflow-hidden shadow-sm border border-slate-200 bg-slate-900 flex-shrink-0`}>
        <Image
          src="/meet-logo.jpg"
          alt="MEET"
          width={sizes.iconSize}
          height={sizes.iconSize}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="flex items-center gap-2">
        {withIcon && (
          <div className={`relative ${sizes.iconClass} overflow-hidden shadow-sm border border-slate-200 bg-slate-900 flex-shrink-0`}>
            <Image
              src="/meet-logo.jpg"
              alt="MEET"
              width={sizes.iconSize}
              height={sizes.iconSize}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-0.5">
          <span
            className={`font-black tracking-[-0.04em] ${color} ${sizes.logo}`}
            style={{ letterSpacing: '-0.04em' }}
          >
            MEET
          </span>
          <motion.div
            className={`${sizes.dot} bg-blue-600 rounded-full ml-0.5 mb-1 flex-shrink-0`}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
      {showTagline && (
        <span className={`${sizes.tagline} text-blue-700 font-bold tracking-widest uppercase mt-0.5`}>
          People. Places. Experiences.
        </span>
      )}
    </div>
  )
}

export function MeetWordmark() {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">by</span>
      <span className="text-sm font-bold text-blue-600">ReGNL</span>
    </div>
  )
}
