import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FlaskConical,
  Pill,
  CalendarClock,
  FileBarChart,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import logo from '../assets/logo-1.png'

const LINKS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/patients', label: 'Patients', icon: Users },
  { to: '/app/clinical', label: 'Clinical assessment', icon: Stethoscope },
  { to: '/app/laboratory', label: 'Laboratory', icon: FlaskConical },
  { to: '/app/medication', label: 'Medication', icon: Pill },
  { to: '/app/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/app/reports', label: 'Reports', icon: FileBarChart },
  { to: '/app/users', label: 'User management', icon: ShieldCheck, roles: ['administrator'] },
]

function NavItems({ role, onNavigate, idPrefix = '' }) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {LINKS.filter((l) => !l.roles || l.roles.includes(role)).map(
        ({ to, label, icon: Icon, end }, i) => (
          <NavLink key={to} to={to} end={end} className="block" onClick={onNavigate}>
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId={`${idPrefix}sidebar-active`}
                    className="absolute inset-0 bg-forest rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <div
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? 'text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {label}
                </div>
              </motion.div>
            )}
          </NavLink>
        )
      )}
    </nav>
  )
}

function UserFooter({ profile, role, signOut }) {
  return (
    <div className="px-4 py-4 border-t border-white/10">
      <p className="text-sm truncate">{profile?.full_name ?? 'Staff member'}</p>
      <p className="text-xs text-cream/50 capitalize mb-3">
        {role?.replace('_', ' ') ?? '—'}
      </p>
      <motion.button
        onClick={signOut}
        whileHover={{ x: 2 }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cream/80 hover:bg-white/10 transition-colors"
      >
        <LogOut size={16} strokeWidth={1.75} />
        Log out
      </motion.button>
    </div>
  )
}

export default function Sidebar() {
  const { profile, role, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-forest-dark text-cream flex items-center justify-between px-4 py-3 border-b border-white/10">
        <img src={logo} alt="Antenatal" className="h-9 w-auto" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="relative z-[60] p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
        >
          {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-forest-dark text-cream flex-col h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-white/10">
          <img src={logo} alt="Antenatal" className="h-11 w-auto" />
          <p className="text-xs text-cream/60 mt-2">Information System</p>
        </div>
        <NavItems role={role} idPrefix="desktop-" />
        <UserFooter profile={profile} role={role} signOut={signOut} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed top-0 left-0 z-50 w-72 max-w-[85vw] h-screen bg-forest-dark text-cream flex flex-col"
            >
              <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between">
                <div>
                  <img src={logo} alt="Antenatal" className="h-11 w-auto" />
                  <p className="text-xs text-cream/60 mt-2">Information System</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-cream/70 hover:text-cream p-1.5 -mr-1 active:bg-white/10 rounded-lg touch-manipulation"
                >
                  <X size={20} strokeWidth={1.75} />
                </button>
              </div>
              <NavItems role={role} onNavigate={() => setOpen(false)} idPrefix="mobile-" />
              <UserFooter profile={profile} role={role} signOut={signOut} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}