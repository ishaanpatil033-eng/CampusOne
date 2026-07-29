import React, { useState } from 'react'
import { MapPin, Clock, Mail, CheckCircle, Package } from 'lucide-react'
import { markAsClaimed } from '../../services/lostFoundService'
import { useAuth } from '../../hooks/useAuth'

const TYPE_CONFIG = {
  LOST:  { label: 'Lost',  bg: 'bg-red-100   text-red-700   border-red-200',   dot: 'bg-red-500'   },
  FOUND: { label: 'Found', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
}

const CATEGORY_EMOJI = {
  ELECTRONICS: '📱', CLOTHING: '👕', BOOKS: '📚',
  ID_CARD: '🪪', KEYS: '🔑', ACCESSORIES: '🎒', OTHER: '📦'
}

export default function LostFoundCard({ item, onUpdate }) {
  const { firebaseUser } = useAuth()
  const [claiming, setClaiming] = useState(false)
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.LOST
  const isOwner = firebaseUser?.uid === item.reportedByUid
  const isClaimed = item.status === 'CLAIMED'

  async function handleClaim() {
    if (!window.confirm('Mark this item as claimed/resolved?')) return
    setClaiming(true)
    try {
      const updated = await markAsClaimed(item.id)
      onUpdate?.(updated)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as claimed.')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden
      transition-all duration-200 hover:shadow-md
      ${isClaimed ? 'border-slate-200 opacity-70' : 'border-slate-100'}`}>

      {/* Image or emoji placeholder */}
      <div className="relative h-28 sm:h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title}
            className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-4xl select-none">
            {CATEGORY_EMOJI[item.category] || '📦'}
          </span>
        )}
        {/* Type badge */}
        <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 bg-white/90 backdrop-blur-sm ${cfg.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${item.type === 'LOST' ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </span>
        {/* Claimed badge */}
        {isClaimed && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-white backdrop-blur-sm">
              Claimed
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-2">
          {item.title}
        </h3>

        <div className="space-y-1 mb-3">
          {item.location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span className="truncate">{item.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            {formatRelative(item.createdAt)}
          </div>
        </div>

        {/* Category chip */}
        {item.category && item.category !== 'OTHER' && (
          <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md mb-3">
            {CATEGORY_EMOJI[item.category]} {item.category.replace('_', ' ')}
          </span>
        )}

        {/* Actions */}
        {!isClaimed && (
          <div className="flex gap-2">
            {item.reportedByContact && (
              <a href={`mailto:${item.reportedByContact}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-primary-50 text-primary-700 text-xs font-semibold
                           hover:bg-primary-100 transition-colors border border-primary-100">
                <Mail className="w-3.5 h-3.5" />
                Contact
              </a>
            )}
            {isOwner && (
              <button onClick={handleClaim} disabled={claiming}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-emerald-600 text-white text-xs font-semibold
                           hover:bg-emerald-700 transition-colors disabled:opacity-60">
                {claiming
                  ? <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                  : <CheckCircle className="w-3.5 h-3.5" />
                }
                Mark Resolved
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-2">
          {item.reportedByName || 'Anonymous'}
        </p>
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
