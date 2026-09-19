'use client'

import { useState } from 'react'
import { EventCard } from '@/components/events/EventCard'
import { DEMO_EVENTS } from '@/lib/demo-data'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const categories = ['All', 'Technology', 'Music', 'Business', 'Sports', 'Art', 'Food', 'Education', 'Gaming']

  const filtered = DEMO_EVENTS.filter((event) => {
    const matchesCategory = activeCategory === 'All' || event.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.venue_name.toLowerCase().includes(search.toLowerCase()) ||
      event.city.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Events</h1>
          <p className="text-sm font-medium text-slate-600">Experiences worth attending near you</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/create" className="btn-blue py-2 px-5 text-sm font-semibold flex items-center gap-1.5">
            <Plus size={16} /> Create Event
          </Link>
        </div>
      </div>

      {/* Search and Category filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or venue..."
            className="meet-input pl-10 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <p className="text-base font-bold text-slate-900 mb-1">No events found</p>
          <p className="text-xs font-medium text-slate-600">Try selecting a different category or clearing search.</p>
        </div>
      )}
    </div>
  )
}
