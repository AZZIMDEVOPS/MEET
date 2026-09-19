'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Calendar, Compass, MapPin, ChevronRight, Activity } from 'lucide-react'
import { ProfileCard } from '@/components/people/ProfileCard'
import { EventCard } from '@/components/events/EventCard'
import { CommunityCard } from '@/components/communities/CommunityCard'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { DEMO_PROFILES, DEMO_EVENTS, DEMO_COMMUNITIES, DEMO_ACTIVITIES } from '@/lib/demo-data'

const INTERESTS = ['Technology', 'Photography', 'Music']

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
      >
        See all <ChevronRight size={14} />
      </Link>
    </div>
  )
}

export default function DiscoverPage() {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      {/* Greeting */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {greeting},{' '}
          <span className="text-blue-600 font-black">Ian.</span>
        </h1>
        <p className="text-sm font-medium text-slate-600 mt-1">
          Here is what is happening around you today in Nairobi.
        </p>
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div
        className="grid grid-cols-3 gap-3.5 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { icon: Users, label: 'People nearby', value: '2.4K' },
          { icon: Calendar, label: 'Events this week', value: '38' },
          { icon: Compass, label: 'Communities', value: '124' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="meet-card p-4 flex flex-col gap-1.5 shadow-sm border border-slate-200 bg-white">
            <Icon size={18} className="text-blue-600" />
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-600">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* MEET AI Prompt Banner */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Link href="/meet-ai">
          <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-5 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">MEET AI</p>
                <p className="text-xs font-medium text-slate-600">Your personal discovery guide</p>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-800 pl-0.5">
              &quot;Find photography events and creative meetups near Nairobi this weekend...&quot;
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-blue-600 text-xs font-bold">
              Ask MEET AI <ArrowRight size={13} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* People You May Want to Meet */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SectionHeader title="People you may want to meet" href="/people" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DEMO_PROFILES.slice(0, 4).map((profile, idx) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              interests={INTERESTS}
              mutualConnections={(idx + 2) * 3}
            />
          ))}
        </div>
      </motion.section>

      {/* Happening Near You */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <SectionHeader title="Happening near you" href="/events" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_EVENTS.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </motion.section>

      {/* Communities You Might Like */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <SectionHeader title="Communities you might like" href="/communities" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_COMMUNITIES.slice(0, 3).map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </motion.section>

      {/* Something To Do This Weekend */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <SectionHeader title="Something to do this weekend" href="/activities" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_ACTIVITIES.map((activity) => (
            <motion.div
              key={activity.id}
              className="meet-card p-4 cursor-pointer shadow-sm border border-slate-200 bg-white hover:border-blue-400"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <CategoryIcon name={activity.category} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{activity.title}</h3>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Activity size={12} className="text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700">{activity.participants_count} participants</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-slate-500" />
                    <span className="text-xs font-medium text-slate-600">{activity.city}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* More Events */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <SectionHeader title="Trending on MEET" href="/events" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_EVENTS.slice(3, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </motion.section>
    </div>
  )
}
