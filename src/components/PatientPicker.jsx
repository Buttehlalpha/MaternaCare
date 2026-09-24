import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function PatientPicker({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('patients')
        .select('id, full_name, patient_code')
        .or(`full_name.ilike.%${query}%,patient_code.ilike.%${query}%`)
        .limit(8)
      setResults(data ?? [])
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-forest/40 bg-forest/5 px-3.5 py-2.5 text-sm">
        <span>
          <strong>{value.full_name}</strong>{' '}
          <span className="text-ink/50 font-mono text-xs">{value.patient_code}</span>
        </span>
        <button type="button" onClick={() => onChange(null)} className="text-xs text-forest hover:underline">
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search patient by name or ID"
        className="w-full rounded-lg border border-ink/15 pl-9 pr-3.5 py-2.5 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none"
      />
      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-line bg-white shadow-lg overflow-hidden">
          {results.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                onChange(p)
                setQuery('')
                setOpen(false)
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-cream/80"
            >
              {p.full_name} <span className="text-ink/40 font-mono text-xs">{p.patient_code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
