import type { MotifProps } from './types'

const P = '#fdf8f0'

// Single pillar column at given center x
function pillarPaths(cx: number) {
  const hw = 1.8  // half shaft width
  return {
    capital:  `M ${cx - 4.2} -10 L ${cx + 4.2} -10 L ${cx + 4.2} -7.8 L ${cx - 4.2} -7.8 Z`,
    abacus:   `M ${cx - 3.2} -7.8 L ${cx + 3.2} -7.8 L ${cx + 3.2} -6.8 L ${cx - 3.2} -6.8 Z`,
    shaft:    `M ${cx - hw} -6.8 Q ${cx - hw - 0.35} 0 ${cx - hw} 6.8 L ${cx + hw} 6.8 Q ${cx + hw + 0.35} 0 ${cx + hw} -6.8 Z`,
    torus:    `M ${cx - 3.2} 6.8 L ${cx + 3.2} 6.8 L ${cx + 3.2} 7.8 L ${cx - 3.2} 7.8 Z`,
    plinth:   `M ${cx - 4.2} 7.8 L ${cx + 4.2} 7.8 L ${cx + 4.2} 10 L ${cx - 4.2} 10 Z`,
    drums:    [-4, -1, 2, 5].map(dy => ({ x1: cx - hw + 0.1, x2: cx + hw - 0.1, y: dy })),
  }
}

export function MotifPillar({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  const left = pillarPaths(-7)
  const right = pillarPaths(7)

  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* crescent moon above left pillar */}
      <circle cx={-7} cy={-13} r={2.2} fill="none" stroke={stroke} strokeWidth={0.5} />
      <circle cx={-8.6} cy={-13} r={1.9} fill={P} stroke="none" />

      {/* sun disc above right pillar */}
      <circle cx={7} cy={-13} r={2} fill={P} stroke={stroke} strokeWidth={0.5} />
      <circle cx={7} cy={-13} r={1} fill="none" stroke={stroke} strokeWidth={0.3} strokeDasharray="0.6 0.7" />

      {/* left pillar */}
      <path d={left.plinth} fill={P} stroke={stroke} strokeWidth={0.9} />
      <path d={left.torus}  fill={P} stroke={stroke} strokeWidth={0.5} />
      <path d={left.shaft}  fill={P} stroke={stroke} strokeWidth={1} />
      {left.drums.map((d, i) => (
        <line key={i} x1={d.x1} y1={d.y} x2={d.x2} y2={d.y} stroke={stroke} strokeWidth={0.35} />
      ))}
      <path d={left.abacus}  fill={P} stroke={stroke} strokeWidth={0.5} />
      <path d={left.capital} fill={P} stroke={stroke} strokeWidth={0.9} />

      {/* right pillar */}
      <path d={right.plinth} fill={P} stroke={stroke} strokeWidth={0.9} />
      <path d={right.torus}  fill={P} stroke={stroke} strokeWidth={0.5} />
      <path d={right.shaft}  fill={P} stroke={stroke} strokeWidth={1} />
      {right.drums.map((d, i) => (
        <line key={i} x1={d.x1} y1={d.y} x2={d.x2} y2={d.y} stroke={stroke} strokeWidth={0.35} />
      ))}
      <path d={right.abacus}  fill={P} stroke={stroke} strokeWidth={0.5} />
      <path d={right.capital} fill={P} stroke={stroke} strokeWidth={0.9} />

      {/* veil/curtain hanging between pillars — two drape arcs */}
      <path d="M -4.8 -7.8 Q -2.5 2 -1.5 6" fill="none" stroke={stroke} strokeWidth={0.55} />
      <path d="M 4.8 -7.8 Q 2.5 2 1.5 6" fill="none" stroke={stroke} strokeWidth={0.55} />
    </g>
  )
}
