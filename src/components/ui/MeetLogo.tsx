'use client'

import { motion } from 'framer-motion'

interface MeetLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  variant?: 'full' | 'icon'
  color?: string
}

const sizeMap = {
  sm: { logo: 'text-xl', tagline: 'text-[10px]', dot: 'w-2 h-2' },
  md: { logo: 'text-2xl', tagline: 'text-xs', dot: 'w-2.5 h-2.5' },
  lg: { logo: 'text-4xl', tagline: 'text-sm', dot: 'w-3 h-3' },
  xl: { logo: 'text-6xl', tagline: 'text-base', dot: 'w-4 h-4' },
}

export function MeetLogo({ size = 'md', showTagline = false, variant = 'full', color = 'text-blue-600' }: MeetLogoProps) {
  const sizes = sizeMap[size]

  return (
    <div className="flex flex-col items-start gap-0.5">
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
      {showTagline && (
        <span className={`${sizes.tagline} text-blue-700 font-bold tracking-widest uppercase`}>
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
