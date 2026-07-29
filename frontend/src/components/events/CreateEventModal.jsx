import React, { useState } from 'react'
import { X, CalendarPlus } from 'lucide-react'
import { createEvent } from '../../services/eventService'

const CATEGORIES = [
  { value: 'TECHNICAL', label: 'Technical'  },
  { value: 'ACADEMIC',  label: 'Academic'   },
  { value: 'CULTURAL',  label: 'Cultural'   },
  { value: 'SPORTS',    label: 'Sports'     },
  { value: 'SOCIAL',    label: 'Social'     },
  { value: 'OTHER',     label: 'Other'      },
]

const INIT = {
  title: '', description: '', eventDate: '', eventEndDate: '',
  location: '', category: 'OTHER', maxAttendees: '',
  imageUrl: '', organizer: ''
}

export default function CreateEventModal({ onClose, onSuccess }) {
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
    if (!form.title.trim())     errs.title     = 'Title is required'
    if (!form.eventDate.trim()) errs.eventDate  = 'Event date is required'
    if (!form.location.trim())  errs.location   = 'Location is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFE(errs); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        eventDate:    form.eventDate    ? new Date(form.eventDate).toISOString()    : null,
        eventEndDate: form.eventEndDate ? new Date(form.eventEndDate).toISOString() : null,
        maxAttendees: form.maxAttendees  ? parseInt(form.maxAttendees) : null,
      }
      await createEvent(payload)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field) => `form-input ${fe[field] ? 'border-red-400' : ''}`

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-xl"><CalendarPlus className="w-4 h-4 text-violet-600" /></div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Create Event</h2>
              <p className="text-xs text-slate-400">Schedule a new campus event</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Campus Hackathon 2024" className={inputCls('title')} />
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Attendees</label>
              <input name="maxAttendees" type="number" min={1} value={form.maxAttendees}
                onChange={handleChange} placeholder="Leave blank for unlimited" className="form-input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date & Time *</label>
              <input name="eventDate" type="datetime-local" value={form.eventDate}
                onChange={handleChange} className={inputCls('eventDate')} />
              {fe.eventDate && <p className="text-xs text-red-500 mt-1">{fe.eventDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date & Time</label>
              <input name="eventEndDate" type="datetime-local" value={form.eventEndDate}
                onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location *</label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Main Auditorium, Block A" className={inputCls('location')} />
            {fe.location && <p className="text-xs text-red-500 mt-1">{fe.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Organizer / Club</label>
            <input name="organizer" value={form.organizer} onChange={handleChange}
              placeholder="e.g. Tech Club, Cultural Committee" className="form-input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="What is this event about?" className="form-input resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Image URL <span className="text-slate-400">(optional)</span></label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
              placeholder="https://..." className="form-input" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold
                         transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
