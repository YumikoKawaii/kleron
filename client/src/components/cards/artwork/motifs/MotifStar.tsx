import type { MotifProps } from './types'

const P = '#fdf8f0'

// Main 8-pointed star: outer r=10, inner r=4, starting at top
const MAIN_STAR_D = (() => {
  const pts: string[] = []
  for (let i = 0; i < 8; i++) {
    const outerA = (i * 45 - 90) * (Math.PI / 180)
    const innerA = (i * 45 + 22.5 - 90) * (Math.PI / 180)
    pts.push(`${+(Math.cos(outerA) * 10).toFixed(3)},${+(Math.sin(outerA) * 10).toFixed(3)}`)
    pts.push(`${+(Math.cos(innerA) * 4).toFixed(3)},${+(Math.sin(innerA) * 4).toFixed(3)}`)
  }
  return `M ${pts.join(' L ')} Z`
})()

// 4-pointed small stars
function star4(cx: number, cy: number, ro: number): string {
  const ri = ro * 0.38
  const pts: string[] = []
  for (let i = 0; i < 4; i++) {
    const a_out = (i * 90 - 90) * Math.PI / 180
    const a_in  = (i * 90 - 45) * Math.PI / 180
    pts.push(`${+(cx + Math.cos(a_out)*ro).toFixed(2)} ${+(cy + Math.sin(a_out)*ro).toFixed(2)}`)
    pts.push(`${+(cx + Math.cos(a_in)*ri).toFixed(2)} ${+(cy + Math.sin(a_in)*ri).toFixed(2)}`)
  }
  return `M ${pts.join(' L ')} Z`
}

const SMALL_STARS = [
  { cx: -7.5, cy: -7, r: 2.2 },
  { cx: 7, cy: -9, r: 1.7 },
  { cx: 11, cy: -2.5, r: 1.5 },
  { cx: -10, cy: 2.5, r: 1.6 },
  { cx: 9, cy: 6, r: 2.0 },
  { cx: -7, cy: 8, r: 1.5 },
  { cx: 3, cy: -11.5, r: 1.8 },
]

// Milky Way band — diagonal smear from top-right to bottom-left
const MILKY_WAY = [
  { x: 8, y: -10, r: 0.35 }, { x: 6, y: -9, r: 0.45 }, { x: 9, y: -7.5, r: 0.3 },
  { x: 5, y: -7, r: 0.4 }, { x: 7, y: -5.5, r: 0.3 }, { x: 4, y: -5, r: 0.35 },
  { x: 5.5, y: -3.5, r: 0.25 }, { x: 2.5, y: -3, r: 0.4 }, { x: 4, y: -1.5, r: 0.3 },
  { x: 1, y: -1, r: 0.35 }, { x: 2, y: 1, r: 0.3 }, { x: -1, y: 1.5, r: 0.4 },
  { x: -2.5, y: 3, r: 0.3 }, { x: -1, y: 4, r: 0.25 }, { x: -4, y: 4.5, r: 0.35 },
  { x: -3, y: 6, r: 0.3 }, { x: -5.5, y: 6.5, r: 0.4 }, { x: -6, y: 8, r: 0.3 },
  { x: -7, y: 9, r: 0.25 }, { x: -8.5, y: 10, r: 0.35 },
]

export function MotifStar({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* Milky Way stipple band — behind everything */}
      {MILKY_WAY.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={stroke} opacity={0.18} />
      ))}

      {/* construction circles */}
      <circle r={11.5} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
      <circle r={4} fill="none" stroke={stroke} strokeWidth={0.3} strokeDasharray="0.8 1.5" />

      {/* scattered small 4-pointed stars */}
      {SMALL_STARS.map((s, i) => (
        <path key={i} d={star4(s.cx, s.cy, s.r)}
          fill={stroke} stroke="none" opacity={0.65} />
      ))}

      {/* main 8-pointed star */}
      <path d={MAIN_STAR_D} fill={P} stroke={stroke} strokeWidth={1} />
      {/* center dot */}
      <circle r={0.8} fill={stroke} />
    </g>
  )
}
