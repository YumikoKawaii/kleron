import type { MotifProps } from './types'

// Archimedean spiral: r = 0.8 + 1.3*t, θ from 0 to 4.5π (2.25 turns), starting at top
function spiralPath(): string {
  const steps = 90
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * 4.5 * Math.PI - Math.PI / 2
    const r = 0.8 + 8.2 * t
    pts.push(`${+(Math.cos(theta) * r).toFixed(3)} ${+(Math.sin(theta) * r).toFixed(3)}`)
  }
  return 'M ' + pts.join(' L ')
}

const SPIRAL = spiralPath()

// head is at start: theta=-π/2, r=0.8 → (0, -0.8)
// tail is at end: theta=4.5π-π/2=4π=0 (same as 0), r=9 → (9, 0)
// Actually: theta = 4.5π - π/2 = (9π-π)/2 = 8π/2 = 4π → cos(4π)=1, sin(4π)=0 → (9, 0)

export function MotifSerpent({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* spiral body */}
      <path d={SPIRAL} fill="none" stroke={stroke} strokeWidth={0.9} />
      {/* head ellipse at center-top */}
      <ellipse cx={0} cy={-1.8} rx={1.6} ry={1.1} fill="#fdf8f0" stroke={stroke} strokeWidth={0.7} />
      {/* eye dot on head */}
      <circle cx={0.5} cy={-2} r={0.35} fill={stroke} />
      {/* forked tongue */}
      <path d="M 0 -0.7 L 0 0.5 M -0.8 0.5 L 0 0.5 L 0.8 0.5"
        fill="none" stroke={stroke} strokeWidth={0.4} strokeLinecap="round" />
      {/* tail tip — small arrowhead at (9,0) */}
      <path d="M 8 -0.8 L 9 0 L 8 0.8" fill="none" stroke={stroke} strokeWidth={0.5} />
    </g>
  )
}
