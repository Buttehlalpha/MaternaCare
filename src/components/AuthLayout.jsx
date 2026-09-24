import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import authSide from '../assets/auth-side.jpg'
import logo from '../assets/logo-1.png'

export default function AuthLayout({ children, eyebrow, title, subtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Left: image panel */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative hidden lg:block overflow-hidden bg-forest-dark"
      >
        <img
          src={authSide}
          alt="A clinician caring for a patient"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/40 to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-10">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Antenatal" className="h-12 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="max-w-sm"
          >
            <p className="text-cream/70 text-sm uppercase tracking-wide">{eyebrow}</p>
            <p className="mt-3 text-2xl text-cream font-display leading-snug">
              One shared record for every mother, from first visit to delivery.
            </p>
            <div className="mt-6 flex gap-1.5">
              <span className="h-1 rounded-full w-8 bg-gold" />
              <span className="h-1 rounded-full w-4 bg-white/25" />
              <span className="h-1 rounded-full w-4 bg-white/25" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: form panel */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className="flex items-center justify-center px-6 py-14"
      >
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center lg:hidden">
            <img src={logo} alt="Antenatal" className="h-11 w-auto" />
          </Link>
          <h1 className="mt-6 lg:mt-0 text-2xl font-medium">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}