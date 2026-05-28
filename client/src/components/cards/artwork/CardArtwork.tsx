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

const INK = '#2a1e38'

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

// Renders the motif composition as a <g> for embedding inside a parent SVG.
// The coordinate space is 0–100 × 0–111 (motifs are authored to this zone).
// Caller is responsible for applying any filter (e.g. aged paper displacement).
export function CardArtwork({ card, isReversed }: Props) {
  const composition = cardCompositions[card.id]
  return (
    <g>
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
  )
}
