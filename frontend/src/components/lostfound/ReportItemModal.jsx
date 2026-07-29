import React, { useState } from 'react'
import { X, PackageSearch } from 'lucide-react'
import { reportLostFoundItem } from '../../services/lostFoundService'

const CATEGORIES = [
  { value: 'ELECTRONICS', label: '📱 Electronics'  },
  { value: 'CLOTHING',    label: '👕 Clothing'      },
  { value: 'BOOKS',       label: '📚 Books'         },
  { value: 'ID_CARD',     label: '🪪 ID Card'       },
  { value: 'KEYS',        label: '🔑 Keys'          },
  { value: 'ACCESSORIES', label: '🎒 Accessories'   },
  { value: 'OTHER',       label: '📦 Other'         },
]

const INIT = {
  type: 'LOST', title: '', description: '', location: '',
  category: 'OTHER', imageUrl: '', reportedByContact: ''
}

export default function ReportItemModal({ onClose, onSuccess }) {
  const [form, setForm]       = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [fe, setFE]           = useState({})

  function handleChange(e) {
    setError('')
    setFE(p => ({ ...p, [e.target.name]: '' }))
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim())    errs.title    = 'Title is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFE(errs); return }
    setLoading(true)
    try {
      await reportLostFoundItem(form)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.')
    } finally {
      setLoading(false)
    }
  }

  const ic = (f) => `form-input ${fe[f] ? 'border-red-400' : ''}`

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-xl"><PackageSearch className="w-4 h-4 text-rose-600" /></div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Report Item</h2>
              <p className="text-xs text-slate-400">Lost something or found an item?</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          {/* Lost / Found toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['LOST', 'FOUND'].map(t => (
                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    form.type === t
                      ? t === 'LOST'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  {t === 'LOST' ? '😟 I Lost It' : '😊 I Found It'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Item Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. iPhone 14 Pro Space Black" className={ic('title')} />
            {fe.title && <p className="text-xs text-red-500 mt-1">{fe.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-input">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {form.type === 'LOST' ? 'Last Seen At' : 'Found At'} *
              </label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Library 1st floor" className={ic('location')} />
              {fe.location && <p className="text-xs text-red-500 mt-1">{fe.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400">(optional)</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="Any identifying details? Color, brand, contents..."
              className="form-input resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Image URL <span className="text-slate-400">(optional)</span></label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
              placeholder="Firebase Storage URL or image link" className="form-input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact <span className="text-slate-400">(email)</span></label>
            <input name="reportedByContact" value={form.reportedByContact} onChange={handleChange}
              placeholder="your@email.com" className="form-input" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${
                form.type === 'LOST'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}>
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Submitting...' : `Report as ${form.type === 'LOST' ? 'Lost' : 'Found'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
