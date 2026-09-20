'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  Send,
  Check,
  Sparkles,
  BadgeCheck,
  Clock,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Music,
} from 'lucide-react'
import Link from 'next/link'
import type { Post, PostComment } from '@/types'
import { formatRelativeTime, formatNumber } from '@/lib/utils'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

interface PostCardProps {
  post: Post
  currentUserAvatar?: string
  currentUserName?: string
}

export function PostCard({
  post,
  currentUserAvatar = '/avatars/ian.jpg',
  currentUserName = 'Ian Kariuki',
}: PostCardProps) {
  const [liked, setLiked] = useState(post.is_liked ?? false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [saved, setSaved] = useState(post.is_saved ?? false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<PostComment[]>(post.comments ?? [])
  const [newComment, setNewComment] = useState('')
  const [copied, setCopied] = useState(false)
  const [attendingEvent, setAttendingEvent] = useState(false)

  // 9:16 Video Player State
  const isVideo = post.post_type === 'video' || post.media_url?.endsWith('.mp4') || post.media_url?.includes('video')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullScreenVideoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showPlayIcon, setShowPlayIcon] = useState(false)

  function togglePlay(e?: React.MouseEvent) {
    e?.stopPropagation()
    const vid = isFullScreen ? fullScreenVideoRef.current : videoRef.current
    if (!vid) return
    if (vid.paused) {
      vid.play()
      setIsPlaying(true)
    } else {
      vid.pause()
      setIsPlaying(false)
    }
    setShowPlayIcon(true)
    setTimeout(() => setShowPlayIcon(false), 800)
  }

  function toggleMute(e?: React.MouseEvent) {
    e?.stopPropagation()
    setIsMuted((prev) => {
      const next = !prev
      if (videoRef.current) videoRef.current.muted = next
      if (fullScreenVideoRef.current) fullScreenVideoRef.current.muted = next
      return next
    })
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const target = e.currentTarget
    if (target.duration) {
      setProgress((target.currentTime / target.duration) * 100)
    }
  }

  function handleLike() {
    if (liked) {
      setLiked(false)
      setLikesCount((prev) => Math.max(0, prev - 1))
    } else {
      setLiked(true)
      setLikesCount((prev) => prev + 1)
    }
  }

  function handleShare() {
    navigator.clipboard?.writeText?.(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: PostComment = {
      id: `comment-${Date.now()}`,
      post_id: post.id,
      author_id: 'current-user',
      likes_count: 0,
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
        posts_count: 45,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      content: newComment.trim(),
      created_at: new Date().toISOString(),
    }

    setComments((prev) => [...prev, comment])
    setNewComment('')
  }

  const author = post.author ?? {
    id: 'unknown',
    username: 'creator',
    full_name: 'Nairobi Creator',
    first_name: 'Nairobi',
    last_name: 'Creator',
    avatar_url: '/avatars/kwame.jpg',
    city: 'Nairobi',
    country: 'Kenya',
    account_type: 'creator' as const,
    is_verified: true,
    is_private: false,
    website: null,
    bio: '',
    cover_url: null,
    followers_count: 0,
    following_count: 0,
    connections_count: 0,
    posts_count: 0,
    latitude: null,
    longitude: null,
    created_at: '',
    updated_at: '',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="meet-card p-5 sm:p-6 mb-4 shadow-sm border border-slate-200 bg-white hover:border-slate-300 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Link href={`/people/${author.username}`} className="relative flex-shrink-0">
            {author.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.full_name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {author.first_name[0]}
              </div>
            )}
            {author.is_verified && (
              <BadgeCheck
                size={14}
                className="absolute -bottom-0.5 -right-0.5 text-blue-600 bg-white rounded-full"
              />
            )}
          </Link>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/people/${author.username}`}
                className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors leading-tight"
              >
                {author.full_name}
              </Link>
              <span className="text-xs font-semibold text-slate-500">
                @{author.username}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Clock size={11} className="text-slate-400" />
                {formatRelativeTime(post.created_at)}
              </span>
            </div>

            {post.location && (
              <div className="flex items-center gap-1 text-xs text-blue-700 font-semibold mt-0.5">
                <MapPin size={11} className="text-blue-600 flex-shrink-0" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {post.category && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
            <CategoryIcon name={post.category} size={11} className="text-blue-600" />
            {post.category}
          </span>
        )}
      </div>

      {/* Body Content */}
      <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal whitespace-pre-line mb-3">
        {post.content}
      </p>

      {/* Attached Media (9:16 Video Feed or Photo) */}
      {post.media_url && (
        <div className="mb-4">
          {isVideo ? (
            <div className="relative w-full max-w-[420px] mx-auto aspect-[9/16] max-h-[78vh] sm:max-h-[82vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 group select-none">
              {/* Blurred background backdrop */}
              <video
                src={post.media_url}
                muted={isMuted}
                loop
                playsInline
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-125 pointer-events-none"
              />

              {/* Main 9:16 Video */}
              <video
                ref={videoRef}
                src={post.media_url}
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="relative z-10 w-full h-full object-cover cursor-pointer"
              />

              {/* Top Floating Bar */}
              <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-black border border-white/20 shadow-lg tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>9:16 REEL</span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105"
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFullScreen(true)
                    }}
                    aria-label="Full Screen 9:16"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105"
                  >
                    <Maximize2 size={13} />
                    <span>Fit Screen</span>
                  </button>
                </div>
              </div>

              {/* Center Play/Pause Pulsing Icon */}
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-15 flex items-center justify-center cursor-pointer"
              >
                {(!isPlaying || showPlayIcon) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl"
                  >
                    {isPlaying ? (
                      <Pause size={28} className="fill-white" />
                    ) : (
                      <Play size={28} className="fill-white translate-x-0.5" />
                    )}
                  </motion.div>
                )}
              </div>

              {/* Bottom Quick Controls & Progress Bar */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-3 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                <div className="flex items-center justify-between text-white/90 text-xs font-semibold mb-2 px-1">
                  <span className="flex items-center gap-1.5 text-[11px] drop-shadow">
                    <Music size={12} className="text-blue-400 animate-pulse" />
                    Original Audio • Nairobi
                  </span>
                  <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-mono">
                    9:16 HD
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-h-[480px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <img
                src={post.media_url}
                alt={post.content.slice(0, 40)}
                className="w-full h-auto max-h-[480px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              #{tag.replace('#', '')}
            </span>
          ))}
        </div>
      )}

      {/* Event Link Card (if post is tied to an event) */}
      {post.event_link && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Attached Nairobi Experience
              </p>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {post.event_link.title}
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {post.event_link.date} • {post.event_link.venue}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAttendingEvent(!attendingEvent)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto ${
              attendingEvent
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
          >
            {attendingEvent ? (
              <>
                <Check size={13} />
                <span>RSVP Confirmed</span>
              </>
            ) : (
              <>
                <Calendar size={13} />
                <span>Join Event</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600 font-semibold">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like */}
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1.5 transition-colors ${
              liked ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            <Heart
              size={17}
              className={liked ? 'fill-blue-600 text-blue-600' : ''}
            />
            <span>{formatNumber(likesCount)}</span>
          </motion.button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <MessageCircle size={17} />
            <span>{comments.length}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors relative"
          >
            <Share2 size={17} />
            <span>{post.shares_count}</span>
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
        </div>

        {/* Bookmark */}
        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center gap-1 transition-colors ${
            saved ? 'text-blue-600' : 'hover:text-blue-600'
          }`}
        >
          <Bookmark
            size={17}
            className={saved ? 'fill-blue-600 text-blue-600' : ''}
          />
        </motion.button>
      </div>

      {/* Real-time Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
          >
            {/* Existing Comments */}
            {comments.length > 0 ? (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5">
                    <img
                      src={comment.author?.avatar_url || '/avatars/amara.jpg'}
                      alt={comment.author?.full_name || 'User'}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-xs">
                          {comment.author?.full_name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-normal">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 mb-3 italic">
                No comments yet. Start the conversation with your connection!
              </p>
            )}

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <img
                src={currentUserAvatar}
                alt={currentUserName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/30 flex-shrink-0"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Reply as ${currentUserName}...`}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-blue-600 disabled:text-slate-300 hover:bg-blue-50 transition-colors"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive 9:16 Full Screen Reel Modal */}
      <AnimatePresence>
        {isFullScreen && isVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-6 select-none"
            onClick={() => setIsFullScreen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform hover:scale-110"
              aria-label="Close Fullscreen"
            >
              <X size={20} />
            </button>

            {/* 9:16 Reel Player Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full md:max-w-[440px] md:h-[95vh] aspect-[9/16] bg-black md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between"
            >
              {/* Background ambient video */}
              <video
                src={post.media_url}
                muted={isMuted}
                loop
                playsInline
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-50 scale-125 pointer-events-none"
              />

              {/* Main Vertical 9:16 Video */}
              <video
                ref={fullScreenVideoRef}
                src={post.media_url}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="relative z-10 w-full h-full object-cover cursor-pointer"
              />

              {/* Fullscreen Top Header */}
              <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-black border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>MEET REEL 9:16</span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              </div>

              {/* Center Play Indicator */}
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer pointer-events-auto"
              >
                {(!isPlaying || showPlayIcon) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl"
                  >
                    {isPlaying ? (
                      <Pause size={36} className="fill-white" />
                    ) : (
                      <Play size={36} className="fill-white translate-x-0.5" />
                    )}
                  </motion.div>
                )}
              </div>

              {/* Right Vertical Action Bar (Reels style) */}
              <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 pointer-events-auto">
                <button
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                      liked
                        ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/50 scale-110'
                        : 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart size={22} className={liked ? 'fill-current' : ''} />
                  </div>
                  <span className="text-[11px] font-bold drop-shadow">
                    {formatNumber(likesCount)}
                  </span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center backdrop-blur-md transition-all">
                    <MessageCircle size={22} />
                  </div>
                  <span className="text-[11px] font-bold drop-shadow">
                    {formatNumber(comments.length)}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center backdrop-blur-md transition-all">
                    {copied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={22} />}
                  </div>
                  <span className="text-[11px] font-bold drop-shadow">
                    {copied ? 'Copied' : formatNumber(post.shares_count)}
                  </span>
                </button>

                <button
                  onClick={() => setSaved(!saved)}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    saved
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                      : 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                  }`}>
                    <Bookmark size={20} className={saved ? 'fill-current' : ''} />
                  </div>
                  <span className="text-[11px] font-bold drop-shadow">Save</span>
                </button>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-0 inset-x-0 z-30 p-4 pt-16 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                <div className="max-w-[85%] space-y-2 pointer-events-auto">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={author.avatar_url ?? '/avatars/ian.jpg'}
                      alt={author.full_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1">
                        {author.full_name}
                        {author.is_verified && <BadgeCheck size={14} className="text-blue-400" />}
                      </h4>
                      <p className="text-xs text-slate-300">@{author.username}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal line-clamp-2">
                    {post.content}
                  </p>

                  {post.location && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold">
                      <MapPin size={11} className="text-blue-400" />
                      <span>{post.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-white/80 text-xs font-medium pt-1">
                    <Music size={12} className="text-blue-400 animate-spin" />
                    <span className="truncate">Ambient Nairobi Soundscape • Original Sound</span>
                  </div>
                </div>

                {/* Scrubber Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
