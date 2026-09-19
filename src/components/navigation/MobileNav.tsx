'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileNavItems = [
  { href: '/discover', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/create', label: 'Create', icon: Plus, isCreate: true },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="flex items-center justify-around px-4 py-3 pb-safe">
        {mobileNavItems.map(({ href, label, icon: Icon, isCreate }) => {
          const isActive = pathname === href || (pathname.startsWith(href + '/') && href !== '/')
          return (
            <Link key={href} href={href}>
              <motion.div
                className="flex flex-col items-center gap-1"
                whileTap={{ scale: 0.9 }}
              >
                {isCreate ? (
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                    <Icon size={20} className="text-white" />
                  </div>
                ) : (
                  <>
                    <div className={cn(
                      'w-6 h-6 flex items-center justify-center transition-colors',
                      isActive ? 'text-blue-600' : 'text-slate-600'
                    )}>
                      <Icon size={22} />
                    </div>
                    <span className={cn(
                      'text-[10px] transition-colors',
                      isActive ? 'text-blue-600 font-bold' : 'text-slate-600 font-semibold'
                    )}>
                      {label}
                    </span>
                  </>
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
