import type { MotifProps } from '../motifs/types'

// Pythagorean pentagram inscribed in a circle — all construction lines visible
const PENTA_D = (() => {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180)
    return [+(Math.cos(a) * 8).toFixed(3), +(Math.sin(a) * 8).toFixed(3)]
  })
  // draw star by connecting every other vertex: 0→2→4→1→3→0
  return `M ${pts[0][0]} ${pts[0][1]} L ${pts[2][0]} ${pts[2][1]} L ${pts[4][0]} ${pts[4][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[3][0]} ${pts[3][1]} Z`
})()

const PENTA_OUTER = (() => {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180)
    return [+(Math.cos(a) * 8).toFixed(3), +(Math.sin(a) * 8).toFixed(3)]
  })
  return `M ${pts.map(p => p.join(',')).join(' L ')} Z`
})()

export function SuitPentacle({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* outer dashed construction circle */}
      <circle r={9.5} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
      {/* outer circle */}
      <circle r={8.5} fill="none" stroke={stroke} strokeWidth={0.9} />
      {/* pentagon (outer) — dashed */}
      <path d={PENTA_OUTER} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1 1.5" />
      {/* pentagram star */}
      <path d={PENTA_D} fill="#fdf8f0" stroke={stroke} strokeWidth={1} />
      {/* center dot */}
      <circle r={0.6} fill={stroke} />
    </g>
  )
}
