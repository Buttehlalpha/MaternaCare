import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [labs, setLabs] = useState([])
  const [meds, setMeds] = useState([])
  const [appts, setAppts] = useState([])

  useEffect(() => {
    const load = async () => {
      const [p, a, l, m, ap] = await Promise.all([
        supabase.from('patients').select('*').eq('id', id).single(),
        supabase.from('clinical_assessments').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
        supabase.from('lab_results').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
        supabase.from('medications').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').eq('patient_id', id).order('appointment_date', { ascending: false }),
      ])
      setPatient(p.data)
      setAssessments(a.data ?? [])
      setLabs(l.data ?? [])
      setMeds(m.data ?? [])
      setAppts(ap.data ?? [])
    }
    load()
  }, [id])

  if (!patient) return <p className="text-ink/50">Loading patient record…</p>

  return (
    <div>
      <Link to="/app/patients" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={15} /> Back to patients
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 flex items-baseline gap-3 flex-wrap"
      >
        <h1 className="text-3xl font-medium">{patient.full_name}</h1>
        <span className="font-mono text-xs text-forest bg-forest/10 px-2 py-1 rounded">{patient.patient_code}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mt-4 grid sm:grid-cols-3 gap-4 text-sm"
      >
        <Info label="Age" value={patient.age} />
        <Info label="Phone" value={patient.phone_number} />
        <Info label="Blood group" value={patient.blood_group} />
        <Info label="Address" value={patient.address} />
        <Info label="Next of kin" value={patient.next_of_kin} />
        <Info label="Marital status" value={patient.marital_status} />
      </motion.div>

      <Section title="Clinical assessments">
        {assessments.length === 0 && <Empty />}
        {assessments.map((a) => (
          <Row key={a.id} date={a.created_at}>
            BP {a.blood_pressure ?? '—'} · Weight {a.weight_kg ?? '—'}kg · GA {a.gestational_age_weeks ?? '—'}wks
            {a.diagnosis && ` · ${a.diagnosis}`}
          </Row>
        ))}
      </Section>

      <Section title="Laboratory results">
        {labs.length === 0 && <Empty />}
        {labs.map((l) => (
          <Row key={l.id} date={l.created_at}>{l.test_type}: {l.result_value ?? 'pending'}</Row>
        ))}
      </Section>

      <Section title="Medication">
        {meds.length === 0 && <Empty />}
        {meds.map((m) => (
          <Row key={m.id} date={m.created_at}>{m.drug_name} — {m.dosage} · {m.frequency}</Row>
        ))}
      </Section>

      <Section title="Appointments">
        {appts.length === 0 && <Empty />}
        {appts.map((a) => (
          <Row key={a.id} date={a.appointment_date}>
            {a.appointment_time} — {a.purpose ?? 'Follow-up'} <span className="text-ink/40">({a.status})</span>
          </Row>
        ))}
      </Section>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <p className="text-xs text-ink/50">{label}</p>
      <p className="mt-0.5">{value || '—'}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      <h2 className="font-medium">{title}</h2>
      <div className="mt-3 rounded-2xl border border-line bg-white divide-y divide-line">{children}</div>
    </motion.div>
  )
}

function Row({ date, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-3 text-sm flex items-center justify-between gap-4"
    >
      <span>{children}</span>
      <span className="text-xs text-ink/40 shrink-0">{new Date(date).toLocaleDateString()}</span>
    </motion.div>
  )
}

function Empty() {
  return <p className="px-4 py-4 text-sm text-ink/40">Nothing recorded yet.</p>
}
