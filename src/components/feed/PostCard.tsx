'use client'

import { useState } from 'react'
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
    </motion.article>
  )
}
