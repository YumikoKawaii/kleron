import type { MotifProps } from './types'

// 8 spokes, concentric rings — like an armillary sphere or astrolabe wheel
const SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 - 90) * (Math.PI / 180)
  return {
    x1: +(Math.cos(a) * 2.5).toFixed(3),
    y1: +(Math.sin(a) * 2.5).toFixed(3),
    x2: +(Math.cos(a) * 8).toFixed(3),
    y2: +(Math.sin(a) * 8).toFixed(3),
  }
})

export function MotifWheel({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* outer dashed orbit */}
      <circle r={11} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
      {/* outer rim */}
      <circle r={9} fill="none" stroke={stroke} strokeWidth={1.2} />
      {/* mid ring */}
      <circle r={5.5} fill="none" stroke={stroke} strokeWidth={0.6} />
      {/* inner ring — hub */}
      <circle r={2.5} fill="#fdf8f0" stroke={stroke} strokeWidth={0.7} />
      {/* spokes */}
      {SPOKES.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={stroke} strokeWidth={0.7} />
      ))}
      {/* small dot at each spoke-rim junction */}
      {SPOKES.map((s, i) => (
        <circle key={i} cx={s.x2} cy={s.y2} r={0.5} fill={stroke} />
      ))}
      {/* hub center */}
      <circle r={0.7} fill={stroke} />
    </g>
  )
}
