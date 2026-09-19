'use client'

import Link from 'next/link'
import { Bell, Search } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { motion } from 'framer-motion'

interface TopBarProps {
  title?: string
  showSearch?: boolean
  notificationCount?: number
}

export function TopBar({ title, showSearch = true, notificationCount = 2 }: TopBarProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo or Title */}
        <Link href="/discover">
          {title ? (
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          ) : (
            <MeetLogo size="sm" />
          )}
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {showSearch && (
            <Link href="/explore">
              <motion.div
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <Search size={20} className="text-slate-600" />
              </motion.div>
            </Link>
          )}
          <Link href="/notifications">
            <motion.div
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={20} className="text-slate-600" />
              {notificationCount > 0 && (
                <span className="notif-dot" />
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  )
}
