'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image, Calendar, Users, PenSquare, Check, Globe, AlertTriangle } from 'lucide-react'

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<'post' | 'event' | 'community'>('post')
  const [formError, setFormError] = useState<string | null>(null)

  // Post form state
  const [postContent, setPostContent] = useState('')
  const [postVisibility, setPostVisibility] = useState('Public')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Event form state
  const [eventTitle, setEventTitle] = useState('')
  const [eventCategory, setEventCategory] = useState('Technology')
  const [eventDate, setEventDate] = useState('')
  const [eventVenue, setEventVenue] = useState('')
  const [eventPrice, setEventPrice] = useState('Free')

  // Community form state
  const [commName, setCommName] = useState('')
  const [commCategory, setCommCategory] = useState('Technology')
  const [commDesc, setCommDesc] = useState('')

  // Reactive validation checks
  const isPostValid = postContent.trim().length >= 5 && postContent.length <= 500

  const isEventValid = Boolean(
    eventTitle.trim().length >= 5 &&
    eventDate &&
    new Date(eventDate).getTime() > Date.now() &&
    eventVenue.trim().length >= 3
  )

  const isCommValid = Boolean(
    commName.trim().length >= 3 &&
    commDesc.trim().length >= 15
  )

  async function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (postContent.trim().length < 5) {
      setFormError('Post content must be at least 5 characters long.')
      return
    }
    if (postContent.length > 500) {
      setFormError('Post content cannot exceed 500 characters.')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setSubmitted(true)
    setSubmitting(false)
  }

  async function handleEventSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (eventTitle.trim().length < 5) {
      setFormError('Event title must be at least 5 characters.')
      return
    }
    if (!eventDate) {
      setFormError('Please select a scheduled date and time for this event.')
      return
    }
    if (new Date(eventDate).getTime() <= Date.now()) {
      setFormError('Event date and time must be set to a future date.')
      return
    }
    if (eventVenue.trim().length < 3) {
      setFormError('Please enter a valid venue or location (min. 3 characters).')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setSubmitted(true)
    setSubmitting(false)
  }

  async function handleCommSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (commName.trim().length < 3) {
      setFormError('Community name must be at least 3 characters.')
      return
    }
    if (commDesc.trim().length < 15) {
      setFormError('Community description must be at least 15 characters to explain the group mission.')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setSubmitted(true)
    setSubmitting(false)
  }

  function resetForm() {
    setSubmitted(false)
    setFormError(null)
    setPostContent('')
    setEventTitle('')
    setEventDate('')
    setEventVenue('')
    setCommName('')
    setCommDesc('')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Create</h1>
        <p className="text-sm text-slate-500">Share a post, host an event, or start a community</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200 pb-4">
        {[
          { id: 'post' as const, label: 'Post', icon: PenSquare },
          { id: 'event' as const, label: 'Event', icon: Calendar },
          { id: 'community' as const, label: 'Community', icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setSubmitted(false) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Submitted Success Screen */}
      {submitted ? (
        <motion.div
          className="meet-card p-8 text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Check size={28} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">
            {activeTab === 'post' ? 'Post Published' : activeTab === 'event' ? 'Event Created' : 'Community Created'}
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            {activeTab === 'post'
              ? 'Your post is now live and visible to your connections.'
              : activeTab === 'event'
              ? 'Your event is now discoverable on the events board.'
              : 'Your new community is ready for members to join.'}
          </p>
          <button
            onClick={resetForm}
            className="btn-blue px-6 py-2.5 text-sm font-semibold"
          >
            Create Another
          </button>
        </motion.div>
      ) : (
        /* Forms */
        <div className="meet-card p-6 shadow-sm">
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 mb-5"
            >
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span>{formError}</span>
            </motion.div>
          )}

          {activeTab === 'post' && (
            <form onSubmit={handlePostSubmit} className="space-y-4">
              {/* Author */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/avatars/ian.jpg"
                  alt="Ian Kariuki"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ian Kariuki</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Globe size={11} className="text-blue-600" />
                    <span>{postVisibility}</span>
                  </div>
                </div>
              </div>

              <textarea
                value={postContent}
                onChange={(e) => { setPostContent(e.target.value); setFormError(null) }}
                placeholder="What would you like to share with your network?"
                rows={5}
                className="meet-input resize-none text-base"
                autoFocus
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-sm transition-all duration-200 shadow-sm"
                >
                  <Image size={15} /> Add Media
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <select
                    value={postVisibility}
                    onChange={(e) => setPostVisibility(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-600 outline-none shadow-sm"
                  >
                    <option value="Public">Public</option>
                    <option value="Connections only">Connections only</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className={`text-xs ${postContent.length > 450 ? 'text-amber-500 font-semibold' : postContent.trim().length < 5 ? 'text-slate-400' : 'text-emerald-600 font-medium'}`}>
                  {postContent.trim().length < 5 ? `${postContent.length}/500 (min. 5 chars)` : `${postContent.length}/500`}
                </span>
                <motion.button
                  type="submit"
                  disabled={!isPostValid || submitting}
                  className="btn-blue py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm"
                  whileTap={{ scale: 0.97 }}
                >
                  {submitting ? 'Publishing...' : 'Share Post'}
                </motion.button>
              </div>
            </form>
          )}

          {activeTab === 'event' && (
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => { setEventTitle(e.target.value); setFormError(null) }}
                  placeholder="e.g. Nairobi AI & Cloud Builders Meetup"
                  className="meet-input"
                  required
                />
                {eventTitle.trim().length > 0 && eventTitle.trim().length < 5 && (
                  <p className="text-[11px] text-amber-600 mt-1">Title must be at least 5 characters.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="meet-input"
                  >
                    {['Technology', 'Business', 'Music', 'Photography', 'Fitness', 'Art', 'Networking'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => { setEventDate(e.target.value); setFormError(null) }}
                    className="meet-input"
                    required
                  />
                  {eventDate && new Date(eventDate).getTime() <= Date.now() && (
                    <p className="text-[11px] text-amber-600 mt-1">Date and time must be set in the future.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Venue / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => { setEventVenue(e.target.value); setFormError(null) }}
                    placeholder="e.g. iHub, Senteu Plaza, Nairobi"
                    className="meet-input"
                    required
                  />
                  {eventVenue.trim().length > 0 && eventVenue.trim().length < 3 && (
                    <p className="text-[11px] text-amber-600 mt-1">Venue must be at least 3 characters.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pricing
                  </label>
                  <select
                    value={eventPrice}
                    onChange={(e) => setEventPrice(e.target.value)}
                    className="meet-input"
                  >
                    <option value="Free">Free</option>
                    <option value="KES 500">KES 500</option>
                    <option value="KES 1000">KES 1,000</option>
                    <option value="KES 2500">KES 2,500</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!isEventValid || submitting}
                  className="btn-blue py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm"
                >
                  {submitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'community' && (
            <form onSubmit={handleCommSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Community Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={commName}
                  onChange={(e) => { setCommName(e.target.value); setFormError(null) }}
                  placeholder="e.g. Nairobi Frontend Developers"
                  className="meet-input"
                  required
                />
                {commName.trim().length > 0 && commName.trim().length < 3 && (
                  <p className="text-[11px] text-amber-600 mt-1">Community name must be at least 3 characters.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={commCategory}
                  onChange={(e) => setCommCategory(e.target.value)}
                  className="meet-input"
                >
                  {['Technology', 'Photography', 'Music', 'Business', 'Art', 'Fitness', 'Travel', 'Design'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={commDesc}
                  onChange={(e) => { setCommDesc(e.target.value); setFormError(null) }}
                  placeholder="Describe your community mission, members, and regular activities (min. 15 characters)..."
                  rows={4}
                  className="meet-input resize-none"
                  required
                />
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={commDesc.trim().length < 15 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-semibold'}>
                    {commDesc.trim().length < 15 ? `Minimum 15 characters required (${commDesc.trim().length}/15)` : 'Description meets requirements'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!isCommValid || submitting}
                  className="btn-blue py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm"
                >
                  {submitting ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
