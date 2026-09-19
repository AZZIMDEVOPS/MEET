'use client'

import { useState } from 'react'
import { CommunityCard } from '@/components/communities/CommunityCard'
import { DEMO_COMMUNITIES } from '@/lib/demo-data'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function CommunitiesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const categories = ['All', 'Technology', 'Photography', 'Music', 'Business', 'Travel', 'Art', 'Fitness']

  const filtered = DEMO_COMMUNITIES.filter((c) => {
    const matchesCategory = activeCategory === 'All' || c.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Communities</h1>
          <p className="text-sm font-medium text-slate-600">Find your people, join discussion and collaborate</p>
        </div>
        <Link href="/create" className="btn-blue py-2 px-5 text-sm font-semibold flex items-center gap-1.5">
          <Plus size={16} /> Create Community
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
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
        {filtered.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <p className="text-base font-bold text-slate-900 mb-1">No communities found</p>
          <p className="text-xs font-medium text-slate-600">Try selecting a different category or clearing search.</p>
        </div>
      )}
    </div>
  )
}
