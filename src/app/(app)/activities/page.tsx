'use client'

import { useState } from 'react'
import { DEMO_ACTIVITIES } from '@/lib/demo-data'
import { MapPin, Users, Check } from 'lucide-react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

export default function ActivitiesPage() {
  const [joinedActivities, setJoinedActivities] = useState<string[]>([])

  function toggleJoin(id: string) {
    setJoinedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Activities</h1>
        <p className="text-sm font-medium text-slate-600">Things to do together with people who share your interests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_ACTIVITIES.map((activity) => {
          const isJoined = joinedActivities.includes(activity.id)

          return (
            <div key={activity.id} className="meet-card p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <CategoryIcon name={activity.category} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{activity.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{activity.title}</h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mb-3">{activity.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-blue-600" />
                      <span>{activity.participants_count + (isJoined ? 1 : 0)} joined</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-600" />
                      <span>{activity.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleJoin(activity.id)}
                className={`mt-4 w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  isJoined
                    ? 'bg-blue-100 border border-blue-300 text-blue-800 font-bold'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {isJoined ? (
                  <>
                    <Check size={14} /> You have joined
                  </>
                ) : (
                  'Join Activity'
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
