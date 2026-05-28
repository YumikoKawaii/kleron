import { motion } from 'framer-motion'
import type { Card } from '../../pb/kleron/v1/tarot_pb'
import { CardArtwork } from './artwork/CardArtwork'

const INK = '#2a1e38'
const PARCHMENT = '#fdf8f0'

function toRoman(n: number): string {
  if (n === 0) return '0'
  const pairs: [number, string][] = [
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'],
    [5, 'V'],  [4, 'IV'],  [1, 'I'],
  ]
  let result = ''
  for (const [val, sym] of pairs) {
    while (n >= val) { result += sym; n -= val }
  }
  return result
}

function accentColor(id: string): string {
  if (id.startsWith('wands-'))     return '#a06c0a'   // amber
  if (id.startsWith('cups-'))      return '#3b6880'   // slate blue
  if (id.startsWith('swords-'))    return '#5a5a6e'   // slate gray
  if (id.startsWith('pentacles-')) return '#366b4e'   // forest green
  return '#7a2a4a'                                     // burgundy — Major Arcana
}

// ── sub-components ────────────────────────────────────────────────────────────

function CornerMark({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <line x1={cx - 3.5} y1={cy} x2={cx + 3.5} y2={cy} stroke={INK} strokeWidth={0.55} />
      <line x1={cx} y1={cy - 3.5} x2={cx} y2={cy + 3.5} stroke={INK} strokeWidth={0.55} />
    </>
  )
}

function Divider({ y }: { y: number }) {
  return (
    <>
      <line x1={11} y1={y} x2={149} y2={y} stroke={INK} strokeWidth={0.3} opacity={0.7} />
      {/* diamond ornament centered on the divider */}
      <rect
        x={76.5} y={y - 3.5} width={7} height={7}
        transform={`rotate(45 80 ${y})`}
        fill={PARCHMENT} stroke={INK} strokeWidth={0.4}
      />
    </>
  )
}

// ── front face ────────────────────────────────────────────────────────────────

function FrontFace({ card }: { card: Card }) {
  const accent = accentColor(card.id)
  const numeral = toRoman(card.number)
  const keywords = card.keywords.slice(0, 3).join(' · ')
  const filterId = `aged-${card.id}`

  // All card content lives in this group; rotate 180° around card centre when reversed.
  const content = (
    <g transform={card.isReversed ? 'rotate(180 80 140)' : undefined}>
      {/* parchment ground */}
      <rect width={160} height={280} fill={PARCHMENT} />

      {/* suit accent border (thin coloured line) */}
      <rect x={3} y={3} width={154} height={274} fill="none" stroke={accent} strokeWidth={1.3} />

      {/* outer ink border */}
      <rect x={4.5} y={4.5} width={151} height={271} fill="none" stroke={INK} strokeWidth={0.7} />

      {/* inner ink border */}
      <rect x={9} y={9} width={142} height={262} fill="none" stroke={INK} strokeWidth={0.3} />

      {/* inner border corners */}
      <CornerMark cx={9}   cy={9}   />
      <CornerMark cx={151} cy={9}   />
      <CornerMark cx={9}   cy={271} />
      <CornerMark cx={151} cy={271} />

      {/* ── top section: arcana numeral ── */}
      <text
        x={80} y={31}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize={9}
        letterSpacing={2.5}
        fill={INK}
        opacity={0.8}
      >
        {numeral}
      </text>

      <Divider y={42} />

      {/* ── art area ── */}
      {/* viewBox 0 0 100 111 → scale 144/100 = 1.44 both axes (144×160 / 100×111) */}
      <svg x={8} y={43} width={144} height={160} viewBox="0 0 100 111" overflow="hidden">
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="3" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.35"
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <CardArtwork card={card} isReversed={card.isReversed} />
        </g>
      </svg>

      <Divider y={208} />

      {/* ── bottom section: title + keywords ── */}
      <text
        x={80} y={226}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize={7.5}
        letterSpacing={1.8}
        fill={INK}
      >
        {card.name.toUpperCase()}
      </text>

      <text
        x={80} y={246}
        textAnchor="middle"
        fontFamily="IM Fell English, serif"
        fontStyle="italic"
        fontSize={5.5}
        letterSpacing={0.4}
        fill={INK}
        opacity={0.58}
      >
        {keywords}
      </text>
    </g>
  )

  // Reversed label sits outside the rotation group so it always reads upright.
  const reversedLabel = card.isReversed ? (
    <text
      x={80} y={270}
      textAnchor="middle"
      fontFamily="Cinzel, serif"
      fontSize={4.5}
      letterSpacing={1.5}
      fill={accent}
      opacity={0.75}
    >
      REVERSED
    </text>
  ) : null

  return (
    <svg viewBox="0 0 160 280" width={160} height={280}>
      {content}
      {reversedLabel}
    </svg>
  )
}

