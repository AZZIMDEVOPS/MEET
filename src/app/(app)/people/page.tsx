'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search } from 'lucide-react'
import { ProfileCard } from '@/components/people/ProfileCard'
import { DEMO_PROFILES } from '@/lib/demo-data'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

const FILTER_INTERESTS = ['Technology', 'Photography', 'Music', 'Business', 'Fitness', 'Art', 'Travel', 'Gaming']

export default function PeoplePage() {
  const [selectedInterest, setSelectedInterest] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = DEMO_PROFILES.filter((profile) => {
    const matchesSearch = profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
      profile.username.toLowerCase().includes(search.toLowerCase()) ||
      (profile.bio ?? '').toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">People</h1>
          <p className="text-sm font-medium text-slate-600">Discover creators, professionals and adventurers near you</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
            className="meet-input pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Interest Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
        <button
          onClick={() => setSelectedInterest('All')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            selectedInterest === 'All'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
          }`}
        >
          All
        </button>
        {FILTER_INTERESTS.map((interest) => (
          <button
            key={interest}
            onClick={() => setSelectedInterest(interest)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedInterest === interest
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
          >
            <CategoryIcon name={interest} size={13} className={selectedInterest === interest ? 'text-white' : 'text-blue-600'} />
            {interest}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mb-6">
        <Users size={14} className="text-blue-600" />
        <span className="text-xs font-semibold text-slate-700">Showing {filtered.length} members in Nairobi</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((profile, i) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <ProfileCard
              profile={profile}
              interests={['Technology', 'Photography', 'Music', 'Travel', 'Design'].slice(i % 3, (i % 3) + 3)}
              mutualConnections={(i + 1) * 3}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
