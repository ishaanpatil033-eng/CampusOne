import React, { useState } from 'react'
import { Users, Mail, ToggleLeft, ToggleRight, Clock } from 'lucide-react'
import { toggleTeamRequestStatus } from '../../services/teamRequestService'
import { useAuth } from '../../hooks/useAuth'

const PROJECT_TYPE_CONFIG = {
  HACKATHON:      { label: 'Hackathon',     bg: 'bg-amber-100   text-amber-700   border-amber-200'   },
  RESEARCH:       { label: 'Research',      bg: 'bg-indigo-100  text-indigo-700  border-indigo-200'  },
  COURSE_PROJECT: { label: 'Course Project',bg: 'bg-blue-100    text-blue-700    border-blue-200'    },
  STARTUP:        { label: 'Startup',       bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  OTHER:          { label: 'Project',       bg: 'bg-slate-100   text-slate-600   border-slate-200'   },
}

const SKILL_COLORS = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-cyan-50   text-cyan-700   border-cyan-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-rose-50   text-rose-700   border-rose-100',
  'bg-amber-50  text-amber-700  border-amber-100',
]

export default function TeamRequestCard({ request, onUpdate }) {
  const { firebaseUser } = useAuth()
  const [toggling, setToggling] = useState(false)

  const isOwner  = firebaseUser?.uid === request.postedByUid
  const isOpen   = request.status === 'OPEN'
  const ptConfig = PROJECT_TYPE_CONFIG[request.projectType] || PROJECT_TYPE_CONFIG.OTHER
  const spotsLeft = (request.teamSize || 0) - (request.currentSize || 0)

  async function handleToggle() {
    setToggling(true)
    try {
      const updated = await toggleTeamRequestStatus(request.id)
      onUpdate?.(updated)
    } catch (err) {
      console.error('Toggle failed:', err)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className={`
      bg-white rounded-2xl border shadow-sm p-5
      hover:shadow-md transition-all duration-200
      ${isOpen ? 'border-slate-100' : 'border-slate-200 opacity-80'}
    `}>
      {/* Header: type badge + status + time */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${ptConfig.bg}`}>
            {ptConfig.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
            isOpen
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100  text-slate-500   border-slate-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
          <Clock className="w-3 h-3" />
          {formatRelative(request.createdAt)}
        </span>
      </div>

      {/* Title & description */}
      <h3 className="text-sm font-bold text-slate-800 leading-snug mb-2">{request.title}</h3>
      {request.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{request.description}</p>
      )}

      {/* Skills */}
      {request.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {[...request.requiredSkills].map((skill, i) => (
            <span
              key={skill}
              className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {/* Team size */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" />
          <span>
            {request.currentSize}/{request.teamSize} members
            {isOpen && spotsLeft > 0 && (
              <span className="ml-1.5 text-emerald-600 font-medium">· {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Owner toggle */}
          {isOwner && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              title={isOpen ? 'Close request' : 'Reopen request'}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                isOpen
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {toggling
                ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                : isOpen ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />
              }
              {isOpen ? 'Close' : 'Reopen'}
            </button>
          )}

          {/* Contact */}
          {request.contactInfo && isOpen && (
            <a
              href={`mailto:${request.contactInfo}`}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary-600 text-white
                         font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Contact
            </a>
          )}
        </div>
      </div>

      {/* Posted by */}
      <p className="text-xs text-slate-400 mt-2">Posted by {request.postedByName || 'Anonymous'}</p>
    </div>
  )
}

function formatRelative(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
