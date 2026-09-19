'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Loader2 } from 'lucide-react'
import { MEET_AI_SUGGESTIONS } from '@/services/ai/ai.service'
import type { AIMessage } from '@/types'

export default function MeetAIPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm MEET AI — your guide to discovering people, places and experiences. What are you looking for today?",
      timestamp: new Date(),
      isDemo: true,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { aiService } = await import('@/services/ai/ai.service')
      const history = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))
      const response = await aiService.chat(history)
      setIsDemoMode(response.isDemo)

      const assistantMsg: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        isDemo: response.isDemo,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
          isDemo: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] lg:h-screen max-w-3xl mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="font-black text-slate-900">MEET AI</h1>
          <p className="text-xs text-slate-600 font-medium">Your guide to people, places and experiences</p>
        </div>
        {isDemoMode && (
          <div className="ml-auto px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
            Demo Mode
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1 text-blue-600">
                  <Sparkles size={14} />
                </div>
              )}
              <div className="max-w-[85%]">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'chat-sent'
                      : 'chat-received'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.isDemo && msg.role === 'assistant' && (
                  <p className="text-[11px] text-slate-600 font-medium mt-1 ml-1 flex items-center gap-1">
                    <Sparkles size={11} className="text-blue-600" /> Demo response — connect OpenAI for real AI
                  </p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1 text-white">
                  <User size={14} />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Sparkles size={14} />
              </div>
              <div className="chat-received flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span className="text-slate-700 font-medium">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          {MEET_AI_SUGGESTIONS.slice(0, 4).map((suggestion) => (
            <motion.button
              key={suggestion}
              onClick={() => sendMessage(suggestion)}
              className="px-3.5 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-800 font-semibold hover:text-blue-600 hover:border-blue-400 shadow-sm whitespace-nowrap transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 lg:pb-6 pt-2 border-t border-slate-200 bg-white flex-shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="Ask MEET AI anything..."
              rows={1}
              className="meet-input resize-none py-3 pr-4"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <motion.button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-sm"
            whileTap={{ scale: 0.95 }}
          >
            <Send size={16} className="text-white" />
          </motion.button>
        </div>
        <p className="text-[11px] text-slate-500 font-medium mt-2 text-center">
          MEET AI can make mistakes. Always verify event details directly.
        </p>
      </div>
    </div>
  )
}
