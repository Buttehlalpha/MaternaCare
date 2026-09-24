import { useEffect, useState } from 'react'
import hero1 from '../assets/hero-1.jpg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'
import hero4 from '../assets/hero-4.jpg'
import hero5 from '../assets/hero-5.jpg'

const SLIDES = [
  {
    src: hero1,
    caption: 'First contact — registration and antenatal history',
  },
  {
    src: hero2,
    caption: 'Clinical assessment — vitals, weight, blood pressure',
  },
  {
    src: hero3,
    caption: 'Laboratory results reviewed alongside the patient record',
  },
  {
    src: hero4,
    caption: 'Medication and follow-up appointments, tracked together',
  },
  {
    src: hero5,
    caption: 'Every visit, building toward a safe delivery',
  },
  {
    src: 'https://images.unsplash.com/photo-1610401162696-dad858f5b16d?auto=format&fit=crop&w=1800&q=80',
    caption: 'Care that continues — from first visit to delivery day',
  },
]

export default function HeroCarousel({ variant = 'card', showCaptions = true }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length)
    }, 4200)
    return () => clearInterval(id)
  }, [])

  const isFullBleed = variant === 'fullBleed'

  return (
    <div
      className={
        isFullBleed
          ? 'absolute inset-0 overflow-hidden'
          : 'relative w-full h-[340px] sm:h-[420px] lg:h-[560px] rounded-2xl overflow-hidden shadow-xl shadow-forest-dark/10 ring-1 ring-black/5'
      }
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <img
            src={slide.src}
            alt={slide.caption}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {isFullBleed ? (
            <div className="absolute inset-0 bg-forest-dark/60" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          )}
          {showCaptions && !isFullBleed && (
            <p className="absolute bottom-5 left-5 right-5 text-cream text-sm sm:text-base font-medium">
              {slide.caption}
            </p>
          )}
        </div>
      ))}

      <div className={`absolute ${isFullBleed ? 'bottom-8 left-1/2 -translate-x-1/2' : 'top-4 right-4'} flex gap-1.5`}>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === active ? '22px' : '8px',
              backgroundColor: i === active ? '#D9A441' : 'rgba(255,255,255,0.55)',
            }}
          />
        ))}
      </div>
    </div>
  )
}