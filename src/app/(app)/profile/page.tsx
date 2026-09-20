'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Users,
  Globe,
  Edit3,
  X,
  Check,
  AlertTriangle,
  Camera,
  Film,
  Image as ImageIcon,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import { DEMO_EVENTS, DEMO_COMMUNITIES } from '@/lib/demo-data'
import { formatNumber } from '@/lib/utils'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/types'

const AVAILABLE_INTERESTS = [
  'Technology', 'Photography', 'Travel', 'Design', 'Music',
  'Business', 'Fitness', 'Art', 'Food', 'Gaming', 'Wellness',
]

interface UserProfileState {
  id: string
  username: string
  full_name: string
  first_name: string
  last_name: string
  avatar_url: string
  cover_url: string | null
  bio: string
  city: string
  country: string
  website: string | null
  account_type: 'personal' | 'creator' | 'business'
  is_verified: boolean
  followers_count: number
  following_count: number
  connections_count: number
  posts_count: number
  interests: string[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileState>({
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
    website: 'https://regnl.com',
    account_type: 'creator',
    is_verified: true,
    followers_count: 2450,
    following_count: 512,
    connections_count: 384,
    posts_count: 67,
    interests: ['Technology', 'Photography', 'Travel', 'Design', 'Music'],
  })

  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'communities'>('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.full_name)
  const [editUsername, setEditUsername] = useState(profile.username)
  const [editBio, setEditBio] = useState(profile.bio)
  const [editCity, setEditCity] = useState(profile.city)
  const [editWebsite, setEditWebsite] = useState(profile.website || '')
  const [editAccountType, setEditAccountType] = useState(profile.account_type)
  const [editInterests, setEditInterests] = useState<string[]>(profile.interests)
  const [editError, setEditError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // User posts including video and photo posts
  const [userPosts] = useState<Post[]>([
    {
      id: 'my-post-1',
      author_id: 'current-user',
      author: {
        id: 'current-user',
        username: profile.username,
        full_name: profile.full_name,
        first_name: 'Ian',
        last_name: 'Kariuki',
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        bio: profile.bio,
        city: profile.city,
        country: profile.country,
        account_type: profile.account_type,
        is_verified: profile.is_verified,
        is_private: false,
        website: profile.website,
        followers_count: profile.followers_count,
        following_count: profile.following_count,
        connections_count: profile.connections_count,
        posts_count: profile.posts_count,
        latitude: null,
        longitude: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      content: 'Drone footage testing around Nairobi CBD and Upper Hill skyline. The architectural boom in this city is breathtaking! 🎥🇰🇪',
      post_type: 'video',
      media_url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      location: 'Upper Hill, Nairobi',
      category: 'Videos',
      tags: ['videofeed', 'nairobi', 'cinematography'],
      likes_count: 88,
      comments_count: 14,
      shares_count: 9,
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      is_liked: true,
      comments: [],
    },
    {
      id: 'my-post-2',
      author_id: 'current-user',
      author: {
        id: 'current-user',
        username: profile.username,
        full_name: profile.full_name,
        first_name: 'Ian',
        last_name: 'Kariuki',
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        bio: profile.bio,
        city: profile.city,
        country: profile.country,
        account_type: profile.account_type,
        is_verified: profile.is_verified,
        is_private: false,
        website: profile.website,
        followers_count: profile.followers_count,
        following_count: profile.following_count,
        connections_count: profile.connections_count,
        posts_count: profile.posts_count,
        latitude: null,
        longitude: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      content: 'Official MEET Brand Design System is live. Excited to share what we have been crafting with the community!',
      post_type: 'image',
      media_url: '/meet-logo.jpg',
      location: 'Kilimani, Nairobi',
      category: 'Technology',
      tags: ['designsystems', 'meetapp', 'regnl'],
      likes_count: 154,
      comments_count: 23,
      shares_count: 18,
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      is_liked: false,
      comments: [],
    },
  ])

  // File Input References
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Hydrate profile from Supabase or localStorage
  useEffect(() => {
    async function loadProfile() {
      // 1. Try local storage for instant cache
      try {
        const cached = localStorage.getItem('meet_user_profile')
        if (cached) {
          const parsed = JSON.parse(cached)
          setProfile((prev) => ({ ...prev, ...parsed }))
          setEditName(parsed.full_name || profile.full_name)
          setEditUsername(parsed.username || profile.username)
          setEditBio(parsed.bio || profile.bio)
          setEditCity(parsed.city || profile.city)
          setEditWebsite(parsed.website || profile.website || '')
        }
      } catch {
        // ignore
      }

      // 2. Try Supabase Auth & profiles table
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (dbProfile) {
            const updated = {
              id: dbProfile.id,
              username: dbProfile.username || profile.username,
              full_name: dbProfile.full_name || profile.full_name,
              first_name: dbProfile.first_name || profile.first_name,
              last_name: dbProfile.last_name || profile.last_name,
              avatar_url: dbProfile.avatar_url || profile.avatar_url,
              cover_url: dbProfile.cover_url || profile.cover_url,
              bio: dbProfile.bio || profile.bio,
              city: dbProfile.city || profile.city,
              country: dbProfile.country || profile.country,
              website: dbProfile.website || profile.website,
              account_type: dbProfile.account_type || profile.account_type,
              is_verified: dbProfile.is_verified ?? profile.is_verified,
              followers_count: dbProfile.followers_count ?? profile.followers_count,
              following_count: dbProfile.following_count ?? profile.following_count,
              connections_count: dbProfile.connections_count ?? profile.connections_count,
              posts_count: dbProfile.posts_count ?? profile.posts_count,
              interests: profile.interests,
            }
            setProfile(updated)
            setEditName(updated.full_name)
            setEditUsername(updated.username)
            setEditBio(updated.bio)
            setEditCity(updated.city)
            setEditWebsite(updated.website || '')
            localStorage.setItem('meet_user_profile', JSON.stringify(updated))
          }
        }
      } catch (e) {
        console.warn('Supabase profile load fallback:', e)
      }
    }

    loadProfile()
  }, [])

  // Handle Avatar Upload from Phone/Computer
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    // Optimistic UI update
    setProfile((prev) => {
      const updated = { ...prev, avatar_url: previewUrl }
      localStorage.setItem('meet_user_profile', JSON.stringify(updated))
      return updated
    })
    showToast('Profile picture updated!')

    // Try Supabase Storage upload
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fileExt = file.name.split('.').pop() || 'jpg'
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
          await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
          setProfile((prev) => ({ ...prev, avatar_url: publicUrl }))
        }
      }
    } catch (err) {
      console.warn('Supabase storage avatar upload note:', err)
    } finally {
      e.target.value = ''
    }
  }

  // Handle Cover Banner Upload from Phone/Computer
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    // Optimistic UI update
    setProfile((prev) => {
      const updated = { ...prev, cover_url: previewUrl }
      localStorage.setItem('meet_user_profile', JSON.stringify(updated))
      return updated
    })
    showToast('Cover banner updated!')

    // Try Supabase Storage upload
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fileExt = file.name.split('.').pop() || 'jpg'
        const fileName = `cover-${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(fileName, file, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(fileName)
          await supabase.from('profiles').update({ cover_url: publicUrl }).eq('id', user.id)
          setProfile((prev) => ({ ...prev, cover_url: publicUrl }))
        }
      }
    } catch (err) {
      console.warn('Supabase storage cover upload note:', err)
    } finally {
      e.target.value = ''
    }
  }

  const isProfileValid = Boolean(
    editName.trim().length >= 2 &&
    editUsername.trim().length >= 3 &&
    editCity.trim().length >= 2 &&
    editBio.trim().length >= 10
  )

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setEditError(null)

    if (editName.trim().length < 2) {
      setEditError('Full name must be at least 2 characters.')
      return
    }
    if (editUsername.trim().length < 3) {
      setEditError('Username must be at least 3 characters.')
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

    const updated = {
      ...profile,
      full_name: editName.trim(),
      username: editUsername.trim().toLowerCase().replace('@', ''),
      bio: editBio.trim(),
      city: editCity.trim(),
      website: editWebsite.trim() || null,
      account_type: editAccountType,
      interests: editInterests,
    }

    setProfile(updated)
    localStorage.setItem('meet_user_profile', JSON.stringify(updated))
    setIsEditing(false)
    showToast('Profile updated successfully!')

    // Sync to Supabase
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.full_name,
            username: updated.username,
            bio: updated.bio,
            city: updated.city,
            website: updated.website,
            account_type: updated.account_type,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      }
    } catch (err) {
      console.warn('Supabase profile update sync note:', err)
    }
  }

  function toggleInterest(item: string) {
    setEditInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-2 border border-slate-700 text-xs font-semibold"
          >
            <Check size={14} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs for Device/Phone Media Selection */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />

      {/* Cover Banner */}
      <div className="h-48 md:h-64 relative overflow-hidden bg-slate-900 border-b border-slate-200 group">
        {profile.cover_url ? (
          <img
            src={profile.cover_url}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 flex items-center justify-between px-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            <div className="relative z-10 hidden sm:block">
              <span className="text-white/40 font-mono text-xs tracking-widest uppercase">MEET Profile Banner</span>
              <p className="text-white/80 font-bold text-sm mt-0.5">Nairobi, Kenya • Creator Space</p>
            </div>
          </div>
        )}

        {/* Banner Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={() => coverInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg border border-white/20"
            title="Upload new cover photo from your device"
          >
            <Camera size={13} className="text-white" />
            <span>Change Banner</span>
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg border border-slate-200"
          >
            <Edit3 size={13} className="text-blue-600" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile info section */}
      <div className="px-4 md:px-6">
        {/* Floating Avatar */}
        <div className="relative -mt-16 sm:-mt-20 mb-4 flex items-end justify-between">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white bg-white shadow-xl ring-2 ring-slate-100 flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-4xl font-black text-white">
                  {profile.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
              )}
            </div>

            {/* Quick Change Avatar Button directly on photo */}
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
              title="Change profile picture from phone/computer"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold capitalize">
              {profile.account_type} Account
            </span>
            {profile.is_verified && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                <BadgeCheck size={14} className="text-emerald-600" /> Verified Member
              </span>
            )}
          </div>
        </div>

        {/* Name, Handle & Bio */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {profile.full_name}
            </h1>
            {profile.is_verified && <BadgeCheck size={22} className="text-blue-600 flex-shrink-0" />}
          </div>

          <p className="text-slate-500 text-sm mb-3 font-mono font-bold">
            @{profile.username}
          </p>

          {profile.bio && (
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed max-w-2xl font-normal mb-3">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600 font-semibold">
            {profile.city && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                <span>{profile.city}, {profile.country}</span>
              </div>
            )}

            {profile.website && (
              <a
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
              >
                <Globe size={14} />
                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink size={11} />
              </a>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" />
              <span>Joined September 2026</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {[
            { label: 'Followers', value: profile.followers_count },
            { label: 'Following', value: profile.following_count },
            { label: 'Connections', value: profile.connections_count },
            { label: 'Posts & Videos', value: profile.posts_count },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-lg sm:text-xl font-black text-slate-900">{formatNumber(value)}</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Interests Badges */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Interests & Passions
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold flex items-center gap-1.5 shadow-sm hover:border-blue-300 transition-colors"
              >
                <CategoryIcon name={interest} size={13} className="text-blue-600" />
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Content Tabs Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'posts' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Video size={15} />
            <span>My Posts & Videos</span>
            {activeTab === 'posts' && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'events' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar size={15} />
            <span>Attending Events</span>
            {activeTab === 'events' && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('communities')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'communities' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users size={15} />
            <span>Joined Hubs</span>
            {activeTab === 'communities' && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>

        {/* Tab 1: Posts & Videos */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <article
                key={post.id}
                className="meet-card p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar_url || '/avatars/ian.jpg'}
                      alt={profile.full_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{profile.full_name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        @{profile.username} • {post.location || 'Nairobi'}
                      </p>
                    </div>
                  </div>
                  {post.post_type === 'video' && (
                    <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold flex items-center gap-1">
                      <Film size={11} /> Video Feed
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-800 leading-relaxed mb-3">{post.content}</p>

                {/* Attached Video or Image Player */}
                {post.media_url && (
                  <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm">
                    {post.post_type === 'video' || post.media_url.endsWith('.mp4') ? (
                      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                        <video
                          src={post.media_url}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full max-h-[420px] object-contain rounded-2xl"
                        />
                      </div>
                    ) : (
                      <img
                        src={post.media_url}
                        alt="Post media"
                        className="w-full max-h-96 object-cover"
                      />
                    )}
                  </div>
                )}

                <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <Heart size={14} className="fill-blue-600" /> {post.likes_count} Likes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} /> {post.comments_count} Comments
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 size={14} /> {post.shares_count} Shares
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Tab 2: Attending Events */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_EVENTS.slice(0, 4).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="meet-card p-4 flex items-center gap-3.5 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{event.city} • {event.attendees_count} going</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600">
                      RSVP Confirmed
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab 3: Joined Communities */}
        {activeTab === 'communities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_COMMUNITIES.slice(0, 4).map((community) => (
              <Link key={community.id} href={`/communities/${community.slug}`}>
                <div className="meet-card p-4 flex items-center gap-3.5 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Globe size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{community.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{formatNumber(community.members_count)} members</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-blue-600">
                      Member
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            className="meet-card p-6 w-full max-w-lg bg-white border border-slate-200 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
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

              {/* Photo & Banner Pickers from Modal */}
              <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex flex-col items-center gap-1.5 transition-colors text-center"
                >
                  <Camera size={18} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Change Avatar</span>
                  <span className="text-[10px] text-slate-500">Pick from phone/PC</span>
                </button>

                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex flex-col items-center gap-1.5 transition-colors text-center"
                >
                  <ImageIcon size={18} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Change Banner</span>
                  <span className="text-[10px] text-slate-500">Pick from phone/PC</span>
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); setEditError(null) }}
                  className="meet-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => { setEditUsername(e.target.value); setEditError(null) }}
                    className="meet-input pl-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1">City / Location</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => { setEditCity(e.target.value); setEditError(null) }}
                  className="meet-input"
                  placeholder="e.g. Nairobi, Kenya"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1">Website / Portfolio</label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="meet-input"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['personal', 'creator', 'business'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditAccountType(type)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                        editAccountType === type
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1">Bio (Tell people about yourself)</label>
                <textarea
                  value={editBio}
                  onChange={(e) => { setEditBio(e.target.value); setEditError(null) }}
                  rows={3}
                  className="meet-input resize-none"
                  required
                />
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={editBio.trim().length < 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-semibold'}>
                    {editBio.trim().length < 10 ? `Min. 10 characters required (${editBio.trim().length}/10)` : 'Bio length optimal'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{editBio.length}/500</span>
                </div>
              </div>

              {/* Interests selector */}
              <div>
                <label className="block text-xs text-slate-700 font-bold mb-1.5">Interests</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = editInterests.includes(interest)
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-outline py-2.5 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isProfileValid}
                  className="btn-blue py-2.5 px-6 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <Check size={14} /> Save Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
