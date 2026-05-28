import type { MotifProps } from './types'

// 8-pointed star: outer points r=9, inner points r=3.8, starting at top
const STAR_D = (() => {
  const pts: string[] = []
  for (let i = 0; i < 8; i++) {
    const outerA = ((i * 45) - 90) * (Math.PI / 180)
    const innerA = ((i * 45 + 22.5) - 90) * (Math.PI / 180)
    pts.push(`${+(Math.cos(outerA) * 9).toFixed(3)},${+(Math.sin(outerA) * 9).toFixed(3)}`)
    pts.push(`${+(Math.cos(innerA) * 3.8).toFixed(3)},${+(Math.sin(innerA) * 3.8).toFixed(3)}`)
  }
  return `M ${pts.join(' L ')} Z`
})()

export function MotifStar({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* circumscribed dashed circle */}
      <circle r={10.5} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
      {/* inscribed dashed circle through inner points */}
      <circle r={3.8} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="0.8 1.5" />
      {/* star */}
      <path d={STAR_D} fill="#fdf8f0" stroke={stroke} strokeWidth={1} />
      {/* center dot */}
      <circle r={0.8} fill={stroke} />
    </g>
  )
}
