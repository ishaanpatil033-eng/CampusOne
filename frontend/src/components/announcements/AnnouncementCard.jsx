import React, { useState } from 'react'
import { Pin, ChevronDown, ChevronUp, AlertTriangle, Building2, Layers, Info } from 'lucide-react'

const TYPE_CONFIG = {
  URGENT: {
    badge:       'bg-red-100 text-red-700 border border-red-200',
    border:      'border-l-4 border-l-red-500',
    bg:          'bg-red-50/40',
    icon:        AlertTriangle,
    iconColor:   'text-red-500',
    label:       'Urgent',
    dot:         true,   // animated pulse dot
  },
  COLLEGE: {
    badge:       'bg-indigo-100 text-indigo-700 border border-indigo-200',
    border:      'border-l-4 border-l-indigo-500',
    bg:          '',
    icon:        Building2,
    iconColor:   'text-indigo-500',
    label:       'College',
    dot:         false,
  },
  DEPARTMENT: {
    badge:       'bg-violet-100 text-violet-700 border border-violet-200',
    border:      'border-l-4 border-l-violet-500',
    bg:          '',
    icon:        Layers,
    iconColor:   'text-violet-500',
    label:       'Department',
    dot:         false,
  },
  GENERAL: {
    badge:       'bg-slate-100 text-slate-600 border border-slate-200',
    border:      'border-l-4 border-l-slate-300',
    bg:          '',
    icon:        Info,
    iconColor:   'text-slate-400',
    label:       'General',
    dot:         false,
  },
}

export default function AnnouncementCard({ announcement }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = TYPE_CONFIG[announcement.type] || TYPE_CONFIG.GENERAL
  const Icon = cfg.icon

  const isLong = announcement.content.length > 180
  const preview = isLong && !expanded
    ? announcement.content.slice(0, 180) + '...'
    : announcement.content

  return (
    <div
      className={`
        rounded-xl bg-white shadow-sm border border-slate-100
        ${cfg.border} ${cfg.bg}
        transition-shadow duration-200 hover:shadow-md
      `}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${cfg.badge}`}>
              {cfg.dot && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
              )}
              <Icon className="w-3 h-3" />
              {cfg.label}
            </span>

            {/* Department tag */}
            {announcement.department && (
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                {announcement.department}
              </span>
            )}

            {/* Pinned indicator */}
            {announcement.isPinned && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
          </div>

          {/* Timestamp */}
          <time className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
            {formatRelative(announcement.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1.5">
          {announcement.title}
        </h3>

        {/* Content */}
        <p className="text-sm text-slate-600 leading-relaxed">{preview}</p>

        {/* Expand / Collapse */}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium
                       flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Read more</>
            )}
          </button>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-bold" style={{ fontSize: '9px' }}>
                {announcement.author ? announcement.author[0].toUpperCase() : 'C'}
              </span>
            </div>
            <span className="text-xs text-slate-500">{announcement.author || 'Admin'}</span>
          </div>
          {announcement.expiresAt && (
            <span className="text-xs text-slate-400">
              Expires {formatDate(announcement.expiresAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function formatRelative(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
