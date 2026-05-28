import type { MotifProps } from './types'

const P = '#fdf8f0'

// Archimedean spiral: 2.5 turns (5π), r=0.8 → 11, starting at top (−π/2)
function spiralPath(): string {
  const steps = 100
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * 5 * Math.PI - Math.PI / 2
    const r = 0.8 + 10.2 * t
    pts.push(`${+(Math.cos(theta) * r).toFixed(3)} ${+(Math.sin(theta) * r).toFixed(3)}`)
  }
  return 'M ' + pts.join(' L ')
}

// Scale texture: short perpendicular tick marks on outer portion of spiral
interface Tick { x1: number; y1: number; x2: number; y2: number }
function scaleTicks(): Tick[] {
  const marks: Tick[] = []
  const DTHETA = (5 * Math.PI) / 100
  const DR = 10.2 / 100
  for (let i = 20; i <= 100; i += 5) {
    const t = i / 100
    const theta = t * 5 * Math.PI - Math.PI / 2
    const r = 0.8 + 10.2 * t
    const x = Math.cos(theta) * r
    const y = Math.sin(theta) * r
    const tx = -Math.sin(theta) * r * DTHETA + Math.cos(theta) * DR
    const ty = Math.cos(theta) * r * DTHETA + Math.sin(theta) * DR
    const len = Math.sqrt(tx * tx + ty * ty)
    const s = 0.55 / len
    marks.push({
      x1: +(x - (-ty * s)).toFixed(2), y1: +(y - (tx * s)).toFixed(2),
      x2: +(x + (-ty * s)).toFixed(2), y2: +(y + (tx * s)).toFixed(2),
    })
  }
  return marks
}

const SPIRAL = spiralPath()
const TICKS = scaleTicks()

// Head is at t=0: (0, -0.8). Tail exits at t=1: cos(4.5π)=0, sin(4.5π)=1 → (0, 11)

export function MotifSerpent({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* faint ouroboros ghost ring */}
      <circle r={13} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="2 2.5" opacity={0.3} />

      {/* scale texture marks on outer turns */}
      {TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={stroke} strokeWidth={0.3} opacity={0.55} />
      ))}

      {/* spiral body */}
      <path d={SPIRAL} fill="none" stroke={stroke} strokeWidth={0.9} />

      {/* head at (0, -0.8) */}
      <ellipse cx={0} cy={-1.8} rx={1.7} ry={1.1} fill={P} stroke={stroke} strokeWidth={0.7} />
      {/* eye */}
      <circle cx={0.5} cy={-2} r={0.38} fill={stroke} />
      {/* forked tongue */}
      <path d="M 0 -0.7 L 0 0.6 M -0.85 0.6 L 0 0.6 L 0.85 0.6"
        fill="none" stroke={stroke} strokeWidth={0.4} />
      {/* hood frill — two short flared arcs */}
      <path d="M -0.8 -1.5 Q -2.2 -3 -1.2 -4.2" fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d="M 0.8 -1.5 Q 2.2 -3 1.2 -4.2" fill="none" stroke={stroke} strokeWidth={0.5} />

      {/* tail arrowhead at (0, 11) */}
      <path d="M -0.8 10 L 0 11 L 0.8 10" fill="none" stroke={stroke} strokeWidth={0.5} />
    </g>
  )
}
