import React, { useState } from 'react'
import { X, Upload, Link } from 'lucide-react'
import { createStudyMaterial } from '../../services/studyMaterialService'

const SUBJECTS = [
  'Computer Science', 'Mathematics', 'Physics',
  'Chemistry', 'English', 'Economics', 'Biology', 'History', 'Other'
]

const FILE_TYPES = [
  { value: 'PDF',          label: 'PDF Document' },
  { value: 'DOC',          label: 'Word Document' },
  { value: 'PRESENTATION', label: 'Presentation (PPT)' },
  { value: 'SPREADSHEET',  label: 'Spreadsheet' },
  { value: 'IMAGE',        label: 'Image' },
  { value: 'LINK',         label: 'Web Link' },
  { value: 'OTHER',        label: 'Other' },
]

const INITIAL_FORM = {
  title: '', subject: '', department: '',
  description: '', fileUrl: '', fileName: '', fileType: 'PDF'
}

export default function UploadMaterialModal({ onClose, onSuccess }) {
  const [form, setForm]         = useState(INITIAL_FORM)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [fieldErrors, setFE]    = useState({})

  function handleChange(e) {
    setError('')
    setFE(prev => ({ ...prev, [e.target.name]: '' }))
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim())   errs.title   = 'Title is required'
    if (!form.subject.trim()) errs.subject  = 'Subject is required'
    if (!form.fileUrl.trim()) errs.fileUrl  = 'Resource URL is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFE(errs); return }
    setLoading(true)
    try {
      await createStudyMaterial(form)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share resource. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl"><Upload className="w-4 h-4 text-primary-600" /></div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Share a Resource</h2>
              <p className="text-xs text-slate-400">Help your peers by sharing study materials</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Data Structures Complete Notes"
              className={`form-input ${fieldErrors.title ? 'border-red-400' : ''}`} />
            {fieldErrors.title && <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>}
          </div>

          {/* Subject & File Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject *</label>
              <select name="subject" value={form.subject} onChange={handleChange}
                className={`form-input ${fieldErrors.subject ? 'border-red-400' : ''}`}>
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {fieldErrors.subject && <p className="text-xs text-red-500 mt-1">{fieldErrors.subject}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">File Type</label>
              <select name="fileType" value={form.fileType} onChange={handleChange} className="form-input">
                {FILE_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Department <span className="text-slate-400">(optional)</span></label>
            <input name="department" value={form.department} onChange={handleChange}
              placeholder="e.g. Engineering" className="form-input" />
          </div>

          {/* Resource URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /> Resource URL *</span>
            </label>
            <input name="fileUrl" value={form.fileUrl} onChange={handleChange}
              placeholder="https://drive.google.com/... or Firebase Storage URL"
              className={`form-input ${fieldErrors.fileUrl ? 'border-red-400' : ''}`} />
            {fieldErrors.fileUrl && <p className="text-xs text-red-500 mt-1">{fieldErrors.fileUrl}</p>}
            <p className="text-xs text-slate-400 mt-1">Paste the URL from Google Drive, Firebase Storage, or any accessible link.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400">(optional)</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="What topics does this resource cover?"
              className="form-input resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold
                         transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Sharing...' : 'Share Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
