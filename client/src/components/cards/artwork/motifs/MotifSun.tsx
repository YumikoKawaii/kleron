import type { MotifProps } from './types'

const P = '#fdf8f0'

// 16 alternating rays: 8 long (r=14), 8 short (r=10), inner edge at disc r=7
const RAYS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i * 22.5 - 90) * (Math.PI / 180)
  const isLong = i % 2 === 0
  const outer = isLong ? 14 : 10
  return {
    x1: +(Math.cos(angle) * 7).toFixed(3),
    y1: +(Math.sin(angle) * 7).toFixed(3),
    x2: +(Math.cos(angle) * outer).toFixed(3),
    y2: +(Math.sin(angle) * outer).toFixed(3),
    dx: +(Math.cos(angle) * (outer + 0.6)).toFixed(3),
    dy: +(Math.sin(angle) * (outer + 0.6)).toFixed(3),
    long: isLong,
  }
})

export function MotifSun({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* radiating diffusion arcs behind disc — render first (behind everything) */}
      <circle r={9} fill="none" stroke={stroke} strokeWidth={0.5} strokeDasharray="2 2.5" opacity={0.45} />
      <circle r={11} fill="none" stroke={stroke} strokeWidth={0.4} strokeDasharray="2 3" opacity={0.3} />
      <circle r={13} fill="none" stroke={stroke} strokeWidth={0.3} strokeDasharray="2 3.5" opacity={0.18} />

      {/* rays */}
      {RAYS.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke={stroke} strokeWidth={r.long ? 0.8 : 0.5} />
      ))}
      {/* tip dots on long rays */}
      {RAYS.filter(r => r.long).map((r, i) => (
        <circle key={i} cx={r.dx} cy={r.dy} r={0.55} fill={stroke} />
      ))}

      {/* main disc */}
      <circle r={7} fill={P} stroke={stroke} strokeWidth={1.3} />
      {/* inner dashed ring */}
      <circle r={5} fill="none" stroke={stroke} strokeWidth={0.4} strokeDasharray="1 1.5" />
      {/* center point */}
      <circle r={0.7} fill={stroke} />

      {/* horizon line — the sun sits just above it */}
      <line x1="-14" y1="10" x2="14" y2="10" stroke={stroke} strokeWidth={0.7} opacity={0.65} />
      {/* shallow arc suggesting earth's curve */}
      <path d="M -14 10 Q 0 12.5 14 10" fill="none" stroke={stroke} strokeWidth={0.35} opacity={0.4} />
    </g>
  )
}
