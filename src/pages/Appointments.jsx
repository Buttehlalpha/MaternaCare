import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import PatientPicker from '../components/PatientPicker.jsx'

const STATUSES = ['scheduled', 'completed', 'cancelled', 'missed']

export default function Appointments() {
  const [patient, setPatient] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [purpose, setPurpose] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [upcoming, setUpcoming] = useState([])

  const fetchUpcoming = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, patients(full_name, patient_code)')
      .order('appointment_date', { ascending: true })
      .limit(15)
    setUpcoming(data ?? [])
  }

  useEffect(() => { fetchUpcoming() }, [saving])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patient || !date || !time) {
      setError('Patient, date and time are required.')
      return
    }
    setSaving(true)
    setError('')
    const { error } = await supabase.from('appointments').insert({
      patient_id: patient.id,
      appointment_date: date,
      appointment_time: time,
      purpose: purpose || null,
    })
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setPatient(null)
    setDate('')
    setTime('')
    setPurpose('')
  }

  const updateStatus = async (id, status) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    fetchUpcoming()
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-medium">Appointments</h1>
        <p className="mt-1.5 text-ink/60">Schedule follow-up visits and keep the appointment book up to date.</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">Patient</label>
          <PatientPicker value={patient} onChange={setPatient} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Purpose</label>
            <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Follow-up scan"
              className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none" />
          </div>
        </div>

        {error && <p className="text-sm text-clay-dark">{error}</p>}

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            className="bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Schedule appointment'}
          </motion.button>
        </div>
      </motion.form>

      <h2 className="mt-10 font-medium">Upcoming appointments</h2>
      <div className="mt-3 rounded-2xl border border-line bg-white divide-y divide-line">
        {upcoming.length === 0 && <p className="px-4 py-4 text-sm text-ink/40">Nothing scheduled yet.</p>}
        {upcoming.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
            className="px-4 py-3 text-sm flex items-center justify-between gap-4 flex-wrap"
          >
            <span>
              <strong>{a.patients?.full_name}</strong> — {new Date(a.appointment_date).toLocaleDateString()} at {a.appointment_time}
              {a.purpose && ` · ${a.purpose}`}
            </span>
            <select
              value={a.status}
              onChange={(e) => updateStatus(a.id, e.target.value)}
              className="text-xs rounded-full border border-ink/15 px-2.5 py-1 capitalize"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
