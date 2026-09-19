'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Share2, Star, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { DEMO_EVENTS } from '@/lib/demo-data'
import { formatEventDate, formatEventTime } from '@/lib/utils'
import { useState } from 'react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

export default function EventDetailPage() {
  const params = useParams()
  const event = DEMO_EVENTS.find((e) => e.id === params.id) ?? DEMO_EVENTS[0]
  const [isGoing, setIsGoing] = useState(false)
  const [isInterested, setIsInterested] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
      {/* Back */}
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 font-semibold transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      {/* Hero */}
      <div className="h-64 md:h-80 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
        {event.cover_url ? (
          <img src={event.cover_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <CategoryIcon name={event.category} size={40} />
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
          {event.category}
        </div>
        {event.is_free && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
            FREE
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-600" />
                <span className="font-bold text-slate-900">{formatEventDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-600" />
                <span className="text-slate-700 font-semibold">{formatEventTime(event.start_date)} — {formatEventTime(event.end_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-600" />
                <span className="text-slate-700 font-semibold">{event.venue_name}</span>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex -space-x-2">
              {['amara.jpg', 'kwame.jpg', 'sadia.jpg', 'david.jpg', 'faith.jpg'].map((file) => (
                <img key={file} src={`/avatars/${file}`} alt="Attendee" className="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
              ))}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">{event.attendees_count} people are going</span>
              <p className="text-xs text-slate-600 font-medium">and {event.interested_count} are interested</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">About this event</h2>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">Location</h2>
            <div className="h-48 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 z-10">
                <MapPin size={24} />
              </div>
              <div className="text-center z-10">
                <p className="text-sm font-bold text-slate-900">{event.venue_name}</p>
                <p className="text-xs text-slate-700 font-medium">{event.address}, {event.city}</p>
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-medium">Map coming soon</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Action card */}
          <div className="meet-card p-5 space-y-4 shadow-sm">
            {!event.is_free && event.price && (
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">Ticket price</p>
                <p className="text-2xl font-black text-slate-900">{event.currency} {event.price.toLocaleString()}</p>
              </div>
            )}
            {event.is_free && (
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">Price</p>
                <p className="text-2xl font-black text-emerald-600">Free</p>
              </div>
            )}

            <motion.button
              onClick={() => setIsGoing(!isGoing)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isGoing
                  ? 'bg-blue-100 border border-blue-300 text-blue-800 font-bold'
                  : 'btn-blue w-full'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {isGoing ? (
                <>
                  <Check size={16} /> You are going!
                </>
              ) : (
                'Join Event'
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsInterested(!isInterested)}
              className={`w-full py-3 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all duration-200 ${
                isInterested
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <Star size={14} className={isInterested ? 'fill-blue-600 text-blue-600' : 'text-slate-500'} />
              {isInterested ? 'Interested' : 'Mark Interested'}
            </motion.button>

            <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200">
              <Share2 size={14} className="text-slate-600" />
              Share Event
            </button>
          </div>

          {/* Host */}
          {event.host && (
            <div className="meet-card p-4 shadow-sm">
              <p className="text-xs text-slate-700 mb-3 uppercase tracking-wider font-bold">Hosted by</p>
              <Link href={`/people/${event.host.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src={event.host.avatar_url ?? undefined} alt={event.host.full_name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{event.host.full_name}</p>
                  <p className="text-xs text-slate-600 font-medium">@{event.host.username}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Capacity */}
          {event.capacity && (
            <div className="meet-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-700 font-semibold">Spots remaining</span>
                <span className="text-xs font-black text-slate-900">
                  {Math.max(0, event.capacity - event.attendees_count)}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.min(100, (event.attendees_count / event.capacity) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-600 font-medium">{event.attendees_count} registered</span>
                <span className="text-[10px] text-slate-600 font-medium">of {event.capacity}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
