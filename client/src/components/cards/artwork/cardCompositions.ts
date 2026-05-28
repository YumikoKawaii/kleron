export type MotifName =
  | 'moon' | 'sun' | 'star' | 'eye' | 'serpent' | 'hand'
  | 'flame' | 'pillar' | 'wheel' | 'wings' | 'wave' | 'blade'
  | 'wand' | 'cup' | 'sword' | 'pentacle'

export interface MotifPlacement {
  motif: MotifName
  x: number      // 0–100, card coordinate space (viewBox 0 0 100 160)
  y: number      // 0–160
  scale?: number // default 1
  rotation?: number // degrees, default 0
  opacity?: number  // default 1
}

export interface CardComposition {
  motifs: MotifPlacement[]
}

// ─── pip card layout positions (card coords, suit symbols arranged by number) ──

const W = { left: 30, center: 50, right: 70 }
const Y = { top: 25, uphi: 38, mid: 62, lohi: 78, bot: 90 }

const PIP_LAYOUTS: Record<number, Array<[number, number]>> = {
  1:  [[50, 62]],
  2:  [[50, Y.top], [50, Y.bot]],
  3:  [[50, Y.top], [W.left, Y.mid], [W.right, Y.mid]],
  4:  [[W.left, Y.uphi], [W.right, Y.uphi], [W.left, Y.lohi], [W.right, Y.lohi]],
  5:  [[W.left, 30], [W.right, 30], [50, 62], [W.left, 90], [W.right, 90]],
  6:  [[W.left, 28], [W.right, 28], [W.left, 62], [W.right, 62], [W.left, 92], [W.right, 92]],
  7:  [[W.left, 25], [W.right, 25], [50, 40], [W.left, 58], [W.right, 58], [W.left, 80], [W.right, 80]],
  8:  [[W.left, 22], [W.right, 22], [W.left, 42], [W.right, 42], [W.left, 62], [W.right, 62], [W.left, 82], [W.right, 82]],
  9:  [[W.left, 20], [W.right, 20], [W.left, 40], [W.right, 40], [50, 57], [W.left, 68], [W.right, 68], [W.left, 88], [W.right, 88]],
  10: [[W.left, 18], [W.right, 18], [W.left, 36], [W.right, 36], [W.left, 54], [W.right, 54], [W.left, 72], [W.right, 72], [W.left, 90], [W.right, 90]],
}

type SuitKey = 'wands' | 'cups' | 'swords' | 'pentacles'
const SUIT_MOTIF: Record<SuitKey, MotifName> = {
  wands: 'wand', cups: 'cup', swords: 'sword', pentacles: 'pentacle',
}

function pip(suit: SuitKey, num: number): CardComposition {
  const motif = SUIT_MOTIF[suit]
  const scale = num === 1 ? 1.4 : 0.75
  return {
    motifs: (PIP_LAYOUTS[num] ?? []).map(([x, y]) => ({ motif, x, y, scale })),
  }
}

// ─── court card accent motifs ───────────────────────────────────────────────

const COURT_ACCENTS: Record<SuitKey, [MotifName, number, number][]> = {
  wands:     [['flame', 50, 38], ['star',  50, 80]],
  cups:      [['wave',  50, 38], ['moon',  50, 80]],
  swords:    [['blade', 50, 38], ['eye',   50, 80]],
  pentacles: [['wheel', 50, 38], ['star',  50, 80]],
}

function court(suit: SuitKey, rank: 'page'|'knight'|'queen'|'king'): CardComposition {
  const sym = SUIT_MOTIF[suit]
  const scaleByRank = { page: 1, knight: 1.05, queen: 1.1, king: 1.2 }
  const accents = COURT_ACCENTS[suit].map(([m, x, y]) => ({ motif: m, x, y, scale: 0.8 }))
  return {
    motifs: [
      { motif: sym, x: 50, y: 62, scale: scaleByRank[rank] },
      ...accents,
    ],
  }
}

// ─── all 78 compositions ────────────────────────────────────────────────────

