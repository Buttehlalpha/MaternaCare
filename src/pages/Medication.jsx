import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import PatientPicker from '../components/PatientPicker.jsx'

export default function Medication() {
  const { profile } = useAuth()
  const [patient, setPatient] = useState(null)
  const [drugName, setDrugName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState([])

  useEffect(() => {
    supabase
      .from('medications')
      .select('*, patients(full_name, patient_code)')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setRecent(data ?? []))
  }, [saving])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patient) {
      setError('Select a patient first.')
      return
    }
    if (!drugName.trim()) {
      setError('Drug name is required.')
      return
    }
    setSaving(true)
    setError('')
    const { error } = await supabase.from('medications').insert({
      patient_id: patient.id,
      drug_name: drugName,
      dosage: dosage || null,
      frequency: frequency || null,
      duration: duration || null,
      notes: notes || null,
      prescribing_officer: profile?.id ?? null,
    })
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setPatient(null)
    setDrugName('')
    setDosage('')
    setFrequency('')
    setDuration('')
    setNotes('')
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-medium">Medication</h1>
        <p className="mt-1.5 text-ink/60">Prescribe and record medication — iron, folic acid, antimalarials and more.</p>
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
          <Field label="Drug name" value={drugName} onChange={setDrugName} />
          <Field label="Dosage" value={dosage} onChange={setDosage} placeholder="e.g. 200mg" />
          <Field label="Frequency" value={frequency} onChange={setFrequency} placeholder="e.g. twice daily" />
          <Field label="Duration" value={duration} onChange={setDuration} placeholder="e.g. 30 days" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
          />
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
            {saving ? 'Saving…' : 'Save prescription'}
          </motion.button>
        </div>
      </motion.form>

      <h2 className="mt-10 font-medium">Recent prescriptions</h2>
      <div className="mt-3 rounded-2xl border border-line bg-white divide-y divide-line">
        {recent.length === 0 && <p className="px-4 py-4 text-sm text-ink/40">Nothing recorded yet.</p>}
        {recent.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
            className="px-4 py-3 text-sm flex items-center justify-between gap-4"
          >
            <span><strong>{m.patients?.full_name}</strong> — {m.drug_name} · {m.dosage} · {m.frequency}</span>
            <span className="text-xs text-ink/40 shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
      />
    </div>
  )
}
