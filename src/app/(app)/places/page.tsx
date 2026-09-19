'use client'

import { useState } from 'react'
import { DEMO_PLACES } from '@/lib/demo-data'
import { MapPin, Star, Calendar, Check, Search } from 'lucide-react'

export default function PlacesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [checkedInPlace, setCheckedInPlace] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const categories = ['All', 'Coworking', 'Nature', 'Social & Events', 'Cafe', 'Culture']

  const filteredPlaces = DEMO_PLACES.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category.toLowerCase().includes(activeCategory.toLowerCase())
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Places</h1>
        <p className="text-sm font-medium text-slate-600">Discover where people are meeting, working and gathering</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search places by name or city..."
            className="meet-input pl-10 py-2.5 text-sm"
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

      {/* Map Card */}
      <div className="h-56 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-3 mb-8 relative overflow-hidden shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <MapPin size={28} />
        </div>
        <div className="text-center z-10 px-4">
          <p className="text-slate-900 font-bold text-base">Interactive City Map</p>
          <p className="text-xs text-slate-600 font-medium mt-1">Displaying verified meeting hotspots across Nairobi and major cities</p>
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => {
          const isCheckedIn = checkedInPlace === place.id

          return (
            <div key={place.id} className="meet-card overflow-hidden flex flex-col shadow-sm">
              <div className="h-36 bg-slate-50 border-b border-slate-200 flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <MapPin size={22} />
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {place.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{place.name}</h3>
                    {place.rating && (
                      <div className="flex items-center gap-1 flex-shrink-0 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        <Star size={11} className="text-blue-600 fill-blue-600" />
                        <span className="text-xs text-blue-700 font-bold">{place.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 font-medium mb-3 line-clamp-2 leading-relaxed">{place.description}</p>
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-700 font-medium">
                    <MapPin size={12} className="text-slate-600 flex-shrink-0" />
                    <span className="truncate">{place.address}, {place.city}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <Calendar size={12} className="text-blue-600" />
                    <span>{place.events_count} events</span>
                  </div>
                  <button
                    onClick={() => setCheckedInPlace(isCheckedIn ? null : place.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                      isCheckedIn
                        ? 'bg-blue-100 border border-blue-300 text-blue-800 font-bold'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isCheckedIn ? (
                      <>
                        <Check size={12} /> Checked In
                      </>
                    ) : (
                      'Check In'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
