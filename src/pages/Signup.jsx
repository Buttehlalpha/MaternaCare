import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'

const ROLE_OPTIONS = [
  { value: 'nurse', label: 'Nurse / Midwife' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'lab_personnel', label: 'Laboratory personnel' },
  { value: 'receptionist', label: 'Receptionist' },
]

export default function Signup() {
  const { session } = useAuth()
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('nurse')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (session) return <Navigate to="/app" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }

    // If email confirmation is off, Supabase returns a session immediately.
    if (data.session) {
      navigate('/app')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <AuthLayout eyebrow="Account created" title="Check your email" subtitle="">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-sm text-ink/70 leading-relaxed">
            We&rsquo;ve sent a confirmation link to <strong>{email}</strong>. Once confirmed,
            you can sign in and go straight to your {ROLE_OPTIONS.find((r) => r.value === role)?.label.toLowerCase()} dashboard.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm text-forest font-medium hover:underline">
            Back to sign in
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="Create an account"
      title="Join your clinic on Antenatal"
      subtitle="Choose your role below — you'll go straight to your own dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1.5">Full name</label>
          <input
            id="full_name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-shadow"
            placeholder="Amaka Obi"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1.5">Your role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-shadow bg-white"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-ink/50">
            Need administrator access? Ask an existing administrator to promote your account from User management.
          </p>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-shadow"
            placeholder="you@clinic.org"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-shadow"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-clay-dark">
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="w-full bg-forest text-cream rounded-full py-2.5 text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </motion.button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="text-forest font-medium hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
