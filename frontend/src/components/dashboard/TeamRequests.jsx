import React from 'react'
import { Users, Check, X } from 'lucide-react'

// Placeholder data — will be connected to real API in a future phase
const PLACEHOLDER_REQUESTS = [
  { id: 1, name: 'Rohan Mehta',  avatar: 'R', project: 'ML Mini Project',  timeAgo: '2h ago',  color: 'bg-indigo-100 text-indigo-700' },
  { id: 2, name: 'Aisha Kapoor', avatar: 'A', project: 'Web Dev Hackathon', timeAgo: '5h ago',  color: 'bg-rose-100 text-rose-700'    },
  { id: 3, name: 'Dev Sharma',   avatar: 'D', project: 'IoT Expo',          timeAgo: '1d ago',  color: 'bg-amber-100 text-amber-700'  },
]

export default function TeamRequests() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Team Requests</h2>
            <p className="text-xs text-slate-400">{PLACEHOLDER_REQUESTS.length} pending</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-white bg-primary-600 rounded-full px-2 py-0.5">
          {PLACEHOLDER_REQUESTS.length}
        </span>
      </div>

      <div className="space-y-3">
        {PLACEHOLDER_REQUESTS.map(req => (
          <div key={req.id} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${req.color}`}>
              {req.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{req.name}</p>
              <p className="text-xs text-slate-400 truncate">{req.project} · {req.timeAgo}</p>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Accept">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Decline">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">Team management coming soon</p>
      </div>
    </div>
  )
}
