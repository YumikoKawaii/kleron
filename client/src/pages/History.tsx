import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tarotClient } from '../lib/rpc'
import type { Reading } from '../pb/kleron/v1/tarot_pb'

export function History() {
  const navigate = useNavigate()
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tarotClient.getReadingHistory({ page: 1, pageSize: 20 })
      .then(res => setReadings(res.readings))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-parchment-50 px-6 py-12 max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="font-body text-sm text-ink-fade hover:text-ink mb-8 block">← Back</button>

      <h1 className="font-display text-3xl text-ink tracking-widest mb-10">Past Readings</h1>

      {loading && <p className="font-body italic text-ink-fade animate-pulse">Consulting the archive…</p>}

      <div className="space-y-4">
        {readings.map((reading, i) => (
          <motion.div
            key={reading.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/reading/${reading.id}`)}
            className="border border-parchment-200 p-4 cursor-pointer hover:border-parchment-400 hover:bg-parchment-100 transition-all"
          >
            <p className="font-body italic text-ink text-sm truncate">
              {reading.question || 'No question asked'}
            </p>
            <p className="font-body text-xs text-ink-fade mt-1">
              {reading.cards.map(c => c.name).join(' · ')}
            </p>
          </motion.div>
        ))}

        {!loading && readings.length === 0 && (
          <p className="font-body italic text-ink-fade text-center py-12">No readings yet. Let the cards speak.</p>
        )}
      </div>
    </div>
  )
}
