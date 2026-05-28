import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tarotClient } from '../lib/rpc'
import { CardFan } from '../components/cards/CardFan'
import type { Card } from '../pb/kleron/v1/tarot_pb'

export function Home() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [readingId, setReadingId] = useState<string | null>(null)
  const [drawing, setDrawing] = useState(false)

  async function handleDraw() {
    if (drawing) return
    setDrawing(true)
    setCards([])
    try {
      const res = await tarotClient.drawCards({ count: 3, question, spreadType: 'three-card' })
      setCards(res.cards)
      setReadingId(res.readingId)
    } finally {
      setDrawing(false)
    }
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col items-center justify-center gap-12 px-4">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-4xl text-ink tracking-widest"
      >
        Kleron
      </motion.h1>

      <div className="w-full max-w-md space-y-4">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask your question…"
          className="w-full bg-transparent border-b border-parchment-300 py-2 font-body italic text-ink placeholder:text-ink-fade focus:outline-none focus:border-parchment-500"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDraw}
          disabled={drawing}
          className="w-full py-3 border border-parchment-400 font-display text-sm tracking-widest uppercase text-ink hover:bg-parchment-100 transition-colors disabled:opacity-40"
        >
          {drawing ? 'Drawing…' : 'Draw Three Cards'}
        </motion.button>
      </div>

      {cards.length > 0 && (
        <>
          <CardFan cards={cards} />
          {readingId && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              onClick={() => navigate(`/reading/${readingId}`)}
              className="font-body italic text-ink-fade underline underline-offset-4 hover:text-ink transition-colors"
            >
              Read the full spread →
            </motion.button>
          )}
        </>
      )}

      <nav className="fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/history')}
          className="font-body text-sm text-ink-fade hover:text-ink transition-colors"
        >
          Past readings
        </motion.button>
      </nav>
    </div>
  )
}
