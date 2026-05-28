import { useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { TarotCard } from './TarotCard'
import type { Card } from '../../pb/kleron/v1/tarot_pb'

// ── Layout ─────────────────────────────────────────────────────────────────
const CAROUSEL_N  = 9
const RADIUS_X    = 198      // ellipse half-width (px)
const SPIN_SPEED  = 0.00028  // rad/ms ≈ 1 rev / 22 s
const DRAG_SENS   = 0.005    // rad/px

const CS_MIN = 0.34          // back-card scale
const CS_MAX = 0.50          // front-card scale
const CO_MIN = 0.28          // back-card opacity
const CO_MAX = 1.0
const CD_Y   = 26            // depth: front card sits this many px lower

const CARD_W     = 160
const CARD_H     = 280
const SLOT_SCALE = 0.60
const SLOT_W     = Math.round(CARD_W * SLOT_SCALE)   // 96
const SLOT_H     = Math.round(CARD_H * SLOT_SCALE)   // 168
const SLOT_GAP   = 14

const CAR_Y  = 430   // carousel anchor Y in container
const CONT_H = 600
const CAROUSEL_ZONE_Y = 260  // pointer Y above which we don't drag-capture

const SPREAD_LABELS: Record<number, string[]> = {
   1: [''],
   3: ['Past', 'Present', 'Future'],
   5: ['Situation', 'Challenge', 'Advice', 'Outcome', 'Foundation'],
  10: Array.from({ length: 10 }, (_, i) => String(i + 1)),
}

// ── CarouselCard ───────────────────────────────────────────────────────────

interface CCProps {
  card:        Card
  baseAngle:   MotionValue<number>
  angleOffset: number
  hidden:      boolean
  onSelect:    () => void
}

function CarouselCard({ card, baseAngle, angleOffset, hidden, onSelect }: CCProps) {
  const visible = useMotionValue(hidden ? 0 : 1)
  visible.set(hidden ? 0 : 1)

  const angle  = useTransform(baseAngle, a => a + angleOffset)
  const x      = useTransform(angle,    a => Math.cos(a) * RADIUS_X)
  const depth  = useTransform(angle,    a => (Math.sin(a) + 1) / 2)
  const y      = useTransform(depth,    d => (d - 1) * CD_Y)
  const scaleV = useTransform(depth,    d => CS_MIN + d * (CS_MAX - CS_MIN))
  const opa    = useTransform(
    [depth, visible] as MotionValue<number>[],
    ([d, v]: number[]) => v * (CO_MIN + d * (CO_MAX - CO_MIN)),
  )
  const zi     = useTransform(depth,    d => Math.round(d * 30))

  return (
    <motion.div
      style={{
        position:     'absolute',
        left:         -CARD_W / 2,
        top:          -CARD_H / 2,
        x, y,
        scale:        scaleV,
        opacity:      opa,
        zIndex:       zi,
        cursor:       hidden ? 'default' : 'pointer',
        pointerEvents: hidden ? 'none' : 'auto',
      }}
      onClick={hidden ? undefined : onSelect}
    >
      <TarotCard card={card} revealed={false} onClick={() => {}} />
    </motion.div>
  )
}

// ── FlyingCard ─────────────────────────────────────────────────────────────

interface FlyInfo {
  card:      Card
  fromX:     number   // card left edge, container-relative
  fromY:     number   // card top edge, container-relative
  fromScale: number
  toX:       number   // slot left edge, container-relative
  toY:       number   // slot top edge, container-relative
}

function FlyingCard({ card, fromX, fromY, fromScale, toX, toY, onDone }: FlyInfo & { onDone: () => void }) {
  const midX = fromX * 0.35 + toX * 0.65
  const midY = Math.min(fromY, toY) - 95

  return (
    <motion.div
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 500 }}
      initial={{ x: fromX, y: fromY, scale: fromScale }}
      animate={{
        x:     [fromX, midX, toX],
        y:     [fromY, midY, toY],
        scale: [fromScale, fromScale * 1.2, SLOT_SCALE],
      }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], times: [0, 0.42, 1] }}
      onAnimationComplete={onDone}
    >
      <TarotCard card={card} revealed={false} onClick={() => {}} />
    </motion.div>
  )
}

// ── Slot ───────────────────────────────────────────────────────────────────

interface SlotProps {
  card:     Card | null
  label:    string
  arriving: boolean
  revealed: boolean
  onReveal: () => void
}

