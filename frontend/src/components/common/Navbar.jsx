import React, { useState } from 'react'
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar({ onMenuToggle }) {
  const { firebaseUser, dbUser, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const displayName = dbUser?.displayName || firebaseUser?.displayName || 'User'
  const email       = dbUser?.email       || firebaseUser?.email       || ''
  const photoURL    = dbUser?.photoUrl    || firebaseUser?.photoURL    || null
  const initials    = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      {/* Left: search */}
      <div className="flex items-center gap-4">
        <button
          id="menu-toggle-btn"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="global-search"
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       w-56 transition-all"
          />
        </div>
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-3">
        <button
          id="notifications-btn"
          className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
              <p className="text-xs text-slate-400">{dbUser?.role || 'Student'}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>
              <button
                id="profile-menu-item"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                id="settings-menu-item"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <hr className="my-1 border-slate-100" />
              <button
                id="logout-menu-item"
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
