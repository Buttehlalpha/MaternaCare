import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import logo from '../assets/logo-1.png'

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
]

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream/70">
      <div className="container-content py-14">
        <div className="grid sm:grid-cols-3 gap-10">
          <div>
            <img src={logo} alt="Antenatal" className="h-12 w-auto" />
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              A computerized antenatal information system built to give every
              clinic one shared record, from first visit to safe delivery.
            </p>
          </div>

          <div>
            <p className="text-cream text-sm font-medium">System</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="/login" className="hover:text-cream transition-colors">Staff login</a></li>
              <li><a href="/signup" className="hover:text-cream transition-colors">Create an account</a></li>
              <li><a href="#modules" className="hover:text-cream transition-colors">Modules</a></li>
            </ul>
          </div>

          <div>
            <p className="text-cream text-sm font-medium">Follow along</p>
            <div className="mt-3 flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-white/10 hover:border-cream/40 transition-colors"
                >
                  <Icon size={16} strokeWidth={1.8} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between text-xs text-cream/40">
          <p>&copy; {new Date().getFullYear()} Antenatal Information System.</p>
          <p>Built for clinics, by people who care about mothers.</p>
        </div>
      </div>
    </footer>
  )
}