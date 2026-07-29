import React from 'react'
import { X, Calendar, MapPin, Users, QrCode, Download } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function EventRegistrationModal({ event, onClose }) {
  const { firebaseUser, dbUser } = useAuth()

  const userName = dbUser?.displayName || firebaseUser?.displayName || 'Student'
  const userUid  = firebaseUser?.uid || 'GUEST'

  // QR code data encodes event ID + user UID for venue scanning
  const qrData   = `CAMPUSONE-EVENT-${event.id}-USER-${userUid}`
  const qrUrl    = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200&color=4f46e5&bgcolor=ffffff&margin=10&qzone=1`

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-slide-up overflow-hidden">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 text-slate-500
                     hover:bg-slate-100 hover:text-slate-700 transition-colors shadow">
          <X className="w-4 h-4" />
        </button>

        {/* Ticket top — gradient header */}
        <div className="bg-gradient-to-r from-primary-600 to-violet-600 px-6 pt-6 pb-8 text-white">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Your Ticket</div>
          <h2 className="text-lg font-bold leading-snug mb-4">{event.title}</h2>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              {formatEventDate(event.eventDate)}
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-white/90">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {event.location}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              {event.currentAttendees} registered
            </div>
          </div>
        </div>

        {/* Perforation line */}
        <div className="relative flex items-center -mt-1">
          <div className="w-6 h-6 rounded-full bg-slate-50 -ml-3 flex-shrink-0 border-r border-dashed border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200" />
          <div className="w-6 h-6 rounded-full bg-slate-50 -mr-3 flex-shrink-0 border-l border-dashed border-slate-200" />
        </div>

        {/* QR code section */}
        <div className="px-6 py-5 bg-slate-50 text-center">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-3">
            <img
              src={qrUrl}
              alt="Event Entry QR Code"
              className="w-40 h-40 sm:w-44 sm:h-44"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium mb-0.5">Registered as</p>
          <p className="text-sm font-semibold text-slate-800">{userName}</p>
          <p className="text-xs text-slate-400 mt-3">
            Show this QR code at the venue entrance for check-in
          </p>
        </div>

        {/* Footer action */}
        <div className="px-6 pb-6 bg-slate-50">
          <button onClick={onClose}
            className="w-full py-3 rounded-2xl bg-primary-600 text-white text-sm font-semibold
                       hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function formatEventDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
