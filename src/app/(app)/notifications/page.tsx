'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, UserPlus, Heart, MessageCircle, Calendar, Users, Check } from 'lucide-react'
import { DEMO_NOTIFICATIONS } from '@/lib/demo-data'
import { formatRelativeTime } from '@/lib/utils'

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  new_follower: <UserPlus size={16} className="text-blue-600" />,
  post_liked: <Heart size={16} className="text-blue-600" />,
  post_commented: <MessageCircle size={16} className="text-blue-600" />,
  event_joined: <Calendar size={16} className="text-blue-600" />,
  new_connection: <UserPlus size={16} className="text-blue-600" />,
  connection_accepted: <Check size={16} className="text-emerald-600" />,
  community_invitation: <Users size={16} className="text-blue-600" />,
  message: <MessageCircle size={16} className="text-blue-600" />,
  mention: <Bell size={16} className="text-blue-600" />,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unread = notifications.filter((n) => !n.is_read).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-white min-h-[calc(100vh-56px)] lg:min-h-screen">
      {/* Header */}
      <div className="sticky top-14 lg:top-0 z-10 bg-white border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900">Notifications</h1>
            {unread > 0 && <p className="text-xs font-semibold text-slate-600">{unread} unread updates</p>}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="divide-y divide-slate-100">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            className={`flex items-start gap-3 px-3 py-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/60' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Actor avatar */}
            <div className="relative flex-shrink-0">
              {notif.actor?.avatar_url ? (
                <img src={notif.actor.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {notif.actor?.full_name?.[0] ?? '?'}
                </div>
              )}
              {/* Type icon */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                {NOTIFICATION_ICONS[notif.type] ?? <Bell size={10} className="text-blue-600" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${!notif.is_read ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium'}`}>
                {notif.body}
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">{formatRelativeTime(notif.created_at)}</p>
            </div>

            {/* Unread dot */}
            {!notif.is_read && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
            )}
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-500">
            <Bell size={24} />
          </div>
          <p className="text-slate-800 text-sm font-bold">You are all caught up.</p>
          <p className="text-slate-600 text-xs font-medium mt-1">No new notifications.</p>
        </div>
      )}
    </div>
  )
}
