import React from 'react'
import { BookOpen, Calendar, ClipboardList, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react'

const STATS = [
  {
    id: 'courses',
    label: 'Enrolled Courses',
    value: '6',
    sub: '+1 this semester',
    trend: 'up',
    icon: BookOpen,
    gradient: 'from-indigo-500 to-indigo-600',
    lightBg: 'bg-indigo-50',
    lightText: 'text-indigo-600',
    ringColor: 'ring-indigo-100',
  },
  {
    id: 'classes',
    label: 'Classes Today',
    value: '3',
    sub: 'Next: 2:00 PM',
    trend: 'neutral',
    icon: Calendar,
    gradient: 'from-violet-500 to-violet-600',
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-600',
    ringColor: 'ring-violet-100',
  },
  {
    id: 'assignments',
    label: 'Pending Tasks',
    value: '4',
    sub: '2 due this week',
    trend: 'down',
    icon: ClipboardList,
    gradient: 'from-amber-500 to-amber-600',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-600',
    ringColor: 'ring-amber-100',
  },
  {
    id: 'messages',
    label: 'Unread Messages',
    value: '12',
    sub: '3 new today',
    trend: 'up',
    icon: MessageSquare,
    gradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-600',
    ringColor: 'ring-emerald-100',
  },
]

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map(stat => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className={`
              bg-white rounded-2xl p-5 border border-slate-100 shadow-sm
              hover:shadow-md transition-all duration-200 group cursor-default
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.lightBg} ring-4 ${stat.ringColor} transition-transform group-hover:scale-105`}>
                <Icon className={`w-5 h-5 ${stat.lightText}`} />
              </div>
              {stat.trend === 'up' && (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">Up</span>
                </div>
              )}
              {stat.trend === 'down' && (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-xs font-medium">Due</span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
