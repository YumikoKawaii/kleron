import type { MotifProps } from './types'

const P = '#fdf8f0'

// Faint sunburst lines at blade midpoint (0, -2.5)
const SUNBURST = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45) * (Math.PI / 180)
  return {
    x2: +(Math.cos(a) * 8).toFixed(2),
    y2: +(-2.5 + Math.sin(a) * 8).toFixed(2),
  }
})

export function MotifBlade({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* faint sunburst behind blade */}
      {SUNBURST.map((s, i) => (
        <line key={i} x1={0} y1={-2.5} x2={s.x2} y2={s.y2}
          stroke={stroke} strokeWidth={0.3} opacity={0.12} />
      ))}

      {/* blade — double-edge diamond profile */}
      <path d="M 0 -10 L 1.2 5 L 0 7 L -1.2 5 Z"
        fill={P} stroke={stroke} strokeWidth={1.1} />
      {/* centre fuller groove */}
      <line x1="0" y1="-8" x2="0" y2="5.5" stroke={stroke} strokeWidth={0.4} />

      {/* left quillon arm, tapering to a point */}
      <path d="M 0 6 C -2 5.5 -5 4.8 -6.5 5.3 L -7.5 6 L -6.5 6.7 C -5 6.2 -2 6.5 0 6 Z"
        fill={P} stroke={stroke} strokeWidth={0.7} />
      {/* right quillon arm */}
      <path d="M 0 6 C 2 5.5 5 4.8 6.5 5.3 L 7.5 6 L 6.5 6.7 C 5 6.2 2 6.5 0 6 Z"
        fill={P} stroke={stroke} strokeWidth={0.7} />

      {/* grip */}
      <rect x={-1} y={7} width={2} height={4.5} rx={0.4} fill={P} stroke={stroke} strokeWidth={0.7} />
      {/* grip wrap lines (4) */}
      {[7.9, 8.7, 9.5, 10.3].map(y => (
        <line key={y} x1="-1" y1={y} x2="1" y2={y} stroke={stroke} strokeWidth={0.3} />
      ))}
      {/* central grip ridge */}
      <line x1="0" y1="7" x2="0" y2="11.5" stroke={stroke} strokeWidth={0.2} opacity={0.5} />

      {/* pommel */}
      <circle cx={0} cy={13} r={1.6} fill={P} stroke={stroke} strokeWidth={0.8} />
      {/* pommel center stone */}
      <circle cx={0} cy={13} r={0.55} fill={stroke} />

      {/* tip dot */}
      <circle cx={0} cy={-10} r={0.45} fill={stroke} />
    </g>
  )
}
