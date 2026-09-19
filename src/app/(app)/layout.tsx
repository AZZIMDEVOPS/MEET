import { AppShell } from '@/components/navigation/AppShell'
import { InstallAppPrompt } from '@/components/ui/InstallAppPrompt'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'MEET',
    template: '%s | MEET',
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      profile={{
        full_name: 'Ian Kariuki',
        username: 'ian.kariuki',
        avatar_url: '/avatars/ian.jpg',
      }}
    >
      {children}
      <InstallAppPrompt />
    </AppShell>
  )
}