function Slot({ card, label, arriving, revealed, onReveal }: SlotProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <motion.div
        initial={arriving && card ? { scale: 0.78, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 310, damping: 20 }}
        style={{ width: SLOT_W, height: SLOT_H }}
      >
        {!card ? (
          <div style={{
            width: '100%', height: '100%',
            border: '1px dashed rgba(42,30,56,0.22)',
            borderRadius: 3,
          }} />
        ) : (
          <div style={{ position: 'relative', width: SLOT_W, height: SLOT_H }}>
            <div style={{
              transform: `scale(${SLOT_SCALE})`,
              transformOrigin: 'top left',
              width: CARD_W,
              height: CARD_H,
            }}>
              <TarotCard card={card} revealed={revealed} onClick={onReveal} />
            </div>
          </div>
        )}
      </motion.div>

      {label && (
        <span style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 7,
          letterSpacing: 2,
          color: 'rgba(42,30,56,0.38)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ── DrawSequence ───────────────────────────────────────────────────────────

interface DrawSequenceProps {
  spreadSize: 1 | 3 | 5 | 10
  onComplete: (cards: Card[]) => void
  deckCards:  Card[]
}

export function DrawSequence({ spreadSize, onComplete, deckCards }: DrawSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spinRef      = useRef(true)
  const lastPtrX     = useRef<number | null>(null)
  const draggedRef   = useRef(false)

  const baseAngle = useMotionValue(0)

  const [hidden,   setHidden]   = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<Card[]>([])
  const [revealedSlots, setRevealedSlots] = useState<boolean[]>(Array(spreadSize).fill(false))
  const [arriving, setArriving] = useState<number | null>(null)
  const [flyInfo,  setFlyInfo]  = useState<FlyInfo | null>(null)
  const [phase,    setPhase]    = useState<'idle' | 'flying' | 'complete'>('idle')

  const carouselCards = deckCards.slice(0, CAROUSEL_N)

  useAnimationFrame((_, delta) => {
    if (spinRef.current) baseAngle.set(baseAngle.get() + SPIN_SPEED * delta)
  })

  function handlePtrDown(e: React.PointerEvent) {
    if (phase !== 'idle') return
    const cRect = containerRef.current?.getBoundingClientRect()
    if (!cRect) return
    const relY = e.clientY - cRect.top
    if (relY < CAROUSEL_ZONE_Y) return   // clicking in slot area — don't capture

    e.currentTarget.setPointerCapture(e.pointerId)
    lastPtrX.current = e.clientX
    draggedRef.current = false
    spinRef.current = false
  }

  function handlePtrMove(e: React.PointerEvent) {
    if (lastPtrX.current === null) return
    const dx = e.clientX - lastPtrX.current
    if (Math.abs(dx) > 4) draggedRef.current = true
    baseAngle.set(baseAngle.get() - dx * DRAG_SENS)
    lastPtrX.current = e.clientX
  }

  function handlePtrUp() {
    lastPtrX.current = null
    spinRef.current = true
    setTimeout(() => { draggedRef.current = false }, 50)
  }

  function selectCard(cardIdx: number) {
    if (phase !== 'idle') return
    if (draggedRef.current) return
    if (hidden.has(cardIdx)) return

    spinRef.current = false
    setPhase('flying')

    const currentAngle = baseAngle.get()
    const N            = carouselCards.length
    const cardAngle    = currentAngle + (cardIdx / N) * Math.PI * 2
    const depth        = (Math.sin(cardAngle) + 1) / 2
    const cardX        = Math.cos(cardAngle) * RADIUS_X
    const cardY        = (depth - 1) * CD_Y
    const cardScale    = CS_MIN + depth * (CS_MAX - CS_MIN)

    const containerW = containerRef.current?.getBoundingClientRect().width ?? 800
    const totalSlotW = spreadSize * SLOT_W + (spreadSize - 1) * SLOT_GAP

    const fromX = containerW / 2 + cardX - CARD_W / 2
    const fromY = CAR_Y + cardY - CARD_H / 2
    const toX   = (containerW - totalSlotW) / 2 + selected.length * (SLOT_W + SLOT_GAP)
    const toY   = 20

    setHidden(prev => new Set([...prev, cardIdx]))
    setFlyInfo({ card: carouselCards[cardIdx], fromX, fromY, fromScale: cardScale, toX, toY })
  }

  function handleFlyDone() {
    if (!flyInfo) return

    const newSelected = [...selected, flyInfo.card]
    const slotIdx     = selected.length

    setSelected(newSelected)
    setArriving(slotIdx)
    setFlyInfo(null)
    setTimeout(() => setArriving(null), 650)

    if (newSelected.length >= spreadSize) {
      setPhase('complete')
      spinRef.current = false
      onComplete(newSelected)
    } else {
      setPhase('idle')
      spinRef.current = true
    }
  }

  function revealSlot(i: number) {
    if (selected[i] === undefined) return
    setRevealedSlots(prev => { const n = [...prev]; n[i] = true; return n })
  }

  const labels = SPREAD_LABELS[spreadSize] ?? []

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: CONT_H }}
      onPointerDown={handlePtrDown}
      onPointerMove={handlePtrMove}
      onPointerUp={handlePtrUp}
      onPointerCancel={handlePtrUp}
    >
      {/* Spread slots */}
      <div style={{
        position:       'absolute',
        top:            20,
        left:           0,
        right:          0,
        display:        'flex',
        justifyContent: 'center',
        gap:            SLOT_GAP,
      }}>
        {Array.from({ length: spreadSize }, (_, i) => (
          <Slot
            key={i}
            card={selected[i] ?? null}
            label={labels[i] ?? ''}
            arriving={arriving === i}
            revealed={revealedSlots[i]}
            onReveal={() => revealSlot(i)}
          />
        ))}
      </div>

      {/* Carousel */}
      <AnimatePresence>
        {phase !== 'complete' && (
          <motion.div
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.55 } }}
            style={{ position: 'absolute', left: '50%', top: CAR_Y }}
          >
            {carouselCards.map((card, i) => (
              <CarouselCard
                key={card.id}
                card={card}
                baseAngle={baseAngle}
                angleOffset={(i / carouselCards.length) * Math.PI * 2}
                hidden={hidden.has(i)}
                onSelect={() => selectCard(i)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying card overlay */}
      {flyInfo && (
        <FlyingCard
          card={flyInfo.card}
          fromX={flyInfo.fromX}
          fromY={flyInfo.fromY}
          fromScale={flyInfo.fromScale}
          toX={flyInfo.toX}
          toY={flyInfo.toY}
          onDone={handleFlyDone}
        />
      )}
    </div>
  )
}
