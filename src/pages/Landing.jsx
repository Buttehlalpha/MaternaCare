import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserPlus,
  Stethoscope,
  FlaskConical,
  Pill,
  CalendarClock,
  FileBarChart,
  ArrowRight,
} from 'lucide-react'
import HeroCarousel from '../components/HeroCarousel.jsx'
import Footer from '../components/Footer.jsx'
import logo from '../assets/logo-1.png'

const MODULES = [
  {
    icon: UserPlus,
    title: 'Patient registration',
    body: 'Capture a mother\u2019s details once — name, age, address, next of kin — and generate her patient ID automatically.',
  },
  {
    icon: Stethoscope,
    title: 'Clinical assessment',
    body: 'Record weight, blood pressure, gestational age and fetal heart rate at every visit, linked to her history.',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory',
    body: 'Log blood group, genotype, HIV and hepatitis screening results the moment they\u2019re ready.',
  },
  {
    icon: Pill,
    title: 'Medication',
    body: 'Track iron, folic acid and antimalarial prescriptions with dosage, frequency and the prescribing officer.',
  },
  {
    icon: CalendarClock,
    title: 'Appointments',
    body: 'Schedule follow-up visits and keep every mother on track through her trimester.',
  },
  {
    icon: FileBarChart,
    title: 'Reports',
    body: 'Generate patient summaries and maternal health statistics for review at any time.',
  },
]

const ROLES = [
  { name: 'Administrator', detail: 'Full access — staff accounts, permissions and system-wide reports.' },
  { name: 'Doctor', detail: 'Views records, records diagnoses, and prescribes medication.' },
  { name: 'Nurse / Midwife', detail: 'Registers patients, records vitals, schedules appointments.' },
  { name: 'Laboratory personnel', detail: 'Views test requests and enters results against a patient.' },
  { name: 'Receptionist', detail: 'Registers patients and manages the appointment book.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

export default function Landing() {
  return (
    <div className="bg-cream overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-30 bg-cream/80 backdrop-blur-md border-b border-line"
      >
        <div className="container-content flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Antenatal" className="h-14 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
            <a href="#modules" className="hover:text-ink transition-colors">Modules</a>
            <a href="#roles" className="hover:text-ink transition-colors">Roles</a>
            <Link to="/login" className="hover:text-ink transition-colors">Staff login</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-block text-sm font-medium px-4 py-2 rounded-full border border-ink/15 hover:border-forest hover:text-forest transition-colors"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block text-sm font-medium px-4 py-2 rounded-full bg-forest text-cream hover:bg-forest-dark transition-colors"
              >
                Create account
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <HeroCarousel variant="fullBleed" />

        <div className="relative z-10 container-content text-center py-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl leading-[1.08] font-medium text-cream max-w-3xl mx-auto"
            >
              One record, from a mother&rsquo;s first visit to a safe delivery.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mt-6 text-cream/80 text-lg max-w-xl mx-auto leading-relaxed"
            >
              This system brings registration, clinical assessment, laboratory results, medication
              and appointments into a single antenatal record — so every clinician sees
              the same story, at the same time.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mt-9 flex items-center justify-center gap-4 flex-wrap"
            >
              <Link to="/signup">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-forest text-cream px-6 py-3 rounded-full font-medium hover:bg-forest-dark transition-colors"
                >
                  Get started <ArrowRight size={17} />
                </motion.span>
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 text-sm font-medium text-cream/90 border border-cream/30 px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                See what it does
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="container-content py-16 border-t border-line">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-3xl max-w-lg"
        >
          Everything a clinic needs to run antenatal care, in one flow.
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
        >
          {MODULES.map(({ icon: Icon, title, body }) => (
            <motion.div key={title} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4 }}>
              <Icon size={22} strokeWidth={1.6} className="text-forest" />
              <h3 className="mt-3 text-lg font-medium font-sans">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/65 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-forest-dark text-cream py-16">
        <div className="container-content">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-3xl max-w-lg text-cream"
          >
            Built around who actually does the work.
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-10 divide-y divide-white/10 border-t border-b border-white/10"
          >
            {ROLES.map((r) => (
              <motion.div key={r.name} variants={fadeUp} transition={{ duration: 0.5 }} className="grid sm:grid-cols-3 gap-2 sm:gap-8 py-5">
                <p className="font-medium">{r.name}</p>
                <p className="sm:col-span-2 text-cream/70 text-sm leading-relaxed">{r.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="container-content py-16 text-center"
      >
        <h2 className="text-3xl">Ready to bring your antenatal records online?</h2>
        <Link to="/signup">
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 inline-flex items-center gap-2 bg-clay text-cream px-6 py-3 rounded-full font-medium hover:bg-clay-dark transition-colors"
          >
            Create an account <ArrowRight size={17} />
          </motion.span>
        </Link>
      </motion.section>

      <Footer />
    </div>
  )
}