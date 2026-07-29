import React, { useState } from 'react'
import { useAnnouncements } from '../../hooks/useAnnouncements'
import AnnouncementCard from './AnnouncementCard'
import { AlertTriangle, RefreshCw, Megaphone } from 'lucide-react'

const FILTERS = [
  { label: 'All',        value: null         },
  { label: '🚨 Urgent',  value: 'URGENT'     },
  { label: 'College',    value: 'COLLEGE'    },
  { label: 'Department', value: 'DEPARTMENT' },
  { label: 'General',    value: 'GENERAL'    },
]

export default function AnnouncementsFeed() {
  const [activeFilter, setActiveFilter] = useState(null)
  const { announcements, loading, error, refetch } = useAnnouncements(activeFilter)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-xl">
              <Megaphone className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Announcements</h2>
              <p className="text-xs text-slate-400">
                {loading ? 'Loading...' : `${announcements.length} active notice${announcements.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100
                       transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={String(f.value)}
              onClick={() => setActiveFilter(f.value)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                transition-all duration-150
                ${activeFilter === f.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 bg-red-50 rounded-2xl mb-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">Failed to load announcements</p>
            <p className="text-sm text-slate-400 mb-4 max-w-xs">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white
                         text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border-l-4 border-l-slate-200 bg-white border border-slate-100 p-4 animate-pulse">
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-slate-100 rounded-lg" />
                  <div className="h-5 w-10 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Megaphone className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium text-slate-500">No announcements</p>
            <p className="text-sm mt-1">
              {activeFilter ? `No ${activeFilter.toLowerCase()} announcements right now.` : 'Nothing to show right now.'}
            </p>
          </div>
        )}

        {/* Announcement list */}
        {!loading && !error && announcements.length > 0 && (
          <div className="space-y-3">
            {announcements.map(a => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
