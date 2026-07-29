import React from 'react'
import { Calendar, Clock } from 'lucide-react'

// Placeholder events — will be replaced by API data in a future phase
const PLACEHOLDER_EVENTS = [
  {
    id: 1,
    title: 'Data Structures Lecture',
    time: '09:00 AM',
    room: 'Room 204',
    color: 'bg-indigo-500',
  },
  {
    id: 2,
    title: 'Operating Systems Lab',
    time: '11:30 AM',
    room: 'Lab 3B',
    color: 'bg-violet-500',
  },
  {
    id: 3,
    title: 'DBMS Tutorial',
    time: '02:00 PM',
    room: 'Room 101',
    color: 'bg-amber-500',
  },
]

export default function UpcomingEvents() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-50 rounded-xl">
            <Calendar className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Today's Schedule</h2>
            <p className="text-xs text-slate-400">{today}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {PLACEHOLDER_EVENTS.map(event => (
          <div key={event.id} className="flex items-center gap-3 group">
            <div className={`w-1 h-10 rounded-full ${event.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{event.title}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {event.time} · {event.room}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">Full schedule coming soon</p>
      </div>
    </div>
  )
}
