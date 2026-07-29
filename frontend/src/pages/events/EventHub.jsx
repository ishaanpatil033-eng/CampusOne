import React, { useState, useCallback } from 'react'
import { CalendarDays, Plus, RefreshCw, AlertTriangle } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/events/EventCard'
import EventRegistrationModal from '../../components/events/EventRegistrationModal'
import CreateEventModal from '../../components/events/CreateEventModal'

const CATEGORY_FILTERS = [
  { label: 'All',       value: null          },
  { label: '💻 Technical', value: 'TECHNICAL' },
  { label: '📚 Academic',  value: 'ACADEMIC'  },
  { label: '🎭 Cultural',  value: 'CULTURAL'  },
  { label: '🏆 Sports',    value: 'SPORTS'    },
  { label: '🤝 Social',    value: 'SOCIAL'    },
]

export default function EventHub() {
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [ticketEvent, setTicketEvent]         = useState(null)

  const { events, loading, error, refetch } = useEvents(categoryFilter)

  // When a card's register/unregister is done, update in-place
  const handleEventUpdate = useCallback((updatedEvent) => {
    // If the user just registered, show the ticket QR
    if (updatedEvent.registered) {
      setTicketEvent(updatedEvent)
    }
    refetch()
  }, [refetch])

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-50 rounded-2xl">
            <CalendarDays className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Event Hub</h1>
            <p className="text-slate-400 text-sm">
              {loading ? 'Loading...' : `${events.length} upcoming event${events.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5
                     bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold
                     rounded-xl transition-all shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Category filters — horizontal scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={String(f.value)}
            onClick={() => setCategoryFilter(f.value)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0
              transition-all duration-150
              ${categoryFilter === f.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            {f.label}
          </button>
        ))}
        <button onClick={refetch} disabled={loading}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400
                     hover:text-slate-600 transition-colors disabled:opacity-40 flex-shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <p className="font-semibold text-slate-700 mb-1">Failed to load events</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {/* Loading skeletons — 2-col on mobile, 3-col on desktop */}
      {loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="h-36 sm:h-40 bg-slate-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-9 bg-slate-100 rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <CalendarDays className="w-12 h-12 text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No events found</p>
          <p className="text-sm text-slate-400 mt-1">
            {categoryFilter ? `No ${categoryFilter.toLowerCase()} events right now.` : 'No upcoming events.'}
          </p>
          <button onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
            Create an Event
          </button>
        </div>
      )}

      {/* Event grid — 2 cols on mobile, 3 on desktop */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} onUpdate={handleEventUpdate} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} onSuccess={refetch} />
      )}
      {ticketEvent && (
        <EventRegistrationModal event={ticketEvent} onClose={() => setTicketEvent(null)} />
      )}
    </div>
  )
}
