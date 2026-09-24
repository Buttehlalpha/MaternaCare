import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, CalendarClock, FlaskConical, Stethoscope } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import AnimatedNumber from '../components/AnimatedNumber.jsx'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: 'easeOut' }}>
      <Link to={to}>
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 12px 28px -12px rgba(31,93,79,0.25)' }}
          className="rounded-2xl border border-line bg-white px-5 py-5 transition-colors hover:border-forest/40"
        >
          <Icon size={20} strokeWidth={1.6} className="text-forest" />
          <p className="mt-4 text-2xl font-display">
            <AnimatedNumber value={value} />
          </p>
          <p className="text-sm text-ink/60 mt-0.5">{label}</p>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [counts, setCounts] = useState({ patients: null, appointments: null, labs: null, assessments: null })

  useEffect(() => {
    const load = async () => {
      const [patients, appointments, labs, assessments] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('appointment_date', new Date().toISOString().slice(0, 10)),
        supabase.from('lab_results').select('*', { count: 'exact', head: true }),
        supabase.from('clinical_assessments').select('*', { count: 'exact', head: true }),
      ])
      setCounts({
        patients: patients.count,
        appointments: appointments.count,
        labs: labs.count,
        assessments: assessments.count,
      })
    }
    load()
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-medium">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.
        </h1>
        <p className="mt-1.5 text-ink/60">Here&rsquo;s what&rsquo;s happening across the clinic today.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard icon={Users} label="Registered patients" value={counts.patients} to="/app/patients" />
        <StatCard icon={CalendarClock} label="Appointments today" value={counts.appointments} to="/app/appointments" />
        <StatCard icon={FlaskConical} label="Lab results on file" value={counts.labs} to="/app/laboratory" />
        <StatCard icon={Stethoscope} label="Assessments recorded" value={counts.assessments} to="/app/clinical" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-10 rounded-2xl border border-line bg-white p-6"
      >
        <h2 className="font-medium">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/app/patients">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block text-sm px-4 py-2 rounded-full bg-forest text-cream hover:bg-forest-dark transition-colors"
            >
              Register a patient
            </motion.span>
          </Link>
          <Link to="/app/appointments">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block text-sm px-4 py-2 rounded-full border border-ink/15 hover:border-forest transition-colors"
            >
              Schedule an appointment
            </motion.span>
          </Link>
          <Link to="/app/reports">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block text-sm px-4 py-2 rounded-full border border-ink/15 hover:border-forest transition-colors"
            >
              View reports
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