// ── back face ─────────────────────────────────────────────────────────────────

function BackFace() {
  // Six hexagram vertex positions (circumradius 22, in SVG y-down coords)
  const hexPoints = [-90, -30, 30, 90, 150, 210].map(deg => {
    const r = (deg * Math.PI) / 180
    return { x: +(Math.cos(r) * 22).toFixed(2), y: +(Math.sin(r) * 22).toFixed(2) }
  })

  return (
    <svg viewBox="0 0 160 280" width={160} height={280}>
      <defs>
        {/* Repeating diamond tile for the border strip */}
        <pattern id="back-tile" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect
            x={2.5} y={2.5} width={3} height={3}
            transform="rotate(45 4 4)"
            fill="none" stroke={INK} strokeWidth={0.38}
          />
        </pattern>
      </defs>

      {/* Base parchment */}
      <rect width={160} height={280} fill={PARCHMENT} />

      {/* Diamond pattern (fills whole surface, inner panel will cover it) */}
      <rect width={160} height={280} fill="url(#back-tile)" />

      {/* Inner panel — covers the pattern, reveals only the border strip */}
      <rect x={12} y={12} width={136} height={256} fill={PARCHMENT} />

      {/* Outer border */}
      <rect x={3} y={3} width={154} height={274} fill="none" stroke={INK} strokeWidth={0.8} />

      {/* Inner border */}
      <rect x={12} y={12} width={136} height={256} fill="none" stroke={INK} strokeWidth={0.4} />

      {/* Inner border corners */}
      <CornerMark cx={12}  cy={12}  />
      <CornerMark cx={148} cy={12}  />
      <CornerMark cx={12}  cy={268} />
      <CornerMark cx={148} cy={268} />

      {/* ── central sigil, centered at (80, 136) ── */}
      <g transform="translate(80 136)">

        {/* outer dashed orbit */}
        <circle r={36} fill="none" stroke={INK} strokeWidth={0.35} strokeDasharray="2 3" opacity={0.6} />

        {/* hexagram — two overlapping equilateral triangles */}
        <polygon points="0,-22 19.05,11 -19.05,11" fill="none" stroke={INK} strokeWidth={0.9} />
        <polygon points="0,22 19.05,-11 -19.05,-11" fill="none" stroke={INK} strokeWidth={0.9} />

        {/* inner ring */}
        <circle r={9} fill="none" stroke={INK} strokeWidth={0.5} />

        {/* inner dashed ring */}
        <circle r={5.5} fill="none" stroke={INK} strokeWidth={0.3} strokeDasharray="1.2 1.8" />

        {/* centre point */}
        <circle r={2} fill={INK} />

        {/* vertex dots */}
        {hexPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.8} fill={INK} />
        ))}

        {/* brand name */}
        <text
          y={50}
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize={7}
          letterSpacing={3.5}
          fill={INK}
          opacity={0.8}
        >
          MANTIC
        </text>

        {/* rule below brand name */}
        <line x1={-26} y1={56} x2={26} y2={56} stroke={INK} strokeWidth={0.3} opacity={0.5} />
      </g>
    </svg>
  )
}

// ── public component ──────────────────────────────────────────────────────────

interface TarotCardProps {
  card: Card
  revealed?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export function TarotCard({ card, revealed = false, onClick, style }: TarotCardProps) {
  return (
    <motion.div
      style={{ perspective: 1000, width: 160, height: 280, flexShrink: 0, ...style }}
      className="cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
        animate={{ rotateY: revealed ? 0 : 180 }}
        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* front */}
        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}>
          <FrontFace card={card} />
        </div>

        {/* back */}
        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}>
          <BackFace />
        </div>
      </motion.div>
    </motion.div>
  )
}
