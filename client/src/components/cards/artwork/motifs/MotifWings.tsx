import type { MotifProps } from './types'

export function MotifWings({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  // Symmetric wings — precise geometric feather arrays
  // Each wing: main arc outline + 5 parallel feather lines radiating outward
  const feathersRight = [
    { x1: 1.5, y1: -1, x2: 7, y2: -5.5 },
    { x1: 2, y1: 0.5, x2: 9, y2: -2 },
    { x1: 2, y1: 2, x2: 9.5, y2: 1.5 },
    { x1: 1.5, y1: 3.5, x2: 8.5, y2: 5 },
    { x1: 1, y1: 4.8, x2: 6.5, y2: 7.5 },
  ]
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* right wing outline */}
      <path d="M 1 0 C 4 -6 10 -7 12 -5 Q 14 -3 12 0 C 10 3 6 8 1 5 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.1} />
      {/* left wing outline (mirrored) */}
      <path d="M -1 0 C -4 -6 -10 -7 -12 -5 Q -14 -3 -12 0 C -10 3 -6 8 -1 5 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.1} />
      {/* right feather lines */}
      {feathersRight.map((f, i) => (
        <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
          stroke={stroke} strokeWidth={0.4} />
      ))}
      {/* left feather lines (mirrored) */}
      {feathersRight.map((f, i) => (
        <line key={i} x1={-f.x1} y1={f.y1} x2={-f.x2} y2={f.y2}
          stroke={stroke} strokeWidth={0.4} />
      ))}
      {/* centre spine */}
      <line x1="0" y1="-2" x2="0" y2="5" stroke={stroke} strokeWidth={0.5} />
      {/* wing-span construction line, dashed */}
      <line x1="-14" y1="-5" x2="14" y2="-5" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
    </g>
  )
}
