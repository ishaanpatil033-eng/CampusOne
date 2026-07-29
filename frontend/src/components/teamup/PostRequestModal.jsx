import React, { useState } from 'react'
import { X, Users, Plus } from 'lucide-react'
import { createTeamRequest } from '../../services/teamRequestService'

const PROJECT_TYPES = [
  { value: 'HACKATHON',      label: 'Hackathon' },
  { value: 'RESEARCH',       label: 'Research'  },
  { value: 'COURSE_PROJECT', label: 'Course Project' },
  { value: 'STARTUP',        label: 'Startup'   },
  { value: 'OTHER',          label: 'Other'     },
]

const SUGGESTED_SKILLS = [
  'React', 'Python', 'Java', 'UI/UX', 'Machine Learning',
  'Node.js', 'Flutter', 'Spring Boot', 'MongoDB', 'Firebase'
]

const INITIAL_FORM = {
  title: '', description: '', projectType: 'HACKATHON',
  requiredSkills: [], teamSize: 4, contactInfo: ''
}

export default function PostRequestModal({ onClose, onSuccess }) {
  const [form, setForm]           = useState(INITIAL_FORM)
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [fieldErrors, setFE]      = useState({})

  function handleChange(e) {
    setError('')
    setFE(prev => ({ ...prev, [e.target.name]: '' }))
    const val = e.target.name === 'teamSize' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: val }))
  }

  function addSkill(skill) {
    const s = skill.trim()
    if (s && !form.requiredSkills.includes(s)) {
      setForm(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, s] }))
    }
    setSkillInput('')
  }

  function removeSkill(skill) {
    setForm(prev => ({ ...prev, requiredSkills: prev.requiredSkills.filter(s => s !== skill) }))
  }

  function handleSkillKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  function validate() {
    const errs = {}
    if (!form.title.trim())       errs.title    = 'Title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.teamSize < 2)        errs.teamSize = 'Team size must be at least 2'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFE(errs); return }
    setLoading(true)
    try {
      await createTeamRequest({ ...form, requiredSkills: form.requiredSkills })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post request. Try again.')
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
            <div className="p-2 bg-emerald-50 rounded-xl"><Users className="w-4 h-4 text-emerald-600" /></div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Post a Team Request</h2>
              <p className="text-xs text-slate-400">Find the right people for your project</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Looking for React devs for Hackathon"
              className={`form-input ${fieldErrors.title ? 'border-red-400' : ''}`} />
            {fieldErrors.title && <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>}
          </div>

          {/* Type & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Type</label>
              <select name="projectType" value={form.projectType} onChange={handleChange} className="form-input">
                {PROJECT_TYPES.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Team Size</label>
              <input name="teamSize" type="number" min={2} max={20} value={form.teamSize} onChange={handleChange}
                className={`form-input ${fieldErrors.teamSize ? 'border-red-400' : ''}`} />
              {fieldErrors.teamSize && <p className="text-xs text-red-500 mt-1">{fieldErrors.teamSize}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="What's your project about? What are you building?"
              className={`form-input resize-none ${fieldErrors.description ? 'border-red-400' : ''}`} />
            {fieldErrors.description && <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Required Skills</label>
            {/* Tag input */}
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type skill and press Enter"
                className="form-input flex-1"
              />
              <button type="button" onClick={() => addSkill(skillInput)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Added skills */}
            {form.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.requiredSkills.map(skill => (
                  <span key={skill} className="flex items-center gap-1 px-2.5 py-0.5 bg-primary-100 text-primary-700
                                              text-xs font-medium rounded-full border border-primary-200">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}
                      className="text-primary-500 hover:text-primary-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SUGGESTED_SKILLS.filter(s => !form.requiredSkills.includes(s)).slice(0, 8).map(skill => (
                <button key={skill} type="button" onClick={() => addSkill(skill)}
                  className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-200
                             hover:bg-slate-100 transition-colors">
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact <span className="text-slate-400">(email or Discord)</span></label>
            <input name="contactInfo" value={form.contactInfo} onChange={handleChange}
              placeholder="your@email.com" className="form-input" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold
                         transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Posting...' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
