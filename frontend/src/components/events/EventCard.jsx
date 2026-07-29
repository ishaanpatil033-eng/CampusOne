import React, { useState } from 'react'
import { Calendar, MapPin, Users, Clock, CheckCircle, Loader } from 'lucide-react'
import { registerForEvent, unregisterFromEvent } from '../../services/eventService'

const CATEGORY_CONFIG = {
  TECHNICAL: { label: 'Technical', bg: 'bg-indigo-100 text-indigo-700 border-indigo-200',  gradient: 'from-indigo-500 to-indigo-700'  },
  ACADEMIC:  { label: 'Academic',  bg: 'bg-blue-100   text-blue-700   border-blue-200',    gradient: 'from-blue-500 to-blue-700'      },
  CULTURAL:  { label: 'Cultural',  bg: 'bg-violet-100 text-violet-700 border-violet-200',  gradient: 'from-violet-500 to-purple-700'  },
  SPORTS:    { label: 'Sports',    bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',gradient: 'from-emerald-500 to-teal-700'  },
  SOCIAL:    { label: 'Social',    bg: 'bg-rose-100   text-rose-700   border-rose-200',    gradient: 'from-rose-500 to-pink-700'     },
  OTHER:     { label: 'General',   bg: 'bg-slate-100  text-slate-600  border-slate-200',   gradient: 'from-slate-500 to-slate-700'   },
}

export default function EventCard({ event, onUpdate }) {
  const [actionLoading, setActionLoading] = useState(false)
  const cfg = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.OTHER

  const spotsLeft = event.maxAttendees
    ? event.maxAttendees - event.currentAttendees
    : null

  async function handleRegisterToggle() {
    setActionLoading(true)
    try {
      let updated
      if (event.registered) {
        updated = await unregisterFromEvent(event.id)
      } else {
        updated = await registerForEvent(event.id)
      }
      onUpdate?.(updated)
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      alert(msg || 'Action failed. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const isPast = event.status === 'COMPLETED' || event.status === 'CANCELLED'

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
      hover:shadow-lg transition-all duration-300 flex flex-col
      ${isPast ? 'opacity-70' : ''}`}>

      {/* Image / gradient header */}
      <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${cfg.gradient} flex-shrink-0`}>
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title}
            className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl opacity-30 select-none">
              {event.category === 'TECHNICAL' ? '💻' :
               event.category === 'SPORTS'   ? '🏆' :
               event.category === 'CULTURAL' ? '🎭' :
               event.category === 'ACADEMIC' ? '📚' :
               event.category === 'SOCIAL'   ? '🤝' : '🎉'}
            </span>
          </div>
        )}
        {/* Category & status badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border bg-white/90 backdrop-blur-sm ${cfg.bg}`}>
            {cfg.label}
          </span>
          {event.status === 'UPCOMING' && event.full && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-red-500 text-white">
              Full
            </span>
          )}
          {event.status === 'CANCELLED' && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-red-500 text-white">
              Cancelled
            </span>
          )}
        </div>
        {/* Registered checkmark */}
        {event.registered && (
          <div className="absolute top-3 right-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 leading-snug mb-2 line-clamp-2 text-sm sm:text-base">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3 flex-1">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-primary-500" />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>
          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {/* Attendees */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5 flex-shrink-0 text-primary-500" />
            <span>
              {event.currentAttendees} registered
              {event.maxAttendees && (
                <>
                  <span className="mx-1">/</span>
                  <span>{event.maxAttendees} max</span>
                  {spotsLeft > 0 && !event.full && (
                    <span className="ml-1.5 text-emerald-600 font-medium">
                      · {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Register button */}
        {!isPast && (
          <button
            onClick={handleRegisterToggle}
            disabled={actionLoading || (event.full && !event.registered)}
            className={`
              w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              flex items-center justify-center gap-2 mt-2
              ${event.registered
                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100'
                : event.full
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20'
              }
              disabled:opacity-60
            `}
          >
            {actionLoading
              ? <Loader className="w-4 h-4 animate-spin" />
              : event.registered
              ? <><CheckCircle className="w-4 h-4" /> Registered</>  
              : event.full
              ? 'Event Full'
              : 'Register →'
            }
          </button>
        )}
        {isPast && (
          <div className="mt-2 w-full py-2.5 rounded-xl bg-slate-50 text-slate-400 text-sm font-medium text-center">
            {event.status === 'CANCELLED' ? 'Event Cancelled' : 'Event Completed'}
          </div>
        )}
      </div>
    </div>
  )
}

function formatEventDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short'
  }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
