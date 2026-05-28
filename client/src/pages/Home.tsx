import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { tarotClient } from '../lib/rpc'
import { DrawSequence } from '../components/cards/DrawSequence'
import type { Card } from '../pb/kleron/v1/tarot_pb'

const SPREAD_OPTIONS = [
  { size: 1 as const, label: 'One Card',    type: 'single'     },
  { size: 3 as const, label: 'Three Cards', type: 'three-card' },
] satisfies { size: 1 | 3; label: string; type: string }[]

const DECK_SIZE = 9   // cards drawn for the carousel

export function Home() {
  const navigate = useNavigate()
  const [question,   setQuestion]   = useState('')
  const [spreadIdx,  setSpreadIdx]  = useState(1)   // default: three-card
  const [deckCards,  setDeckCards]  = useState<Card[]>([])
  const [readingId,  setReadingId]  = useState<string | null>(null)
  const [drawing,    setDrawing]    = useState(false)

  const spread = SPREAD_OPTIONS[spreadIdx]!

  async function handleDraw() {
    if (drawing) return
    setDrawing(true)
    setDeckCards([])
    setReadingId(null)
    try {
      const res = await tarotClient.drawCards({
        count:      DECK_SIZE,
        question,
        spreadType: spread.type,
      })
      setDeckCards(res.cards)
      setReadingId(res.readingId)
    } finally {
      setDrawing(false)
    }
  }

  function handleComplete(_selected: Card[]) {
    setTimeout(() => navigate(`/reading/${readingId}`), 700)
  }

  if (deckCards.length > 0) {
    return (
      <div className="min-h-screen bg-parchment-50">
        <DrawSequence
          spreadSize={spread.size}
          deckCards={deckCards}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col items-center justify-center gap-10 px-4">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-4xl text-ink tracking-widest"
      >
        Kleron
      </motion.h1>

      <div className="w-full max-w-md space-y-5">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleDraw()}
          placeholder="Ask your question…"
          className="w-full bg-transparent border-b border-parchment-300 py-2 font-body italic text-ink placeholder:text-ink-fade focus:outline-none focus:border-parchment-500"
        />

        {/* Spread selector */}
        <div className="flex gap-3">
          {SPREAD_OPTIONS.map((opt, i) => (
            <button
              key={opt.size}
              onClick={() => setSpreadIdx(i)}
              className={`flex-1 py-2 border font-display text-xs tracking-widest uppercase transition-colors ${
                spreadIdx === i
                  ? 'border-ink text-ink bg-parchment-100'
                  : 'border-parchment-300 text-ink-fade hover:border-parchment-400 hover:text-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDraw}
          disabled={drawing}
          className="w-full py-3 border border-parchment-400 font-display text-sm tracking-widest uppercase text-ink hover:bg-parchment-100 transition-colors disabled:opacity-40"
        >
          <AnimatePresence mode="wait" initial={false}>
            {drawing ? (
              <motion.span
                key="drawing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="block"
              >
                The cards are being laid…
              </motion.span>
            ) : (
              <motion.span
                key="draw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="block"
              >
                Draw
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

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
