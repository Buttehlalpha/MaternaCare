import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'

const emptyForm = {
  full_name: '',
  age: '',
  date_of_birth: '',
  address: '',
  phone_number: '',
  marital_status: '',
  occupation: '',
  blood_group: '',
  next_of_kin: '',
  next_of_kin_phone: '',
}

export default function Patients() {
  const { profile } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchPatients = async () => {
    setLoading(true)
    let req = supabase.from('patients').select('*').order('created_at', { ascending: false })
    if (query.trim()) {
      req = req.or(`full_name.ilike.%${query}%,patient_code.ilike.%${query}%,phone_number.ilike.%${query}%`)
    }
    const { data, error } = await req
    if (!error) setPatients(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(fetchPatients, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      date_of_birth: form.date_of_birth || null,
      registered_by: profile?.id ?? null,
    }
    const { error } = await supabase.from('patients').insert(payload)
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setForm(emptyForm)
    setShowForm(false)
    fetchPatients()
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-medium">Patients</h1>
          <p className="mt-1.5 text-ink/60">Register new mothers and search existing antenatal records.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 bg-forest text-cream px-4 py-2.5 rounded-full text-sm font-medium hover:bg-forest-dark transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Register patient'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="mt-6 rounded-2xl border border-line bg-white p-6 grid sm:grid-cols-2 gap-4 overflow-hidden"
          >
          <Field label="Full name" name="full_name" value={form.full_name} onChange={handleChange} required />
          <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
          <Field label="Date of birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
          <Field label="Phone number" name="phone_number" value={form.phone_number} onChange={handleChange} />
          <Field label="Address" name="address" value={form.address} onChange={handleChange} className="sm:col-span-2" />
          <Field label="Marital status" name="marital_status" value={form.marital_status} onChange={handleChange} />
          <Field label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />
          <Field label="Blood group" name="blood_group" value={form.blood_group} onChange={handleChange} />
          <Field label="Next of kin" name="next_of_kin" value={form.next_of_kin} onChange={handleChange} />
          <Field label="Next of kin phone" name="next_of_kin_phone" value={form.next_of_kin_phone} onChange={handleChange} />

          {error && <p className="sm:col-span-2 text-sm text-clay-dark">{error}</p>}

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save patient'}
            </button>
          </div>
        </motion.form>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mt-6 relative max-w-sm"
      >
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ID or phone"
          className="w-full rounded-full border border-ink/15 pl-10 pr-4 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
        />
      </motion.div>

      <div className="mt-4 rounded-2xl border border-line bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sage/40 text-left text-ink/60">
            <tr>
              <th className="px-4 py-3 font-medium">Patient ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink/50">Loading…</td></tr>
            )}
            {!loading && patients.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink/50">No patients found.</td></tr>
            )}
            {patients.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                className="hover:bg-cream/60"
              >
                <td className="px-4 py-3 font-mono text-xs text-forest">{p.patient_code}</td>
                <td className="px-4 py-3">
                  <Link to={`/app/patients/${p.id}`} className="hover:underline">{p.full_name}</Link>
                </td>
                <td className="px-4 py-3">{p.age ?? '—'}</td>
                <td className="px-4 py-3">{p.phone_number ?? '—'}</td>
                <td className="px-4 py-3 text-ink/50">{new Date(p.created_at).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
      />
    </div>
  )
}
