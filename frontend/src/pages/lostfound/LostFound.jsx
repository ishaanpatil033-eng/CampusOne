import React, { useState, useCallback, useMemo } from 'react'
import { PackageSearch, Plus, RefreshCw, AlertTriangle, Search } from 'lucide-react'
import { useLostFound } from '../../hooks/useLostFound'
import LostFoundCard from '../../components/lostfound/LostFoundCard'
import ReportItemModal from '../../components/lostfound/ReportItemModal'

const TYPE_TABS = [
  { label: 'All',   value: null    },
  { label: '😟 Lost',   value: 'LOST'  },
  { label: '😊 Found',  value: 'FOUND' },
]

export default function LostFound() {
  const [typeFilter, setTypeFilter]   = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQ, setDebouncedQ]   = useState('')
  const [showModal, setShowModal]     = useState(false)

  // Simple debounce for search
  const handleSearch = useCallback((val) => {
    setSearchQuery(val)
    clearTimeout(window._lfSearchTimer)
    window._lfSearchTimer = setTimeout(() => setDebouncedQ(val), 400)
  }, [])

  const { items, loading, error, refetch } = useLostFound({
    type: typeFilter,
    keyword: debouncedQ || null,
  })

  const handleItemUpdate = useCallback(() => { refetch() }, [refetch])

  // Split active / claimed
  const activeItems  = useMemo(() => items.filter(i => i.status === 'ACTIVE'),  [items])
  const claimedItems = useMemo(() => items.filter(i => i.status === 'CLAIMED'), [items])

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-2xl">
            <PackageSearch className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lost &amp; Found</h1>
            <p className="text-slate-400 text-sm">
              {loading ? 'Loading...' : `${activeItems.length} active report${activeItems.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5
                     bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold
                     rounded-xl transition-all shadow-lg shadow-rose-500/20"
        >
          <Plus className="w-4 h-4" /> Report Item
        </button>
      </div>

      {/* Search + Type tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, location, description..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
          {TYPE_TABS.map(tab => (
            <button
              key={String(tab.value)}
              onClick={() => setTypeFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                typeFilter === tab.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={refetch} disabled={loading}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400
                     hover:text-slate-600 transition-colors disabled:opacity-40 flex-shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <p className="font-semibold text-slate-700 mb-1">Failed to load items</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-xl hover:bg-primary-700">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {/* Loading skeletons — 2-col mobile, 3-col md, 4-col xl */}
      {loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="h-28 sm:h-32 bg-slate-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && activeItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <PackageSearch className="w-12 h-12 text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No items reported</p>
          <p className="text-sm text-slate-400 mt-1">
            {typeFilter ? `No ${typeFilter.toLowerCase()} items found.` : 'No active reports right now.'}
          </p>
          <button onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-xl hover:bg-rose-600">
            Report an Item
          </button>
        </div>
      )}

      {/* Active items */}
      {!loading && !error && activeItems.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {activeItems.map(item => (
              <LostFoundCard key={item.id} item={item} onUpdate={handleItemUpdate} />
            ))}
          </div>
        </>
      )}

      {/* Claimed / resolved items section */}
      {!loading && !error && claimedItems.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Resolved</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {claimedItems.map(item => (
              <LostFoundCard key={item.id} item={item} onUpdate={handleItemUpdate} />
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <ReportItemModal onClose={() => setShowModal(false)} onSuccess={refetch} />
      )}
    </div>
  )
}
