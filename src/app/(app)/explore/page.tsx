'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Users, Calendar, Compass, MapPin, Activity, Star } from 'lucide-react'
import { ProfileCard } from '@/components/people/ProfileCard'
import { EventCard } from '@/components/events/EventCard'
import { CommunityCard } from '@/components/communities/CommunityCard'
import { DEMO_PROFILES, DEMO_EVENTS, DEMO_COMMUNITIES, DEMO_PLACES } from '@/lib/demo-data'

const TABS = [
  { id: 'all', label: 'All', icon: TrendingUp },
  { id: 'people', label: 'People', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'communities', label: 'Communities', icon: Compass },
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'activities', label: 'Activities', icon: Activity },
]

const TRENDING_SEARCHES = [
  'Photography Nairobi',
  'Tech events this week',
  'Startup founders',
  'Nairobi creatives',
  'Weekend hiking',
  'Music producers',
]

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const hasQuery = query.trim().length > 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Explore</h1>
        <p className="text-sm font-medium text-slate-600">Discover people, events, communities and places</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, events, communities, places..."
          className="meet-input pl-11"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {!hasQuery ? (
        <>
          {/* Trending */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Trending searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((s) => (
                <motion.button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-800 font-semibold hover:text-blue-600 hover:border-blue-500 shadow-sm transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content sections by tab */}
          {(activeTab === 'all' || activeTab === 'people') && (
            <section className="mb-10">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={16} className="text-blue-600" /> People
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {DEMO_PROFILES.map((p) => (
                  <ProfileCard key={p.id} profile={p} interests={['Technology', 'Photography']} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'events') && (
            <section className="mb-10">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" /> Events
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_EVENTS.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'communities') && (
            <section className="mb-10">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Compass size={16} className="text-blue-600" /> Communities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_COMMUNITIES.map((c) => (
                  <CommunityCard key={c.id} community={c} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'places') && (
            <section className="mb-10">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" /> Places
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_PLACES.map((place) => (
                  <motion.div
                    key={place.id}
                    className="meet-card p-4 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="h-24 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <MapPin size={20} />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{place.name}</h3>
                    <p className="text-xs text-slate-600 font-medium mb-2">{place.address}, {place.city}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-semibold">{place.category}</span>
                      {place.rating && (
                        <span className="text-xs text-blue-600 flex items-center gap-1 font-semibold">
                          <Star size={11} className="fill-blue-600 text-blue-600" /> {place.rating}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Search Results */
        <div>
          <p className="text-sm text-slate-700 font-medium mb-6">
            Showing results for &quot;<span className="text-slate-900 font-bold">{query}</span>&quot;
          </p>

          {(activeTab === 'all' || activeTab === 'people') && (
            <section className="mb-8">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">People</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_PROFILES.filter((p) =>
                  p.full_name.toLowerCase().includes(query.toLowerCase()) ||
                  p.username.toLowerCase().includes(query.toLowerCase()) ||
                  (p.bio ?? '').toLowerCase().includes(query.toLowerCase())
                ).map((p) => (
                  <ProfileCard key={p.id} profile={p} interests={[]} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'events') && (
            <section className="mb-8">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_EVENTS.filter((e) =>
                  e.title.toLowerCase().includes(query.toLowerCase()) ||
                  e.description.toLowerCase().includes(query.toLowerCase())
                ).map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'communities') && (
            <section className="mb-8">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Communities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_COMMUNITIES.filter((c) =>
                  c.name.toLowerCase().includes(query.toLowerCase()) ||
                  c.description.toLowerCase().includes(query.toLowerCase())
                ).map((c) => (
                  <CommunityCard key={c.id} community={c} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
