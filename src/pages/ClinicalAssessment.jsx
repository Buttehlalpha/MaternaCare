import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import PatientPicker from '../components/PatientPicker.jsx'

const emptyForm = {
  weight_kg: '',
  blood_pressure: '',
  temperature_c: '',
  pulse_rate: '',
  gestational_age_weeks: '',
  fundal_height_cm: '',
  fetal_heart_rate: '',
  clinical_observations: '',
  diagnosis: '',
  risk_level: 'low',
}

export default function ClinicalAssessment() {
  const { profile } = useAuth()
  const [patient, setPatient] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState([])

  useEffect(() => {
    supabase
      .from('clinical_assessments')
      .select('*, patients(full_name, patient_code)')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setRecent(data ?? []))
  }, [saving])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patient) {
      setError('Select a patient first.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      patient_id: patient.id,
      weight_kg: form.weight_kg || null,
      blood_pressure: form.blood_pressure || null,
      temperature_c: form.temperature_c || null,
      pulse_rate: form.pulse_rate || null,
      gestational_age_weeks: form.gestational_age_weeks || null,
      fundal_height_cm: form.fundal_height_cm || null,
      fetal_heart_rate: form.fetal_heart_rate || null,
      clinical_observations: form.clinical_observations || null,
      diagnosis: form.diagnosis || null,
      risk_level: form.risk_level,
      recorded_by: profile?.id ?? null,
    }
    const { error } = await supabase.from('clinical_assessments').insert(payload)
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setForm(emptyForm)
    setPatient(null)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-medium">Clinical assessment</h1>
        <p className="mt-1.5 text-ink/60">Record vitals and findings for today&rsquo;s antenatal visit.</p>
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
          <Field label="Weight (kg)" name="weight_kg" value={form.weight_kg} onChange={handleChange} />
          <Field label="Blood pressure" name="blood_pressure" placeholder="120/80" value={form.blood_pressure} onChange={handleChange} />
          <Field label="Temperature (°C)" name="temperature_c" value={form.temperature_c} onChange={handleChange} />
          <Field label="Pulse rate" name="pulse_rate" value={form.pulse_rate} onChange={handleChange} />
          <Field label="Gestational age (weeks)" name="gestational_age_weeks" value={form.gestational_age_weeks} onChange={handleChange} />
          <Field label="Fundal height (cm)" name="fundal_height_cm" value={form.fundal_height_cm} onChange={handleChange} />
          <Field label="Fetal heart rate" name="fetal_heart_rate" value={form.fetal_heart_rate} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium mb-1.5">Risk level</label>
            <select
              name="risk_level"
              value={form.risk_level}
              onChange={handleChange}
              className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <Field label="Clinical observations" name="clinical_observations" value={form.clinical_observations} onChange={handleChange} textarea />
        <Field label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={handleChange} />

        {error && <p className="text-sm text-clay-dark">{error}</p>}

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            className="bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save assessment'}
          </motion.button>
        </div>
      </motion.form>

      <h2 className="mt-10 font-medium">Recent assessments</h2>
      <div className="mt-3 rounded-2xl border border-line bg-white divide-y divide-line">
        {recent.length === 0 && <p className="px-4 py-4 text-sm text-ink/40">Nothing recorded yet.</p>}
        {recent.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
            className="px-4 py-3 text-sm flex items-center justify-between gap-4"
          >
            <span>
              <strong>{a.patients?.full_name}</strong> — BP {a.blood_pressure ?? '—'}, GA {a.gestational_age_weeks ?? '—'}wks
            </span>
            <span className="text-xs text-ink/40 shrink-0">{new Date(a.created_at).toLocaleDateString()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, textarea, className = '', ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          {...props}
          rows={3}
          className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
        />
      ) : (
        <input
          {...props}
          className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
        />
      )}
    </div>
  )
}
