'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radio,
  TrendingUp,
  Users,
  RefreshCw,
  ArrowUp,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DEMO_POSTS, DEMO_PROFILES } from '@/lib/demo-data'
import type { Post } from '@/types'
import { PostCard } from '@/components/feed/PostCard'
import { StoriesCarousel } from '@/components/feed/StoriesCarousel'
import { QuickPostCreator } from '@/components/feed/QuickPostCreator'

const FEED_FILTERS = [
  'All Connections',
  'Videos',
  'Technology',
  'Photography',
  'Business',
  'Fitness',
  'Music',
]

const TRENDING_TOPICS = [
  { tag: 'NairobiTechSummit', count: '1.4K posts', category: 'Technology' },
  { tag: 'KaruraPhotowalk', count: '840 posts', category: 'Photography' },
  { tag: 'SiliconSavannah', count: '2.1K posts', category: 'Business' },
  { tag: 'PayAfrica100K', count: '620 posts', category: 'Fintech' },
  { tag: 'NgongHillsTrail', count: '490 posts', category: 'Outdoors' },
]

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS)
  const [activeFilter, setActiveFilter] = useState('All Connections')
  const [hasNewPostsBanner, setHasNewPostsBanner] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time background connection update after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewPostsBanner(true)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  function handleAddPost(newPost: Post) {
    setPosts((prev) => [newPost, ...prev])
  }

  function handleLoadNewPosts() {
    setHasNewPostsBanner(false)
    setIsRefreshing(true)

    // Simulate newly arrived connection post
    setTimeout(() => {
      const incomingPost: Post = {
        id: `post-live-${Date.now()}`,
        author_id: 'p7',
        author: DEMO_PROFILES[6], // Faith Chebet
        content:
          'Just onboarded our 5,000th smallholder farmer in Kiambu onto ShambaPulse! AI satellite crop monitoring is officially live. Excited to share more at iHub this Thursday!',
        location: 'Kiambu / Gigiri, Nairobi',
        category: 'Technology',
        likes_count: 88,
        comments_count: 12,
        shares_count: 14,
        created_at: new Date().toISOString(),
        is_liked: false,
        is_saved: false,
        tags: ['AgriTech', 'ShambaPulse', 'FoodSecurityKE'],
        comments: [],
      }

      setPosts((prev) => [incomingPost, ...prev])
      setIsRefreshing(false)
    }, 500)
  }

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'All Connections') return true
    if (activeFilter === 'Videos') {
      return post.post_type === 'video' || post.media_url?.endsWith('.mp4') || post.category === 'Videos' || post.tags?.includes('videofeed')
    }
    return post.category?.toLowerCase() === activeFilter.toLowerCase()
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Feed
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stream
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">
            Real-time updates, photos and experiences from your connections in Nairobi
          </p>
        </div>

        <button
          onClick={() => {
            setIsRefreshing(true)
            setTimeout(() => setIsRefreshing(false), 600)
          }}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-8">
          {/* Active Stories Carousel */}
          <StoriesCarousel />

          {/* Quick Post Creator */}
          <QuickPostCreator
            onPostCreated={handleAddPost}
            currentUserAvatar="/avatars/ian.jpg"
            currentUserName="Ian Kariuki"
          />

          {/* Real-time incoming posts banner */}
          <AnimatePresence>
            {hasNewPostsBanner && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handleLoadNewPosts}
                className="w-full mb-4 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
              >
                <ArrowUp size={14} />
                <span>New updates from Faith Chebet and connections • Tap to view</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
            {FEED_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
                }`}
              >
                {filter === 'Videos' && (
                  <Video size={13} className={activeFilter === 'Videos' ? 'text-white' : 'text-red-500'} />
                )}
                <span>{filter}</span>
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserAvatar="/avatars/ian.jpg"
                currentUserName="Ian Kariuki"
              />
            ))}

            {filteredPosts.length === 0 && (
              <div className="meet-card p-12 text-center border border-slate-200 bg-white">
                <Radio size={32} className="text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  No posts in this category yet
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                  Be the first in your Nairobi connection network to share an update here!
                </p>
                <button
                  onClick={() => setActiveFilter('All Connections')}
                  className="btn-blue py-2 px-4 text-xs font-bold"
                >
                  View All Updates
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Trending in Nairobi */}
          <div className="meet-card p-5 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Trending in Nairobi
              </h3>
            </div>

            <div className="space-y-3.5">
              {TRENDING_TOPICS.map(({ tag, count, category }) => (
                <div
                  key={tag}
                  className="group cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      {category}
                    </span>
                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                      #{tag}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connections You May Know */}
          <div className="meet-card p-5 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  People to Connect With
                </h3>
              </div>
              <Link
                href="/people"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {DEMO_PROFILES.slice(6, 9).map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 last:border-none last:pb-0"
                >
                  <Link
                    href={`/people/${profile.username}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <Image
                      src={profile.avatar_url ?? '/avatars/faith.jpg'}
                      alt={profile.full_name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate hover:text-blue-600">
                        {profile.full_name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-600 truncate">
                        {profile.city}, Kenya
                      </p>
                    </div>
                  </Link>

                  <button className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex-shrink-0 border border-blue-200">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attached Experiences Banner */}
          <div className="rounded-2xl bg-blue-600 p-5 text-white shadow-md">
            <h4 className="font-bold text-base mb-1">Upcoming in Nairobi</h4>
            <p className="text-xs text-blue-100 mb-3 leading-relaxed">
              Discover 38 events and meetups happening across Kilimani, Westlands, and Karen this week.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-white text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
