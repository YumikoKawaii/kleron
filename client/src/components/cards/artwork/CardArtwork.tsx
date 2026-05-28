import type { Card } from '../../../pb/kleron/v1/tarot_pb'
import { cardCompositions, type MotifName } from './cardCompositions'
import { MotifMoon }    from './motifs/MotifMoon'
import { MotifSun }     from './motifs/MotifSun'
import { MotifStar }    from './motifs/MotifStar'
import { MotifEye }     from './motifs/MotifEye'
import { MotifSerpent } from './motifs/MotifSerpent'
import { MotifHand }    from './motifs/MotifHand'
import { MotifFlame }   from './motifs/MotifFlame'
import { MotifPillar }  from './motifs/MotifPillar'
import { MotifWheel }   from './motifs/MotifWheel'
import { MotifWings }   from './motifs/MotifWings'
import { MotifWave }    from './motifs/MotifWave'
import { MotifBlade }   from './motifs/MotifBlade'
import { SuitWand }     from './suits/SuitWand'
import { SuitCup }      from './suits/SuitCup'
import { SuitSword }    from './suits/SuitSword'
import { SuitPentacle } from './suits/SuitPentacle'

const INK = '#2c1d0e'
const PARCHMENT = '#fdf8f0'

type MotifComponent = React.ComponentType<{ stroke?: string; opacity?: number }>

const MOTIF_MAP: Record<MotifName, MotifComponent> = {
  moon: MotifMoon, sun: MotifSun, star: MotifStar,
  eye: MotifEye, serpent: MotifSerpent, hand: MotifHand,
  flame: MotifFlame, pillar: MotifPillar, wheel: MotifWheel,
  wings: MotifWings, wave: MotifWave, blade: MotifBlade,
  wand: SuitWand, cup: SuitCup, sword: SuitSword, pentacle: SuitPentacle,
}

interface Props {
  card: Card
  isReversed?: boolean
}

export function CardArtwork({ card, isReversed }: Props) {
  const composition = cardCompositions[card.id]

  return (
    <svg
      viewBox="0 0 100 160"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        {/* subtle aged-paper displacement — gives lines a hand-drawn quality */}
        <filter id="aged" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.35"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* background */}
      <rect width={100} height={160} fill={PARCHMENT} />

      {/* outer border */}
      <rect x={2} y={2} width={96} height={156} fill="none" stroke={INK} strokeWidth={0.8} />
      {/* inner border */}
      <rect x={4.5} y={4.5} width={91} height={121} fill="none" stroke={INK} strokeWidth={0.35} />

      {/* corner ornaments — small 4-pt crosses */}
      {([
        [4.5, 4.5], [95.5, 4.5], [4.5, 125.5], [95.5, 125.5],
      ] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx - 2} y1={cy} x2={cx + 2} y2={cy} stroke={INK} strokeWidth={0.45} />
          <line x1={cx} y1={cy - 2} x2={cx} y2={cy + 2} stroke={INK} strokeWidth={0.45} />
        </g>
      ))}

      {/* motifs */}
      <g filter="url(#aged)">
        {composition?.motifs.map((p, i) => {
          const M = MOTIF_MAP[p.motif]
          if (!M) return null
          const transform = [
            `translate(${p.x} ${p.y})`,
            p.rotation ? `rotate(${p.rotation})` : '',
            `scale(${p.scale ?? 1})`,
          ].filter(Boolean).join(' ')
          return (
            <g key={i} transform={transform}>
              <M stroke={INK} opacity={isReversed ? (p.opacity ?? 1) * 0.55 : (p.opacity ?? 1)} />
            </g>
          )
        })}
      </g>

      {/* name area — ruled separator */}
      <line x1={4.5} y1={128} x2={95.5} y2={128} stroke={INK} strokeWidth={0.4} />

      {/* card name */}
      <text
        x={50} y={142}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize={5.5}
        fill={INK}
        letterSpacing={1.2}
      >
        {card.name.toUpperCase()}
      </text>

      {/* reversed indicator */}
      {isReversed && (
        <text
          x={50} y={153}
          textAnchor="middle"
          fontFamily="IM Fell English, serif"
          fontSize={4}
          fill={INK}
          opacity={0.55}
          fontStyle="italic"
        >
          reversed
        </text>
      )}
    </svg>
  )
}
