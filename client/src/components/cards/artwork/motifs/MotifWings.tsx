import type { MotifProps } from './types'

const P = '#fdf8f0'

// Feather lines for right wing — varying length, longer at tips
const FEATHERS_R = [
  { x1: 2, y1: -1, x2: 8, y2: -6.5 },
  { x1: 2.5, y1: 0.5, x2: 10.5, y2: -2.5 },
  { x1: 2, y1: 2, x2: 11, y2: 1.5 },
  { x1: 1.5, y1: 3.5, x2: 9.5, y2: 5.5 },
  { x1: 1, y1: 5, x2: 7.5, y2: 7.5 },
  { x1: 0.5, y1: 4.8, x2: 4.5, y2: 9 },
]

export function MotifWings({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* grounding horizon line */}
      <line x1="-14" y1="7" x2="14" y2="7" stroke={stroke} strokeWidth={0.5} opacity={0.6} />

      {/* right wing — primary feather layer */}
      <path d="M 1 0 C 4 -5.5 11 -7.5 13.5 -5 Q 15 -2 12.5 1 C 10 4 6 9 1 6 Z"
        fill={P} stroke={stroke} strokeWidth={1.1} />
      {/* right wing — secondary covert layer */}
      <path d="M 1 0 C 4 -3.5 9.5 -5 11.5 -3.5 Q 12.5 -1.5 10.5 -0.5 C 8.5 0.5 4.5 1.5 1 0 Z"
        fill={P} stroke={stroke} strokeWidth={0.6} />

      {/* left wing — primary feather layer */}
      <path d="M -1 0 C -4 -5.5 -11 -7.5 -13.5 -5 Q -15 -2 -12.5 1 C -10 4 -6 9 -1 6 Z"
        fill={P} stroke={stroke} strokeWidth={1.1} />
      {/* left wing — secondary covert layer */}
      <path d="M -1 0 C -4 -3.5 -9.5 -5 -11.5 -3.5 Q -12.5 -1.5 -10.5 -0.5 C -8.5 0.5 -4.5 1.5 -1 0 Z"
        fill={P} stroke={stroke} strokeWidth={0.6} />

      {/* right feather lines */}
      {FEATHERS_R.map((f, i) => (
        <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
          stroke={stroke} strokeWidth={0.4} />
      ))}
      {/* left feather lines (mirrored) */}
      {FEATHERS_R.map((f, i) => (
        <line key={i} x1={-f.x1} y1={f.y1} x2={-f.x2} y2={f.y2}
          stroke={stroke} strokeWidth={0.4} />
      ))}

      {/* centre spine */}
      <line x1="0" y1="-2" x2="0" y2="7" stroke={stroke} strokeWidth={0.55} />

      {/* small sphere/soul beneath wings */}
      <circle cx={0} cy={10} r={4} fill={P} stroke={stroke} strokeWidth={0.7} />
      <circle cx={0} cy={10} r={1.5} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1 1.2" />
    </g>
  )
}
