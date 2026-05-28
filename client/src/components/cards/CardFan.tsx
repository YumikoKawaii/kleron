import { useState } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from './TarotCard'
import type { Card } from '../../pb/kleron/v1/tarot_pb'

interface CardFanProps {
  cards: Card[]
}

const FAN_ANGLES  = [-16, 0, 16]
const FAN_OFFSETS = [-52, 0, 52]

const ORBIT_R  = 65   // radius of orbit circle
const SPIN_DEG = 900  // 2.5 full turns

// Precompute circular orbit keyframes for each of 3 cards (evenly spaced, starting at top)
const ORBIT_KF = [0, 1, 2].map(i => {
  const startA = (i / 3) * 360 - 90   // -90°, 30°, 150°
  const n = 54
  const x: number[] = []
  const y: number[] = []
  for (let s = 0; s <= n; s++) {
    const a = (startA + (s / n) * SPIN_DEG) * (Math.PI / 180)
    x.push(Math.round(Math.cos(a) * ORBIT_R))
    y.push(Math.round(Math.sin(a) * ORBIT_R))
  }
  return { x, y }
})

const ORBIT_DOTS = Array.from({ length: 8 }, (_, j) => {
  const a = (j * 45) * (Math.PI / 180)
  return {
    cx: +(Math.cos(a) * 88).toFixed(1),
    cy: +(Math.sin(a) * 88).toFixed(1),
  }
})

export function CardFan({ cards }: CardFanProps) {
  const [revealed, setRevealed] = useState<boolean[]>(cards.map(() => false))
  const [phase, setPhase] = useState<'spinning' | 'fanned'>('spinning')

  function revealCard(i: number) {
    if (phase !== 'fanned') return
    setRevealed(prev => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  return (
    <div className="relative" style={{ width: 420, height: 380 }}>
      {/* magic circle — centered in container, spins during orbit */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <motion.svg
          width={210} height={210} viewBox="-105 -105 210 210"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'spinning' ? 1 : 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.g
            animate={{ rotate: phase === 'spinning' ? 360 : 0 }}
            transition={{ duration: 5, ease: 'linear', repeat: phase === 'spinning' ? Infinity : 0 }}
          >
            <circle r={96} fill="none" stroke="#7a2a4a" strokeWidth={0.7} strokeDasharray="4 5" opacity={0.55} />
            <circle r={88} fill="none" stroke="#7a2a4a" strokeWidth={0.35} strokeDasharray="2 4" opacity={0.4} />
            {ORBIT_DOTS.map((d, j) => (
              <circle key={j} cx={d.cx} cy={d.cy} r={1.7} fill="#7a2a4a" opacity={0.65} />
            ))}
          </motion.g>
          {/* counter-rotating inner ring for layered effect */}
          <motion.g
            animate={{ rotate: phase === 'spinning' ? -360 : 0 }}
            transition={{ duration: 7, ease: 'linear', repeat: phase === 'spinning' ? Infinity : 0 }}
          >
            <circle r={72} fill="none" stroke="#7a2a4a" strokeWidth={0.25} strokeDasharray="1 5" opacity={0.3} />
          </motion.g>
        </motion.svg>
      </div>

      {/* orbiting / fanning cards */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
        {cards.map((card, i) => {
          const kf         = ORBIT_KF[i] ?? { x: [0], y: [0] }
          const fanAngle   = FAN_ANGLES[i]  ?? 0
          const fanOffsetX = FAN_OFFSETS[i] ?? 0

          return (
            <motion.div
              key={card.id}
              initial={{
                opacity: 0, scale: 0.55,
                x: kf.x[0], y: kf.y[0],
                rotate: 0,
              }}
              animate={phase === 'spinning' ? {
                opacity: 1,
                scale: 0.6,
                x: kf.x,
                y: kf.y,
                rotate: 0,
              } : {
                opacity: 1,
                scale: 1,
                x: fanOffsetX,
                y: 0,
                rotate: fanAngle,
              }}
              transition={phase === 'spinning' ? {
                opacity: { duration: 0.35 },
                scale:   { duration: 0.35 },
                x: { duration: 2.4, ease: 'linear' },
                y: { duration: 2.4, ease: 'linear' },
              } : {
                delay: i * 0.1,
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={
                phase === 'spinning' && i === 0
                  ? () => setPhase('fanned')
                  : undefined
              }
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
    </div>
  )
}
