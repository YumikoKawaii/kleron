import type { MotifProps } from './types'

const RAYS = Array.from({ length: 16 }, (_, i) => {
  const angle = ((i * 22.5) - 90) * (Math.PI / 180)
  const isLong = i % 2 === 0
  const inner = 6.5
  const outer = isLong ? 10 : 8
  return {
    x1: +(Math.cos(angle) * inner).toFixed(3),
    y1: +(Math.sin(angle) * inner).toFixed(3),
    x2: +(Math.cos(angle) * outer).toFixed(3),
    y2: +(Math.sin(angle) * outer).toFixed(3),
    long: isLong,
  }
})

export function MotifSun({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* rays */}
      {RAYS.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke={stroke} strokeWidth={r.long ? 0.8 : 0.5} />
      ))}
      {/* tip dots at long ray ends */}
      {RAYS.filter(r => r.long).map((r, i) => (
        <circle key={i} cx={r.x2} cy={r.y2} r={0.55} fill={stroke} />
      ))}
      {/* main disc */}
      <circle r={6} fill="#fdf8f0" stroke={stroke} strokeWidth={1.2} />
      {/* inner dashed ring */}
      <circle r={3.5} fill="none" stroke={stroke} strokeWidth={0.4} strokeDasharray="1 1.5" />
      {/* center point */}
      <circle r={0.7} fill={stroke} />
    </g>
  )
}
