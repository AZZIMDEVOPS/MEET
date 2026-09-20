'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MeetLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  showTagline?: boolean
  variant?: 'full' | 'icon'
  color?: string
  align?: 'start' | 'center' | 'end'
  className?: string
}

const sizeMap = {
  sm: {
    logo: 'text-xl',
    iconLogo: 'text-xl',
    tagline: 'text-[10px]',
    dot: 'w-2 h-2',
    dotMargin: 'ml-0.5 mb-1',
  },
  md: {
    logo: 'text-2xl',
    iconLogo: 'text-2xl',
    tagline: 'text-xs',
    dot: 'w-2.5 h-2.5',
    dotMargin: 'ml-0.5 mb-1',
  },
  lg: {
    logo: 'text-4xl',
    iconLogo: 'text-3xl',
    tagline: 'text-sm',
    dot: 'w-3.5 h-3.5',
    dotMargin: 'ml-1 mb-1.5',
  },
  xl: {
    logo: 'text-6xl',
    iconLogo: 'text-5xl',
    tagline: 'text-base',
    dot: 'w-4.5 h-4.5',
    dotMargin: 'ml-1.5 mb-2',
  },
  hero: {
    logo: 'text-6xl sm:text-7xl md:text-8xl lg:text-[112px]',
    iconLogo: 'text-6xl sm:text-7xl',
    tagline: 'text-base sm:text-lg md:text-xl',
    dot: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7',
    dotMargin: 'ml-1 sm:ml-2 md:ml-3 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4',
  },
}

export function MeetLogo({
  size = 'md',
  showTagline = false,
  variant = 'full',
  color = 'text-blue-600',
  align = 'start',
  className,
}: MeetLogoProps) {
  const sizes = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div className={cn('inline-flex items-center leading-none select-none', className)}>
        <span
          className={cn('font-black tracking-[-0.04em] leading-none', color, sizes.iconLogo)}
          style={{ letterSpacing: '-0.04em' }}
        >
          M
        </span>
        <motion.div
          className={cn(
            'bg-blue-600 rounded-full flex-shrink-0',
            sizes.dot,
            sizes.dotMargin
          )}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    )
  }

  const alignClasses = {
    start: 'items-start text-left',
    center: 'items-center text-center',
    end: 'items-end text-right',
  }[align]

  return (
    <div className={cn('flex flex-col gap-0.5', alignClasses, className)}>
      <div className="flex items-center gap-0.5 leading-none select-none">
        <span
          className={cn('font-black tracking-[-0.04em] leading-none', color, sizes.logo)}
          style={{ letterSpacing: '-0.04em' }}
        >
          MEET
        </span>
        <motion.div
          className={cn(
            'bg-blue-600 rounded-full flex-shrink-0',
            sizes.dot,
            sizes.dotMargin
          )}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      {showTagline && (
        <span
          className={cn(
            'text-blue-700 font-bold tracking-widest uppercase mt-0.5',
            sizes.tagline
          )}
        >
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
