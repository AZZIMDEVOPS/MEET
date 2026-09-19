'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Compass,
  Search,
  Users,
  Calendar,
  MessageCircle,
  Bell,
  Plus,
  Settings,
  Sparkles,
  Home,
  Radio,
} from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feed', label: 'Feed', icon: Radio },
  { href: '/discover', label: 'Discover', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/people', label: 'People', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/communities', label: 'Communities', icon: Compass },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
]

const secondaryItems = [
  { href: '/meet-ai', label: 'MEET AI', icon: Sparkles },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/create', label: 'Create', icon: Plus },
]

interface SidebarProps {
  profile?: {
    full_name: string
    username: string
    avatar_url: string | null
  }
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-40 px-4 py-6">
      {/* Logo */}
      <Link href="/discover" className="px-2 mb-8">
        <MeetLogo size="md" color="text-blue-600" showTagline={false} />
      </Link>

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}>
              <motion.div
                className={cn('sidebar-item', isActive && 'active')}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-white' : 'text-slate-700'}
                />
                <span className="font-semibold">{label}</span>
                {label === 'Messages' && (
                  <span className={cn(
                    'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  )}>
                    3
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-slate-200" />

        {/* Secondary Items */}
        {secondaryItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href}>
              <motion.div
                className={cn('sidebar-item', isActive && 'active')}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <Icon
                  size={18}
                  className={cn(
                    isActive ? 'text-white' : 'text-slate-700',
                    !isActive && label === 'MEET AI' && 'text-blue-600',
                    !isActive && label === 'Create' && 'text-blue-600',
                  )}
                />
                <span
                  className={cn(
                    'font-semibold',
                    !isActive && label === 'MEET AI' && 'text-blue-600 font-bold',
                    !isActive && label === 'Create' && 'text-blue-600 font-bold',
                  )}
                >
                  {label}
                </span>
                {label === 'Notifications' && (
                  <span className={cn(
                    'ml-auto w-2 h-2 rounded-full',
                    isActive ? 'bg-white' : 'bg-blue-600'
                  )} />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom — User Profile */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200">
          <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                {profile?.full_name?.[0] ?? 'M'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {profile?.full_name ?? 'Your Name'}
              </p>
              <p className="text-xs font-semibold text-slate-500 truncate">
                @{profile?.username ?? 'yourname'}
              </p>
            </div>
          </Link>
          <Link href="/profile" title="Profile & Settings">
            <Settings size={16} className="text-slate-500 hover:text-slate-800 transition-colors" />
          </Link>
        </div>
        <div className="flex items-center justify-between px-3 pt-2 text-[11px] text-slate-700 font-mono font-bold">
          <span>MEET v1.0.0 (MVP)</span>
          <span>By ReGNL</span>
        </div>
      </div>
    </aside>
  )
}
