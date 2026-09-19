'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Ticket, Check } from 'lucide-react'
import type { Event } from '@/types'
import { formatEventDate, formatEventTime, formatNumber } from '@/lib/utils'
import { useState } from 'react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

interface EventCardProps {
  event: Event
  compact?: boolean
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const [isGoing, setIsGoing] = useState(event.is_attending ?? false)

  return (
    <motion.div
      className="meet-card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Cover image or solid background */}
      <Link href={`/events/${event.id}`}>
        <div className="h-40 relative overflow-hidden bg-slate-50 border-b border-slate-200">
          {event.cover_url ? (
            <img src={event.cover_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <CategoryIcon name={event.category} size={28} />
              </div>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
            {event.category}
          </div>
          {/* Free badge */}
          {event.is_free && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
              FREE
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <Link href={`/events/${event.id}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
        </Link>

        {/* Date & Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-blue-600" />
            <span className="text-xs text-slate-800 font-semibold">{formatEventDate(event.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-slate-600" />
            <span className="text-xs text-slate-700 font-semibold">{formatEventTime(event.start_date)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-slate-600" />
          <span className="text-xs text-slate-700 font-medium truncate">{event.venue_name}, {event.city}</span>
        </div>

        {/* Attendees + Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-slate-600" />
            <span className="text-xs text-slate-700 font-semibold">
              {formatNumber(event.attendees_count)} going
            </span>
          </div>
          {!event.is_free && event.price && (
            <div className="flex items-center gap-1">
              <Ticket size={12} className="text-slate-600" />
              <span className="text-xs text-slate-900 font-bold">
                {event.currency} {event.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Host */}
        {event.host && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            {event.host.avatar_url ? (
              <img src={event.host.avatar_url} alt={event.host.full_name} className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">
                {event.host.full_name[0]}
              </div>
            )}
            <span className="text-[11px] text-slate-600">Hosted by <span className="text-slate-900 font-bold">{event.host.full_name}</span></span>
          </div>
        )}

        {/* Action */}
        <motion.button
          onClick={() => setIsGoing(!isGoing)}
          className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isGoing
              ? 'bg-blue-100 border border-blue-300 text-blue-800 font-bold'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
          whileTap={{ scale: 0.97 }}
        >
          {isGoing ? (
            <>
              <Check size={13} /> Going
            </>
          ) : (
            'Join Event'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="meet-card overflow-hidden">
      <div className="skeleton h-40 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-8 rounded-lg" />
      </div>
    </div>
  )
}
