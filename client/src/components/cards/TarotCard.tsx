import { motion } from 'framer-motion'
import type { Card } from '../../pb/kleron/v1/tarot_pb'
import { CardArtwork } from './artwork/CardArtwork'

interface TarotCardProps {
  card: Card
  revealed?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export function TarotCard({ card, revealed = false, onClick, style }: TarotCardProps) {
  return (
    <motion.div
      style={{ perspective: 1000, ...style }}
      className="cursor-pointer w-28 h-48 relative"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: revealed ? 0 : 180 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardArtwork card={card} isReversed={card.isReversed} />
        </div>

        {/* Back face — plain ruled parchment */}
        <div
          className="absolute inset-0 bg-parchment-100 border border-parchment-300 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <svg viewBox="0 0 100 160" width="100%" height="100%">
            <rect width={100} height={160} fill="#f9edda" />
            <rect x={2} y={2} width={96} height={156} fill="none" stroke="#2c1d0e" strokeWidth={0.8} />
            <rect x={5} y={5} width={90} height={150} fill="none" stroke="#2c1d0e" strokeWidth={0.35} />
            {/* back motif — single 8-pointed star */}
            <g transform="translate(50 80)">
              {Array.from({ length: 16 }, (_, i) => {
                const a = ((i * 22.5) - 90) * (Math.PI / 180)
                const isLong = i % 2 === 0
                return (
                  <line key={i}
                    x1={+(Math.cos(a) * 6.5).toFixed(2)}
                    y1={+(Math.sin(a) * 6.5).toFixed(2)}
                    x2={+(Math.cos(a) * (isLong ? 22 : 17)).toFixed(2)}
                    y2={+(Math.sin(a) * (isLong ? 22 : 17)).toFixed(2)}
                    stroke="#2c1d0e" strokeWidth={isLong ? 0.6 : 0.4} />
                )
              })}
              <circle r={6.5} fill="#f9edda" stroke="#2c1d0e" strokeWidth={0.8} />
              <circle r={3.5} fill="none" stroke="#2c1d0e" strokeWidth={0.35} strokeDasharray="1 1.5" />
              <circle r={0.7} fill="#2c1d0e" />
            </g>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  )
}
