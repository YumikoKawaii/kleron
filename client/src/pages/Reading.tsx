import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tarotClient } from '../lib/rpc'
import type { Reading as TReading } from '../gen/kleron/v1/tarot_pb'

export function Reading() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reading, setReading] = useState<TReading | null>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    // TODO: add GetReading RPC — for now find from history
    tarotClient.getReadingHistory({ page: 1, pageSize: 50 })
      .then(res => setReading(res.readings.find(r => r.id === id) ?? null))
  }, [id])

  if (!reading) {
    return (
      <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
        <p className="font-body italic text-ink-fade animate-pulse">Unfolding the veil…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment-50 px-6 py-12 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="font-body text-sm text-ink-fade hover:text-ink mb-8 block">← Back</button>

      {reading.question && (
        <p className="font-body italic text-ink-fade mb-10 text-center text-lg">"{reading.question}"</p>
      )}

      <div className="space-y-10">
        {reading.cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="border border-parchment-200 p-6 cursor-pointer hover:border-parchment-400 transition-colors"
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-24 bg-parchment-100 border border-parchment-300 flex-shrink-0 flex items-center justify-center text-xs text-ink-fade font-display">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                ) : '✦'}
              </div>
              <div>
                <h2 className="font-display text-xl text-ink tracking-wide">{card.name}</h2>
                {card.isReversed && <span className="text-xs text-mystic-500 font-body italic">Reversed</span>}
                <p className="font-body text-ink-fade mt-1 text-sm">{card.keywords.join(' · ')}</p>
              </div>
            </div>

            {activeIdx === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 font-body text-ink leading-relaxed"
              >
                {card.isReversed ? card.reversedMeaning : card.uprightMeaning}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
