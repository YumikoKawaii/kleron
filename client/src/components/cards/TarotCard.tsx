import { motion } from 'framer-motion'
import type { Card } from '../../gen/kleron/v1/tarot_pb'

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
          className="absolute inset-0 border border-parchment-300 bg-parchment-50 flex flex-col items-center justify-center p-2 gap-1"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full flex-1 object-cover"
              style={card.isReversed ? { transform: 'rotate(180deg)' } : undefined}
            />
          ) : (
            <span className="text-3xl text-parchment-400">✦</span>
          )}
          <span className="font-display text-[10px] text-ink tracking-wider text-center leading-tight">
            {card.name}
          </span>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 border border-parchment-300 bg-card-back bg-cover bg-center bg-parchment-200"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        />
      </motion.div>
    </motion.div>
  )
}
