import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  MessageSquare, Settings, GraduationCap, X,
  BookMarked, Users, CalendarDays, PackageSearch,
  Coffee, Printer, ShieldAlert
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard'  },
    ]
  },
  {
    label: 'Academic',
    items: [
      { label: 'Study Hub',   icon: BookMarked,      path: '/study-hub'  },
      { label: 'Courses',     icon: BookOpen,        path: '/courses'    },
      { label: 'Schedule',    icon: Calendar,        path: '/schedule'   },
      { label: 'Assignments', icon: ClipboardList,   path: '/assignments'},
    ]
  },
  {
    label: 'Campus Life',
    items: [
      { label: 'TeamUp',      icon: Users,           path: '/teamup'     },
      { label: 'Events',      icon: CalendarDays,    path: '/events'     },
      { label: 'Lost & Found',icon: PackageSearch,   path: '/lost-found' },
      { label: 'Messages',    icon: MessageSquare,   path: '/messages'   },
    ]
  },
  {
    label: 'Services',
    items: [
      { label: 'Smart Canteen', icon: Coffee,        path: '/canteen'    },
      { label: 'PrintQ',        icon: Printer,       path: '/printq'     },
    ]
  }
]

export default function Sidebar({ open, onClose }) {
  const { dbUser } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-sidebar z-50
        flex flex-col
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none">CampusOne</span>
              <p className="text-slate-400 text-xs mt-0.5">MVP v1.0</p>
            </div>
          </div>
          <button onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role badge */}
        {dbUser?.role && (
          <div className="px-5 pt-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${dbUser.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-primary-600/20 text-primary-300'}`}>
              {dbUser.role.charAt(0) + dbUser.role.slice(1).toLowerCase()}
            </span>
          </div>
        )}

        {/* Nav groups */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ label, icon: Icon, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    id={`nav-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `sidebar-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Admin Panel Group */}
          {dbUser?.role === 'ADMIN' && (
            <div>
              <p className="text-xs font-semibold text-red-400/80 uppercase tracking-widest px-3 mb-1.5">
                Administration
              </p>
              <div className="space-y-0.5">
                <NavLink
                  to="/admin"
                  id="nav-admin"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">Admin Dashboard</span>
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Settings */}
        <div className="px-3 py-4 border-t border-white/10">
          <NavLink to="/settings"
            id="nav-settings"
            onClick={onClose}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  )
}
