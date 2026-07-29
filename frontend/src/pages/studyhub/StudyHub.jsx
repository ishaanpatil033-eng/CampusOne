import React, { useState, useMemo } from 'react'
import { BookMarked, LayoutGrid, List, Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react'
import { useStudyMaterials } from '../../hooks/useStudyMaterials'
import SubjectFolder    from '../../components/studyhub/SubjectFolder'
import MaterialCard     from '../../components/studyhub/MaterialCard'
import UploadMaterialModal from '../../components/studyhub/UploadMaterialModal'

const ALL_SUBJECTS = [
  'Computer Science', 'Mathematics', 'Physics',
  'Chemistry', 'English', 'Economics'
]

export default function StudyHub() {
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [viewMode, setViewMode]               = useState('grid')
  const [searchQuery, setSearchQuery]         = useState('')
  const [showModal, setShowModal]             = useState(false)

  const { materials, loading, error, refetch } = useStudyMaterials()

  // Count per subject from all fetched materials
  const subjectCounts = useMemo(() => {
    return materials.reduce((acc, m) => {
      if (m.subject) acc[m.subject] = (acc[m.subject] || 0) + 1
      return acc
    }, {})
  }, [materials])

  // Filter client-side
  const filtered = useMemo(() => {
    return materials.filter(m => {
      const matchesSubject = !selectedSubject || m.subject === selectedSubject
      const matchesSearch  = !searchQuery ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSubject && matchesSearch
    })
  }, [materials, selectedSubject, searchQuery])

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-2xl">
            <BookMarked className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Study Hub</h1>
            <p className="text-slate-400 text-sm">Shared notes, materials &amp; resources</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-primary-600
                     hover:bg-primary-700 text-white text-sm font-semibold rounded-xl
                     transition-all duration-200 shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" /> Share Resource
        </button>
      </div>

      {/* Subject folders */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Subjects</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* "All" folder */}
          <button
            onClick={() => setSelectedSubject(null)}
            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
              ${!selectedSubject
                ? 'ring-2 ring-primary-500 bg-primary-100 border-transparent'
                : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
          >
            <div className="text-2xl mb-2">🗂️</div>
            <p className={`text-sm font-semibold ${!selectedSubject ? 'text-primary-700' : 'text-slate-700'}`}>All</p>
            <p className="text-xs text-slate-400 mt-1">{materials.length} total</p>
          </button>

          {ALL_SUBJECTS.map(subject => (
            <SubjectFolder
              key={subject}
              subject={subject}
              count={subjectCounts[subject] || 0}
              isSelected={selectedSubject === subject}
              onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
            />
          ))}
        </div>
      </div>

      {/* Materials section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-52"
              />
            </div>
            <p className="text-sm text-slate-500">
              {loading ? 'Loading...' : `${filtered.length} material${filtered.length !== 1 ? 's' : ''}`}
              {selectedSubject && <span className="ml-1 text-primary-600 font-medium">in {selectedSubject}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refetch} disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
              <p className="font-semibold text-slate-700 mb-1">Failed to load materials</p>
              <p className="text-sm text-slate-400 mb-4">{error}</p>
              <button onClick={refetch}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700">
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && !error && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  {viewMode === 'grid'
                    ? <div className="bg-slate-100 rounded-2xl h-44" />
                    : <div className="bg-slate-100 rounded-xl h-16" />
                  }
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <BookMarked className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium text-slate-500">No materials found</p>
              <p className="text-sm mt-1">
                {selectedSubject ? `No materials in ${selectedSubject} yet.` : 'Be the first to share a resource!'}
              </p>
              <button onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
                Share a Resource
              </button>
            </div>
          )}

          {/* Materials grid/list */}
          {!loading && !error && filtered.length > 0 && (
            viewMode === 'grid'
              ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(m => <MaterialCard key={m.id} material={m} view="grid" />)}
                </div>
              )
              : (
                <div className="space-y-2">
                  {filtered.map(m => <MaterialCard key={m.id} material={m} view="list" />)}
                </div>
              )
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <UploadMaterialModal
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}