export const cardCompositions: Record<string, CardComposition> = {
  // ── Major Arcana ────────────────────────────────────────────────────────
  'major-00': { motifs: [ // The Fool
    { motif: 'star',  x: 50, y: 35, scale: 1.1 },
    { motif: 'sun',   x: 72, y: 20, scale: 0.7, opacity: 0.6 },
    { motif: 'wave',  x: 50, y: 95, scale: 0.9 },
  ]},
  'major-01': { motifs: [ // The Magician
    { motif: 'sun',   x: 50, y: 32, scale: 1 },
    { motif: 'eye',   x: 50, y: 72, scale: 0.9 },
    { motif: 'serpent', x: 50, y: 105, scale: 0.75, rotation: 90 },
  ]},
  'major-02': { motifs: [ // The High Priestess
    { motif: 'moon',  x: 50, y: 30, scale: 1.1 },
    { motif: 'pillar', x: 28, y: 72, scale: 0.85 },
    { motif: 'pillar', x: 72, y: 72, scale: 0.85 },
    { motif: 'wave',  x: 50, y: 108, scale: 0.8 },
  ]},
  'major-03': { motifs: [ // The Empress
    { motif: 'sun',   x: 50, y: 28, scale: 1.1 },
    { motif: 'wings', x: 50, y: 65, scale: 1 },
    { motif: 'wave',  x: 50, y: 105, scale: 0.85 },
  ]},
  'major-04': { motifs: [ // The Emperor
    { motif: 'pillar', x: 50, y: 55, scale: 1.1 },
    { motif: 'flame', x: 50, y: 20, scale: 0.9 },
    { motif: 'blade', x: 78, y: 75, scale: 0.7, rotation: 25 },
  ]},
  'major-05': { motifs: [ // The Hierophant
    { motif: 'pillar', x: 30, y: 65, scale: 0.9 },
    { motif: 'pillar', x: 70, y: 65, scale: 0.9 },
    { motif: 'hand',  x: 50, y: 30, scale: 1 },
    { motif: 'wheel', x: 50, y: 105, scale: 0.8 },
  ]},
  'major-06': { motifs: [ // The Lovers
    { motif: 'wings', x: 50, y: 32, scale: 1.3 },
    { motif: 'sun',   x: 50, y: 20, scale: 0.65 },
    { motif: 'star',  x: 50, y: 88, scale: 0.8 },
  ]},
  'major-07': { motifs: [ // The Chariot
    { motif: 'wheel', x: 50, y: 78, scale: 1.1 },
    { motif: 'star',  x: 50, y: 28, scale: 0.9 },
    { motif: 'blade', x: 72, y: 45, scale: 0.7, rotation: 15 },
  ]},
  'major-08': { motifs: [ // Strength
    { motif: 'serpent', x: 50, y: 65, scale: 1.1 },
    { motif: 'sun',   x: 50, y: 22, scale: 0.85 },
    { motif: 'flame', x: 50, y: 105, scale: 0.75, opacity: 0.7 },
  ]},
  'major-09': { motifs: [ // The Hermit
    { motif: 'star',  x: 50, y: 52, scale: 1 },
    { motif: 'moon',  x: 28, y: 22, scale: 0.7 },
    { motif: 'pillar', x: 72, y: 85, scale: 0.75 },
  ]},
  'major-10': { motifs: [ // Wheel of Fortune
    { motif: 'wheel', x: 50, y: 62, scale: 1.4 },
    { motif: 'eye',   x: 50, y: 22, scale: 0.7 },
    { motif: 'serpent', x: 50, y: 108, scale: 0.6, rotation: 90 },
  ]},
  'major-11': { motifs: [ // Justice
    { motif: 'blade', x: 50, y: 55, scale: 1.1 },
    { motif: 'pillar', x: 28, y: 72, scale: 0.8 },
    { motif: 'pillar', x: 72, y: 72, scale: 0.8 },
    { motif: 'wheel', x: 50, y: 20, scale: 0.65 },
  ]},
  'major-12': { motifs: [ // The Hanged Man
    { motif: 'moon',  x: 50, y: 28, scale: 1 },
    { motif: 'pillar', x: 30, y: 72, scale: 0.9 },
    { motif: 'pillar', x: 70, y: 72, scale: 0.9 },
    { motif: 'star',  x: 50, y: 108, scale: 0.7, rotation: 180, opacity: 0.65 },
  ]},
  'major-13': { motifs: [ // Death
    { motif: 'blade', x: 50, y: 52, scale: 1.2 },
    { motif: 'moon',  x: 30, y: 20, scale: 0.75 },
    { motif: 'serpent', x: 50, y: 105, scale: 0.65, rotation: 90 },
  ]},
  'major-14': { motifs: [ // Temperance
    { motif: 'wave',  x: 50, y: 65, scale: 1.1 },
    { motif: 'sun',   x: 50, y: 22, scale: 0.9 },
    { motif: 'wings', x: 50, y: 100, scale: 0.85 },
  ]},
  'major-15': { motifs: [ // The Devil
    { motif: 'eye',   x: 50, y: 30, scale: 1 },
    { motif: 'serpent', x: 50, y: 72, scale: 1 },
    { motif: 'flame', x: 50, y: 108, scale: 0.8 },
  ]},
  'major-16': { motifs: [ // The Tower
    { motif: 'pillar', x: 50, y: 58, scale: 1.3 },
    { motif: 'flame', x: 50, y: 18, scale: 0.85 },
    { motif: 'blade', x: 75, y: 38, scale: 0.65, rotation: -45, opacity: 0.7 },
  ]},
  'major-17': { motifs: [ // The Star
    { motif: 'star',  x: 50, y: 35, scale: 1.3 },
    { motif: 'star',  x: 25, y: 22, scale: 0.6, opacity: 0.7 },
    { motif: 'star',  x: 75, y: 22, scale: 0.6, opacity: 0.7 },
    { motif: 'wave',  x: 50, y: 100, scale: 0.9 },
  ]},
  'major-18': { motifs: [ // The Moon
    { motif: 'moon',  x: 50, y: 30, scale: 1.3 },
    { motif: 'serpent', x: 50, y: 80, scale: 0.9, rotation: 90 },
    { motif: 'pillar', x: 25, y: 105, scale: 0.7 },
    { motif: 'pillar', x: 75, y: 105, scale: 0.7 },
  ]},
  'major-19': { motifs: [ // The Sun
    { motif: 'sun',   x: 50, y: 38, scale: 1.5 },
    { motif: 'star',  x: 22, y: 20, scale: 0.5, opacity: 0.6 },
    { motif: 'star',  x: 78, y: 20, scale: 0.5, opacity: 0.6 },
    { motif: 'flame', x: 50, y: 100, scale: 0.8, opacity: 0.7 },
  ]},
  'major-20': { motifs: [ // Judgement
    { motif: 'wings', x: 50, y: 32, scale: 1.2 },
    { motif: 'blade', x: 50, y: 75, scale: 0.9 },
    { motif: 'eye',   x: 50, y: 18, scale: 0.6 },
  ]},
  'major-21': { motifs: [ // The World
    { motif: 'wheel', x: 50, y: 62, scale: 1.3 },
    { motif: 'wings', x: 50, y: 22, scale: 0.9, opacity: 0.7 },
    { motif: 'star',  x: 25, y: 45, scale: 0.55, opacity: 0.6 },
    { motif: 'star',  x: 75, y: 45, scale: 0.55, opacity: 0.6 },
  ]},

  // ── Wands ────────────────────────────────────────────────────────────────
  'wands-ace':    { motifs: [{ motif: 'wand', x: 50, y: 62, scale: 1.5 }, { motif: 'flame', x: 50, y: 20, scale: 0.8, opacity: 0.6 }] },
  'wands-02':     pip('wands', 2),
  'wands-03':     pip('wands', 3),
  'wands-04':     pip('wands', 4),
  'wands-05':     pip('wands', 5),
  'wands-06':     pip('wands', 6),
  'wands-07':     pip('wands', 7),
  'wands-08':     pip('wands', 8),
  'wands-09':     pip('wands', 9),
  'wands-10':     pip('wands', 10),
  'wands-page':   court('wands', 'page'),
  'wands-knight': court('wands', 'knight'),
  'wands-queen':  court('wands', 'queen'),
  'wands-king':   court('wands', 'king'),

  // ── Cups ─────────────────────────────────────────────────────────────────
  'cups-ace':    { motifs: [{ motif: 'cup', x: 50, y: 62, scale: 1.5 }, { motif: 'wave', x: 50, y: 108, scale: 0.8, opacity: 0.6 }] },
  'cups-02':     pip('cups', 2),
  'cups-03':     pip('cups', 3),
  'cups-04':     pip('cups', 4),
  'cups-05':     pip('cups', 5),
  'cups-06':     pip('cups', 6),
  'cups-07':     pip('cups', 7),
  'cups-08':     pip('cups', 8),
  'cups-09':     pip('cups', 9),
  'cups-10':     pip('cups', 10),
  'cups-page':   court('cups', 'page'),
  'cups-knight': court('cups', 'knight'),
  'cups-queen':  court('cups', 'queen'),
  'cups-king':   court('cups', 'king'),

  // ── Swords ───────────────────────────────────────────────────────────────
  'swords-ace':    { motifs: [{ motif: 'sword', x: 50, y: 62, scale: 1.5 }, { motif: 'star', x: 50, y: 20, scale: 0.75, opacity: 0.7 }] },
  'swords-02':     pip('swords', 2),
  'swords-03':     pip('swords', 3),
  'swords-04':     pip('swords', 4),
  'swords-05':     pip('swords', 5),
  'swords-06':     pip('swords', 6),
  'swords-07':     pip('swords', 7),
  'swords-08':     pip('swords', 8),
  'swords-09':     pip('swords', 9),
  'swords-10':     pip('swords', 10),
  'swords-page':   court('swords', 'page'),
  'swords-knight': court('swords', 'knight'),
  'swords-queen':  court('swords', 'queen'),
  'swords-king':   court('swords', 'king'),

  // ── Pentacles ────────────────────────────────────────────────────────────
  'pentacles-ace':    { motifs: [{ motif: 'pentacle', x: 50, y: 62, scale: 1.4 }, { motif: 'star', x: 50, y: 20, scale: 0.7, opacity: 0.6 }] },
  'pentacles-02':     pip('pentacles', 2),
  'pentacles-03':     pip('pentacles', 3),
  'pentacles-04':     pip('pentacles', 4),
  'pentacles-05':     pip('pentacles', 5),
  'pentacles-06':     pip('pentacles', 6),
  'pentacles-07':     pip('pentacles', 7),
  'pentacles-08':     pip('pentacles', 8),
  'pentacles-09':     pip('pentacles', 9),
  'pentacles-10':     pip('pentacles', 10),
  'pentacles-page':   court('pentacles', 'page'),
  'pentacles-knight': court('pentacles', 'knight'),
  'pentacles-queen':  court('pentacles', 'queen'),
  'pentacles-king':   court('pentacles', 'king'),
}
