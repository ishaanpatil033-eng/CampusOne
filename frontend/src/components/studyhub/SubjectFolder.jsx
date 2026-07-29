import React from 'react'

const SUBJECT_CONFIG = {
  'Computer Science': { emoji: '💻', bg: 'bg-indigo-50', border: 'border-indigo-200', selected: 'ring-indigo-500 bg-indigo-100', text: 'text-indigo-700' },
  'Mathematics':      { emoji: '📐', bg: 'bg-blue-50',   border: 'border-blue-200',   selected: 'ring-blue-500 bg-blue-100',   text: 'text-blue-700'   },
  'Physics':          { emoji: '⚡', bg: 'bg-amber-50',  border: 'border-amber-200',  selected: 'ring-amber-500 bg-amber-100',  text: 'text-amber-700'  },
  'Chemistry':        { emoji: '🧪', bg: 'bg-emerald-50',border: 'border-emerald-200',selected: 'ring-emerald-500 bg-emerald-100',text:'text-emerald-700'},
  'English':          { emoji: '📚', bg: 'bg-rose-50',   border: 'border-rose-200',   selected: 'ring-rose-500 bg-rose-100',   text: 'text-rose-700'   },
  'Economics':        { emoji: '📊', bg: 'bg-violet-50', border: 'border-violet-200', selected: 'ring-violet-500 bg-violet-100',text: 'text-violet-700' },
}

const DEFAULT_CONFIG = { emoji: '📁', bg: 'bg-slate-50', border: 'border-slate-200', selected: 'ring-primary-500 bg-primary-100', text: 'text-primary-700' }

export default function SubjectFolder({ subject, count, isSelected, onClick }) {
  const cfg = SUBJECT_CONFIG[subject] || DEFAULT_CONFIG

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 focus:outline-none
        ${isSelected
          ? `ring-2 ${cfg.selected} border-transparent`
          : `${cfg.bg} ${cfg.border} hover:shadow-sm`
        }
      `}
    >
      <div className="text-2xl mb-2">{cfg.emoji}</div>
      <p className={`text-sm font-semibold leading-tight ${isSelected ? cfg.text : 'text-slate-700'}`}>
        {subject}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {count === 1 ? '1 resource' : `${count} resources`}
      </p>
    </button>
  )
}
