'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react'
import { DEMO_PROFILES } from '@/lib/demo-data'
import { formatRelativeTime } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sent: boolean
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', content: 'Hey! Are you coming to the tech meetup this weekend?', sent: false, timestamp: new Date(Date.now() - 30 * 60000) },
  { id: '2', content: 'Yes definitely! Looking forward to it.', sent: true, timestamp: new Date(Date.now() - 25 * 60000) },
  { id: '3', content: 'Great! I heard there are some amazing speakers this time. Should be really inspiring.', sent: false, timestamp: new Date(Date.now() - 20 * 60000) },
  { id: '4', content: "Absolutely. I'm particularly excited about the AI session.", sent: true, timestamp: new Date(Date.now() - 15 * 60000) },
  { id: '5', content: "Same! Let's grab coffee before it starts and catch up?", sent: false, timestamp: new Date(Date.now() - 5 * 60000) },
]

export default function ConversationPage() {
  const params = useParams()
  const convId = params.conversationId as string
  
  // Get profile based on conv id
  const profileIndex = parseInt(convId?.replace('conv-', '') || '1') - 1
  const profile = DEMO_PROFILES[profileIndex] ?? DEMO_PROFILES[0]

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!input.trim()) return
    const msg: Message = {
      id: `msg-${Date.now()}`,
      content: input,
      sent: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
    setInput('')

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          content: "That sounds great! Let's make it happen.",
          sent: false,
          timestamp: new Date(),
        },
      ])
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] lg:h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 flex-shrink-0 bg-white">
        <Link href="/messages" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <Link href={`/people/${profile.username}`} className="flex items-center gap-3 flex-1 min-w-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {profile.first_name[0]}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{profile.full_name}</p>
            <p className="text-xs text-blue-600 font-medium">Active now</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <Phone size={18} className="text-slate-500" />
          </button>
          <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <Video size={18} className="text-slate-500" />
          </button>
          <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <MoreVertical size={18} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
        {messages.map((msg, i) => {
          const showTime = i === 0 || (messages[i].timestamp.getTime() - messages[i-1].timestamp.getTime() > 5 * 60000)
          return (
            <div key={msg.id}>
              {showTime && (
                <p className="text-[10px] text-slate-400 text-center my-3">{formatRelativeTime(msg.timestamp.toISOString())}</p>
              )}
              <motion.div
                className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={msg.sent ? 'chat-sent' : 'chat-received'}>
                  {msg.content}
                </div>
              </motion.div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 lg:pb-6 pt-3 border-t border-slate-200 flex-shrink-0 bg-white">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="meet-input flex-1 py-3 text-sm"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm"
            whileTap={{ scale: 0.95 }}
          >
            <Send size={16} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
