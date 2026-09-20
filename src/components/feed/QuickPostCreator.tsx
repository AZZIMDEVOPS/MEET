'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Tag, Send, Check, X, Camera, Video, Film } from 'lucide-react'
import type { Post } from '@/types'

interface QuickPostCreatorProps {
  onPostCreated: (post: Post) => void
  currentUserAvatar?: string
  currentUserName?: string
}

const POPULAR_LOCATIONS = [
  'Kilimani, Nairobi',
  'Westlands, Nairobi',
  'Karura Forest Reserve',
  'Upper Hill, Nairobi',
  'Karen, Nairobi',
  'Ngong Hills, Kajiado',
]

const POPULAR_TOPICS = ['Technology', 'Photography', 'Business', 'Music', 'Fitness', 'Coffee']

export function QuickPostCreator({
  onPostCreated,
  currentUserAvatar = '/avatars/ian.jpg',
  currentUserName = 'Ian Kariuki',
}: QuickPostCreatorProps) {
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mediaAttachment, setMediaAttachment] = useState<{
    type: 'image' | 'video'
    url: string
    name: string
  } | null>(null)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setMediaAttachment({
      type: 'image',
      url,
      name: file.name,
    })
    e.target.value = ''
  }

  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setMediaAttachment({
      type: 'video',
      url,
      name: file.name,
    })
    e.target.value = ''
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (content.trim().length < 3 && !mediaAttachment) return

    setIsPosting(true)

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author_id: 'current-user',
      author: {
        id: 'current-user',
        username: 'ian.kariuki',
        full_name: currentUserName,
        first_name: 'Ian',
        last_name: 'Kariuki',
        avatar_url: currentUserAvatar,
        city: 'Nairobi',
        country: 'Kenya',
        latitude: -1.2921,
        longitude: 36.8219,
        account_type: 'personal',
        is_verified: true,
        is_private: false,
        website: null,
        bio: 'Lead Product Architect @ ReGNL',
        cover_url: null,
        followers_count: 820,
        following_count: 340,
        connections_count: 290,
        posts_count: 46,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      content: content.trim() || (mediaAttachment?.type === 'video' ? 'Shared a video clip' : 'Shared a photo'),
      post_type: mediaAttachment ? mediaAttachment.type : 'text',
      media_url: mediaAttachment ? mediaAttachment.url : null,
      location: location || null,
      category: category || (mediaAttachment?.type === 'video' ? 'Videos' : null),
      tags: category ? [category.toLowerCase()] : mediaAttachment?.type === 'video' ? ['videofeed', 'nairobi'] : [],
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: new Date().toISOString(),
      is_liked: false,
      is_saved: false,
      comments: [],
    }

    setTimeout(() => {
      onPostCreated(newPost)
      setContent('')
      setLocation('')
      setCategory('')
      setMediaAttachment(null)
      setShowLocationPicker(false)
      setShowTopicPicker(false)
      setIsPosting(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2500)
    }, 400)
  }

  return (
    <div className="meet-card p-4 sm:p-5 mb-6 shadow-sm border border-slate-200 bg-white">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3 mb-3">
          <Image
            src={currentUserAvatar}
            alt={currentUserName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 flex-shrink-0 mt-0.5"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What are you experiencing in Nairobi, ${currentUserName.split(' ')[0]}?`}
              rows={2}
              className="w-full resize-none border-none p-0 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 bg-transparent font-medium"
            />
          </div>
        </div>

        {/* Selected tags badges */}
        {(location || category) && (
          <div className="flex flex-wrap gap-2 mb-3 pl-13">
            {location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <MapPin size={12} className="text-blue-600" />
                {location}
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="hover:text-blue-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                <Tag size={12} className="text-blue-600" />
                {category}
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className="hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Location Picker Drawer */}
        <AnimatePresence>
          {showLocationPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden"
            >
              <p className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Select Nairobi Neighborhood
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setLocation(loc)
                      setShowLocationPicker(false)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      location === loc
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topic Picker Drawer */}
        <AnimatePresence>
          {showTopicPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden"
            >
              <p className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Select Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setCategory(topic)
                      setShowTopicPicker(false)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      category === topic
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Preview Box */}
        {mediaAttachment && (
          <div className="relative mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
            {mediaAttachment.type === 'video' ? (
              <div className="w-full relative aspect-video flex items-center justify-center">
                <video
                  src={mediaAttachment.url}
                  controls
                  className="w-full h-full max-h-64 object-contain"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                  <Film size={12} className="text-red-400" /> Video attached
                </div>
              </div>
            ) : (
              <div className="w-full max-h-64 flex items-center justify-center bg-slate-100">
                <img
                  src={mediaAttachment.url}
                  alt="Upload preview"
                  className="w-full max-h-64 object-cover"
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => setMediaAttachment(null)}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={photoInputRef}
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          onChange={handleVideoSelect}
          className="hidden"
        />

        {/* Action bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              title="Add photo from phone/computer"
            >
              <Camera size={14} className="text-blue-600" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              title="Add video from phone/computer"
            >
              <Video size={14} className="text-blue-600" />
              <span className="hidden sm:inline">Video Feed</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                showLocationPicker || location
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin size={14} className="text-blue-600" />
              <span className="hidden sm:inline">Location</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTopicPicker(!showTopicPicker)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                showTopicPicker || category
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Tag size={14} className="text-blue-600" />
              <span className="hidden sm:inline">Topic</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {showSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <Check size={14} /> Posted live!
              </span>
            )}

            <button
              type="submit"
              disabled={(content.trim().length < 2 && !mediaAttachment) || isPosting}
              className="btn-blue py-2 px-4 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {isPosting ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send size={13} />
                  <span>Share Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
