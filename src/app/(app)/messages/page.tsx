'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Search, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { DEMO_PROFILES } from '@/lib/demo-data'
import { formatRelativeTime } from '@/lib/utils'

const DEMO_CONVERSATIONS = DEMO_PROFILES.slice(0, 5).map((profile, i) => ({
  id: `conv-${i + 1}`,
  profile,
  lastMessage: [
    'Hey Ian! Are you heading to iHub for the Nairobi Tech Summit this Saturday?',
    'I edited those golden hour shots from Karura Gate C. The forest lighting came out great!',
    'Let\'s catch up at The Alchemist pitch night. Have an angel investor I want you to meet.',
    'Did you test the new Safaricom M-Pesa API release? The response latency is under 50ms now.',
    'Hey! We\'re having an acoustic jam session at GoDown Arts Centre this Friday. Pull up!',
  ][i],
  timestamp: new Date(Date.now() - [5, 23, 60, 180, 360][i] * 60 * 1000).toISOString(),
  unread: i < 2 ? i + 1 : 0,
}))

export default function MessagesPage() {
  const [search, setSearch] = useState('')

  const filtered = DEMO_CONVERSATIONS.filter((c) =>
    c.profile.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-white min-h-[calc(100vh-56px)] lg:min-h-screen">
      {/* Header */}
      <div className="sticky top-14 lg:top-0 z-10 bg-white border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-black text-slate-900">Messages</h1>
          <button className="btn-outline py-1.5 px-3.5 text-xs font-semibold bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
            + New Chat
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="meet-input pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="divide-y divide-slate-100">
        {filtered.map((conv) => (
          <Link key={conv.id} href={`/messages/${conv.id}`}>
            <motion.div
              className="flex items-center gap-3 px-3 py-3.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              whileHover={{ x: 2 }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {conv.profile.avatar_url ? (
                  <img src={conv.profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {conv.profile.first_name[0]}
                  </div>
                )}
                {conv.unread > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{conv.unread}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${conv.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                    {conv.profile.full_name}
                  </p>
                  <span className="text-xs text-slate-600 font-medium">{formatRelativeTime(conv.timestamp)}</span>
                </div>
                <p className={`text-sm truncate mt-0.5 ${conv.unread > 0 ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                  {conv.lastMessage}
                </p>
              </div>

              <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0" onClick={(e) => e.preventDefault()}>
                <MoreHorizontal size={16} className="text-slate-600" />
              </button>
            </motion.div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-500">
            <MessageCircle size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-700">No conversations found</p>
        </div>
      )}
    </div>
  )
}
