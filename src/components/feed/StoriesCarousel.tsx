'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, MapPin, ChevronRight, ChevronLeft } from 'lucide-react'

interface StoryItem {
  id: string
  name: string
  handle: string
  avatar: string
  previewText: string
  location: string
  time: string
  hasUnseen: boolean
}

const STORIES: StoryItem[] = [
  {
    id: 's1',
    name: 'Amara Wanjiku',
    handle: '@amara.wanjiku',
    avatar: '/avatars/amara.jpg',
    previewText: 'Design Sprint at iHub Nairobi Senteu Plaza! Mapping low-bandwidth UI patterns.',
    location: 'Kilimani, Nairobi',
    time: '25m ago',
    hasUnseen: true,
  },
  {
    id: 's2',
    name: 'Kwame Mensah',
    handle: '@kwame.mensah',
    avatar: '/avatars/kwame.jpg',
    previewText: 'Sunrise light filtering through the Karura indigenous canopy. 24 photographers.',
    location: 'Karura Forest Reserve',
    time: '45m ago',
    hasUnseen: true,
  },
  {
    id: 's3',
    name: 'Sadia Ibrahim',
    handle: '@sadia.ibrahim',
    avatar: '/avatars/sadia.jpg',
    previewText: 'PayAfrica crossed 100k cross-border merchants today across East Africa!',
    location: 'Upper Hill, Nairobi',
    time: '1h ago',
    hasUnseen: true,
  },
  {
    id: 's4',
    name: 'David Kamau',
    handle: '@david.kamau',
    avatar: '/avatars/david.jpg',
    previewText: 'Handling 30k peak TPS on Kubernetes at Safaricom HQ.',
    location: 'Ngong Road, Nairobi',
    time: '2h ago',
    hasUnseen: true,
  },
  {
    id: 's5',
    name: 'Aisha Mwangi',
    handle: '@aisha.mwangi',
    avatar: '/avatars/aisha.jpg',
    previewText: 'GoDown Arts live rehearsal with Nyatiti strings & deep bass.',
    location: 'Industrial Area, Nairobi',
    time: '3h ago',
    hasUnseen: false,
  },
  {
    id: 's6',
    name: 'Brian Kipkemboi',
    handle: '@brian.kipkemboi',
    avatar: '/avatars/brian.jpg',
    previewText: '2,460m elevation on the Ngong Hills ridge line. Pure bliss.',
    location: 'Ngong Hills, Kajiado',
    time: '4h ago',
    hasUnseen: false,
  },
  {
    id: 's7',
    name: 'Juma Omondi',
    handle: '@juma.omondi',
    avatar: '/avatars/juma.jpg',
    previewText: 'Washed Nyeri SL28 cupping in Karen. Floral jasmine notes.',
    location: 'Karen, Nairobi',
    time: '5h ago',
    hasUnseen: false,
  },
]

export function StoriesCarousel() {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null)
  const [storyIndex, setStoryIndex] = useState(0)

  function openStory(index: number) {
    setStoryIndex(index)
    setActiveStory(STORIES[index])
  }

  function nextStory() {
    if (storyIndex < STORIES.length - 1) {
      setStoryIndex(storyIndex + 1)
      setActiveStory(STORIES[storyIndex + 1])
    } else {
      setActiveStory(null)
    }
  }

  function prevStory() {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1)
      setActiveStory(STORIES[storyIndex - 1])
    }
  }

  return (
    <>
      {/* Stories list */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* Your Story */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 border-2 border-dashed border-blue-400 group-hover:border-blue-600 transition-colors">
              <img
                src="/avatars/ian.jpg"
                alt="Your Story"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white">
              <Plus size={13} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 max-w-[68px] truncate">
            Your Story
          </span>
        </div>

        {/* Connection Stories */}
        {STORIES.map((story, i) => (
          <div
            key={story.id}
            onClick={() => openStory(i)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                story.hasUnseen
                  ? 'bg-blue-600 ring-2 ring-blue-600/30'
                  : 'bg-slate-200'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-800 max-w-[68px] truncate text-center">
              {story.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm h-[540px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between p-6 text-white border border-slate-700"
            >
              {/* Progress Bar */}
              <div className="absolute top-3 left-4 right-4 h-1 bg-white/25 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  onAnimationComplete={nextStory}
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.avatar}
                    alt={activeStory.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <p className="font-bold text-sm leading-tight text-white">
                      {activeStory.name}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <MapPin size={10} className="text-blue-400" />
                      <span>{activeStory.location}</span>
                      <span>•</span>
                      <span>{activeStory.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Story Content Card */}
              <div className="my-auto py-8">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/15">
                  <p className="text-lg font-bold leading-relaxed text-white">
                    &quot;{activeStory.previewText}&quot;
                  </p>
                  <span className="inline-block mt-4 text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white">
                    Live from {activeStory.location.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Footer navigation */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={prevStory}
                  disabled={storyIndex === 0}
                  className="flex items-center gap-1 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span>
                  {storyIndex + 1} of {STORIES.length}
                </span>
                <button
                  onClick={nextStory}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
