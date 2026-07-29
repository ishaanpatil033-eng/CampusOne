import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Calendar, ClipboardList,
  MessageSquare, GraduationCap, BarChart2
} from 'lucide-react'

const SHORTCUTS = [
  { label: 'Courses',     icon: BookOpen,      path: '/courses',     color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100' },
  { label: 'Schedule',    icon: Calendar,      path: '/schedule',    color: 'bg-violet-50 text-violet-600 hover:bg-violet-100 border-violet-100' },
  { label: 'Assignments', icon: ClipboardList, path: '/assignments', color: 'bg-amber-50  text-amber-600  hover:bg-amber-100  border-amber-100'  },
  { label: 'Messages',    icon: MessageSquare, path: '/messages',    color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100' },
  { label: 'Results',     icon: GraduationCap, path: '/results',     color: 'bg-rose-50   text-rose-600   hover:bg-rose-100   border-rose-100'   },
  { label: 'Analytics',   icon: BarChart2,     path: '/analytics',  color: 'bg-sky-50    text-sky-600    hover:bg-sky-100    border-sky-100'    },
]

export default function QuickShortcuts() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4">Quick Access</h2>
      <div className="grid grid-cols-3 gap-3">
        {SHORTCUTS.map(({ label, icon: Icon, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-xl border
              transition-all duration-200 hover:scale-105 hover:shadow-sm
              ${color}
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
