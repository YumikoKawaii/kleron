import type { MotifProps } from './types'

const P = '#fdf8f0'

// 8 spokes: hub r=3 to rim r=10, starting at top
const SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 - 90) * (Math.PI / 180)
  return {
    x1: +(Math.cos(a) * 3).toFixed(3),
    y1: +(Math.sin(a) * 3).toFixed(3),
    x2: +(Math.cos(a) * 10).toFixed(3),
    y2: +(Math.sin(a) * 10).toFixed(3),
  }
})

// Rune-like marks between spokes (at angles 22.5°, 67.5°, … at r≈11.5)
const RUNE_MARKS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 + 22.5 - 90) * (Math.PI / 180)
  const x = +(Math.cos(a) * 11.5).toFixed(2)
  const y = +(Math.sin(a) * 11.5).toFixed(2)
  const rx = +(-Math.sin(a) * 0.65).toFixed(2)
  const ry = +(Math.cos(a) * 0.65).toFixed(2)
  const dx = +(Math.cos(a) * 0.8).toFixed(2)
  const dy = +(Math.sin(a) * 0.8).toFixed(2)
  return { x, y, rx, ry, dx, dy }
})

// N/S/E/W corner diamond positions
const CARDINALS = [[0, -15], [0, 15], [-15, 0], [15, 0]] as const

export function MotifWheel({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* dashed outer orbit r=13 */}
      <circle r={13} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />

      {/* N/S/E/W diamond corner marks */}
      {CARDINALS.map(([cx, cy], i) => (
        <rect key={i}
          x={cx - 1} y={cy - 1} width={2} height={2}
          transform={`rotate(45 ${cx} ${cy})`}
          fill="none" stroke={stroke} strokeWidth={0.4} />
      ))}

      {/* outer rim */}
      <circle r={10} fill="none" stroke={stroke} strokeWidth={1.2} />
      {/* mid ring r=6 */}
      <circle r={6} fill="none" stroke={stroke} strokeWidth={0.6} />

      {/* spokes */}
      {SPOKES.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={stroke} strokeWidth={0.7} />
      ))}
      {/* spoke-rim junction dots */}
      {SPOKES.map((s, i) => (
        <circle key={i} cx={s.x2} cy={s.y2} r={0.55} fill={stroke} />
      ))}

      {/* rune-like marks between spokes */}
      {RUNE_MARKS.map((m, i) => (
        <g key={i}>
          <line x1={m.x - m.dx} y1={m.y - m.dy} x2={m.x + m.dx} y2={m.y + m.dy}
            stroke={stroke} strokeWidth={0.5} />
          <line x1={m.x - m.rx} y1={m.y - m.ry} x2={m.x + m.rx} y2={m.y + m.ry}
            stroke={stroke} strokeWidth={0.35} />
        </g>
      ))}

      {/* layered hub: outer ring, inner ring, center dot */}
      <circle r={3} fill={P} stroke={stroke} strokeWidth={0.9} />
      <circle r={2} fill="none" stroke={stroke} strokeWidth={0.4} />
      <circle r={0.8} fill={stroke} />
    </g>
  )
}
