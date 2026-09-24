import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
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

export default function Sidebar() {
  const { profile, role, signOut } = useAuth()

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-64 shrink-0 bg-forest-dark text-cream flex flex-col h-screen sticky top-0"
    >
      <div className="px-6 py-5 border-b border-white/10">
        <img src={logo} alt="Antenatal" className="h-11 w-auto" />
        <p className="text-xs text-cream/60 mt-2">Information System</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {LINKS.filter((l) => !l.roles || l.roles.includes(role)).map(({ to, label, icon: Icon, end }, i) => (
          <NavLink key={to} to={to} end={end} className="block">
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
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
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-sm truncate">{profile?.full_name ?? 'Staff member'}</p>
        <p className="text-xs text-cream/50 capitalize mb-3">{role?.replace('_', ' ') ?? '—'}</p>
        <motion.button
          onClick={signOut}
          whileHover={{ x: 2 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cream/80 hover:bg-white/10 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Log out
        </motion.button>
      </div>
    </motion.aside>
  )
}