'use client'

import { Sidebar } from '@/components/navigation/Sidebar'
import { MobileNav } from '@/components/navigation/MobileNav'
import { TopBar } from '@/components/navigation/TopBar'

interface AppShellProps {
  children: React.ReactNode
  profile?: {
    full_name: string
    username: string
    avatar_url: string | null
  }
}

export function AppShell({ children, profile }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar profile={profile} />

      {/* Mobile Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-14 pb-20 lg:pt-0 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  )
}
