'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, MapPin, Calendar, Users, Globe, Edit3, X, Check, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { DEMO_EVENTS, DEMO_COMMUNITIES } from '@/lib/demo-data'
import { formatNumber } from '@/lib/utils'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: 'current-user',
    username: 'ian.kariuki',
    full_name: 'Ian Kariuki',
    first_name: 'Ian',
    last_name: 'Kariuki',
    avatar_url: '/avatars/ian.jpg',
    cover_url: null,
    bio: 'Lead Product Architect @ ReGNL | Building intelligent platforms | Design systems & scalable cloud engines | Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    is_verified: true,
    followers_count: 2450,
    following_count: 512,
    connections_count: 384,
    posts_count: 67,
    interests: ['Technology', 'Photography', 'Travel', 'Design', 'Music'],
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.full_name)
  const [editBio, setEditBio] = useState(profile.bio)
  const [editCity, setEditCity] = useState(profile.city)
  const [editError, setEditError] = useState<string | null>(null)

  const isProfileValid = Boolean(
    editName.trim().length >= 2 &&
    editCity.trim().length >= 2 &&
    editBio.trim().length >= 10
  )

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setEditError(null)
    if (editName.trim().length < 2) {
      setEditError('Full name must be at least 2 characters.')
      return
    }
    if (editCity.trim().length < 2) {
      setEditError('City must be at least 2 characters.')
      return
    }
    if (editBio.trim().length < 10) {
      setEditError('Bio must be at least 10 characters.')
      return
    }
    setProfile((prev) => ({
      ...prev,
      full_name: editName.trim(),
      bio: editBio.trim(),
      city: editCity.trim(),
    }))
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Cover Banner */}
      <div className="h-48 md:h-60 bg-slate-100 border-b border-slate-200 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-outline py-2 px-4 text-xs font-semibold flex items-center gap-1.5 bg-white text-slate-700 shadow-sm"
          >
            <Edit3 size={13} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 md:px-6">
        {/* Avatar */}
        <div className="relative -mt-14 mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-slate-100"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-3xl font-black text-white shadow-lg">
              {profile.full_name.split(' ').map((n) => n[0]).join('')}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900">{profile.full_name}</h1>
            {profile.is_verified && <BadgeCheck size={20} className="text-blue-600" />}
          </div>
          <p className="text-slate-600 text-sm mb-2 font-mono font-bold">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-slate-800 leading-relaxed max-w-2xl font-normal">{profile.bio}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {profile.city && (
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <MapPin size={13} className="text-blue-600" /> {profile.city}, {profile.country}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <Calendar size={13} className="text-blue-600" /> Joined September 2026
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-8 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          {[
            { label: 'Followers', value: profile.followers_count },
            { label: 'Following', value: profile.following_count },
            { label: 'Connections', value: profile.connections_count },
            { label: 'Posts', value: profile.posts_count },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-black text-slate-900">{formatNumber(value)}</p>
              <p className="text-xs text-slate-700 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <CategoryIcon name={interest} size={13} className="text-blue-600" />
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-blue-600" /> Attending Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_EVENTS.slice(0, 2).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="meet-card p-3.5 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-600 font-medium">{event.city} · {event.attendees_count} going</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Communities */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Users size={14} className="text-blue-600" /> Joined Communities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_COMMUNITIES.slice(0, 4).map((community) => (
              <Link key={community.id} href={`/communities/${community.slug}`}>
                <div className="meet-card p-3.5 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Globe size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{community.name}</p>
                    <p className="text-xs text-slate-600 font-medium">{formatNumber(community.members_count)} members</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            className="meet-card p-6 w-full max-w-md bg-white border border-slate-200 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              {editError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle size={15} className="flex-shrink-0 text-red-500" />
                  <span>{editError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); setEditError(null) }}
                  className="meet-input"
                  required
                />
                {editName.trim().length > 0 && editName.trim().length < 2 && (
                  <p className="text-[11px] text-amber-600 mt-1">Full name must be at least 2 characters.</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => { setEditCity(e.target.value); setEditError(null) }}
                  className="meet-input"
                  required
                />
                {editCity.trim().length > 0 && editCity.trim().length < 2 && (
                  <p className="text-[11px] text-amber-600 mt-1">City must be at least 2 characters.</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => { setEditBio(e.target.value); setEditError(null) }}
                  rows={3}
                  className="meet-input resize-none"
                  required
                />
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={editBio.trim().length < 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-semibold'}>
                    {editBio.trim().length < 10 ? `Min. 10 characters required (${editBio.trim().length}/10)` : 'Bio meets requirements'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-outline py-2 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isProfileValid}
                  className="btn-blue py-2 px-5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check size={14} /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
