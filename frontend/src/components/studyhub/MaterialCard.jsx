import React from 'react'
import { FileText, FileSpreadsheet, Presentation, Image, Link, File, ExternalLink } from 'lucide-react'

const FILE_CONFIG = {
  PDF:          { icon: FileText,        bg: 'bg-red-50',    text: 'text-red-600',    badge: 'bg-red-100 text-red-700'    },
  DOC:          { icon: FileText,        bg: 'bg-blue-50',   text: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700'  },
  PRESENTATION: { icon: FileText,        bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  SPREADSHEET:  { icon: FileSpreadsheet, bg: 'bg-green-50',  text: 'text-green-600',  badge: 'bg-green-100 text-green-700' },
  IMAGE:        { icon: Image,           bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700'},
  LINK:         { icon: Link,            bg: 'bg-sky-50',    text: 'text-sky-600',    badge: 'bg-sky-100 text-sky-700'    },
  OTHER:        { icon: File,            bg: 'bg-slate-50',  text: 'text-slate-500',  badge: 'bg-slate-100 text-slate-600' },
}

export default function MaterialCard({ material, view = 'grid' }) {
  const cfg = FILE_CONFIG[material.fileType] || FILE_CONFIG.OTHER
  const Icon = cfg.icon

  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
          <Icon className={`w-5 h-5 ${cfg.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">{material.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {material.subject} · {material.uploadedByName || 'Anonymous'} · {formatRelative(material.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium hidden sm:inline ${cfg.badge}`}>
            {material.fileType}
          </span>
          <a
            href={material.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold
                       rounded-lg hover:bg-primary-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View
          </a>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg}`}>
          <Icon className={`w-5 h-5 ${cfg.text}`} />
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${cfg.badge}`}>
          {material.fileType}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1.5 line-clamp-2 flex-1">
        {material.title}
      </h3>

      {material.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{material.description}</p>
      )}

      {material.subject && (
        <span className="inline-block text-xs bg-indigo-50 text-indigo-600 border border-indigo-100
                         px-2 py-0.5 rounded-md font-medium mb-3 w-fit">
          {material.subject}
        </span>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-bold" style={{ fontSize: '9px' }}>
              {(material.uploadedByName || 'A')[0].toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-slate-400 truncate max-w-20">
            {material.uploadedByName || 'Anonymous'}
          </span>
        </div>
        <a
          href={material.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open
        </a>
      </div>
    </div>
  )
}

function formatRelative(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
