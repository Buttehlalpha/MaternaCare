import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo-1.png'

export default function Preloader({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-forest-dark"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-5">
            <motion.img
              src={logo}
              alt="Antenatal"
              className="h-16 w-auto"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: [0.85, 1.08, 1], opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <motion.div
              className="h-[2px] w-28 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}