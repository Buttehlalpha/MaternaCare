import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import PatientPicker from '../components/PatientPicker.jsx'

const REPORT_TYPES = [
  { id: 'patient_summary', label: 'Patient summary' },
  { id: 'appointments', label: 'Appointment report' },
  { id: 'lab', label: 'Laboratory report' },
  { id: 'risk', label: 'High-risk pregnancy report' },
]

export default function Reports() {
  const [type, setType] = useState('patient_summary')
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(null)

  const generate = async () => {
    setLoading(true)
    setRows(null)
    if (type === 'patient_summary') {
      if (!patient) { setLoading(false); return }
      const [a, l, m, ap] = await Promise.all([
        supabase.from('clinical_assessments').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
        supabase.from('lab_results').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
        supabase.from('medications').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').eq('patient_id', patient.id).order('appointment_date', { ascending: false }),
      ])
      setRows({ assessments: a.data ?? [], labs: l.data ?? [], meds: m.data ?? [], appts: ap.data ?? [] })
    } else if (type === 'appointments') {
      const { data } = await supabase
        .from('appointments')
        .select('*, patients(full_name, patient_code)')
        .order('appointment_date', { ascending: false })
        .limit(50)
      setRows({ list: data ?? [] })
    } else if (type === 'lab') {
      const { data } = await supabase
        .from('lab_results')
        .select('*, patients(full_name, patient_code)')
        .order('created_at', { ascending: false })
        .limit(50)
      setRows({ list: data ?? [] })
    } else if (type === 'risk') {
      const { data } = await supabase
        .from('clinical_assessments')
        .select('*, patients(full_name, patient_code)')
        .eq('risk_level', 'high')
        .order('created_at', { ascending: false })
        .limit(50)
      setRows({ list: data ?? [] })
    }
    setLoading(false)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-medium">Reports</h1>
        <p className="mt-1.5 text-ink/60">Generate a report to review or print.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">Report type</label>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setRows(null) }}
            className="w-full sm:w-72 rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
          >
            {REPORT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {type === 'patient_summary' && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Patient</label>
            <PatientPicker value={patient} onChange={setPatient} />
          </div>
        )}

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          onClick={generate}
          disabled={loading || (type === 'patient_summary' && !patient)}
          className="bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Generating…' : 'Generate report'}
        </motion.button>
      </motion.div>

      {rows && type === 'patient_summary' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 space-y-6"
        >
          <ReportBlock title="Clinical assessments" items={rows.assessments} render={(a) =>
            `BP ${a.blood_pressure ?? '—'} · Weight ${a.weight_kg ?? '—'}kg · GA ${a.gestational_age_weeks ?? '—'}wks${a.diagnosis ? ` · ${a.diagnosis}` : ''}`} />
          <ReportBlock title="Laboratory results" items={rows.labs} render={(l) => `${l.test_type}: ${l.result_value ?? 'pending'}`} />
          <ReportBlock title="Medication" items={rows.meds} render={(m) => `${m.drug_name} — ${m.dosage ?? ''} ${m.frequency ?? ''}`} />
          <ReportBlock title="Appointments" items={rows.appts} render={(a) => `${new Date(a.appointment_date).toLocaleDateString()} — ${a.status}`} />
        </motion.div>
      )}

      {rows && rows.list && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 rounded-2xl border border-line bg-white divide-y divide-line"
        >
          {rows.list.length === 0 && <p className="px-4 py-4 text-sm text-ink/40">No matching records.</p>}
          {rows.list.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              className="px-4 py-3 text-sm flex items-center justify-between gap-4"
            >
              <span><strong>{item.patients?.full_name}</strong> {item.test_type ? `— ${item.test_type}: ${item.result_value ?? 'pending'}` : ''}
                {item.appointment_date ? `— ${new Date(item.appointment_date).toLocaleDateString()} (${item.status})` : ''}
                {item.diagnosis ? `— ${item.diagnosis}` : ''}
              </span>
              <span className="text-xs text-ink/40 shrink-0">{new Date(item.created_at).toLocaleDateString()}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function ReportBlock({ title, items, render }) {
  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      <div className="mt-3 rounded-2xl border border-line bg-white divide-y divide-line">
        {items.length === 0 && <p className="px-4 py-4 text-sm text-ink/40">Nothing recorded.</p>}
        {items.map((i) => <div key={i.id} className="px-4 py-3 text-sm">{render(i)}</div>)}
      </div>
    </div>
  )
}
