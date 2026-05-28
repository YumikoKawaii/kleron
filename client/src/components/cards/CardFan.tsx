import { useState } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from './TarotCard'
import type { Card } from '../../gen/kleron/v1/tarot_pb'

interface CardFanProps {
  cards: Card[]
}

const FAN_ANGLES = [-18, 0, 18]
const FAN_OFFSETS = [-40, 0, 40]

export function CardFan({ cards }: CardFanProps) {
  const [revealed, setRevealed] = useState<boolean[]>(cards.map(() => false))

  function revealCard(i: number) {
    setRevealed(prev => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  return (
    <div className="relative flex items-end justify-center h-64 w-80">
      {cards.map((card, i) => {
        const angle = FAN_ANGLES[i] ?? 0
        const offsetX = FAN_OFFSETS[i] ?? 0

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 60, rotate: 0, x: 0 }}
            animate={{ opacity: 1, y: 0, rotate: angle, x: offsetX }}
            transition={{
              delay: i * 0.18,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ position: 'absolute', originY: 1 }}
          >
            <TarotCard
              card={card}
              revealed={revealed[i]}
              onClick={() => revealCard(i)}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
