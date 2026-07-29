import React, { useState, useMemo } from 'react'
import { Users, Plus, RefreshCw, AlertTriangle, Search } from 'lucide-react'
import { useTeamRequests } from '../../hooks/useTeamRequests'
import { toggleTeamRequestStatus } from '../../services/teamRequestService'
import TeamRequestCard from '../../components/teamup/TeamRequestCard'
import SkillFilter     from '../../components/teamup/SkillFilter'
import PostRequestModal from '../../components/teamup/PostRequestModal'

const STATUS_TABS = [
  { label: 'All',    value: null     },
  { label: 'Open',   value: 'OPEN'   },
  { label: 'Closed', value: 'CLOSED' },
]

export default function TeamUp() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [statusFilter, setStatusFilter]   = useState(null)
  const [searchQuery, setSearchQuery]     = useState('')
  const [showModal, setShowModal]         = useState(false)

  const { requests, loading, error, refetch } = useTeamRequests({
    skill: selectedSkill,
    status: statusFilter,
  })

  // Client-side search on top of server-side skill filter
  const filtered = useMemo(() => {
    if (!searchQuery) return requests
    const q = searchQuery.toLowerCase()
    return requests.filter(r =>
      r.title.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    )
  }, [requests, searchQuery])

  function handleUpdate(updatedRequest) {
    refetch() // Re-fetch to ensure consistency
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">TeamUp</h1>
            <p className="text-slate-400 text-sm">Find your project team or post a request</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-emerald-600
                     hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl
                     transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Post a Request
        </button>
      </div>

      {/* Skill filter */}
      <SkillFilter selectedSkill={selectedSkill} onSkillSelect={setSelectedSkill} />

      {/* Status tabs + search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 w-fit">
          {STATUS_TABS.map(tab => (
            <button
              key={String(tab.value)}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${ statusFilter === tab.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-52"
            />
          </div>
          <button onClick={refetch} disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400
                       hover:text-slate-600 hover:border-slate-300 transition-colors disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> request{filtered.length !== 1 ? 's' : ''}
          {selectedSkill && <span className="text-primary-600 font-medium"> · Skill: {selectedSkill}</span>}
          {statusFilter  && <span className="text-primary-600 font-medium"> · {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} only</span>}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <p className="font-semibold text-slate-700 mb-1">Failed to load team requests</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 shadow-sm h-48" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
          <Users className="w-12 h-12 text-slate-300 mb-3" />
          <p className="font-semibold text-slate-600">No team requests found</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Try adjusting your filters or search query, or be the first to post a new request!
          </p>
          <button onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
            Post a Request
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(req => (
            <TeamRequestCard key={req.id} request={req} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PostRequestModal onClose={() => setShowModal(false)} onSuccess={refetch} />
      )}
    </div>
  )
}
