import type { MotifProps } from '../motifs/types'

export function SuitCup({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* bowl — wide opening at top, tapering down */}
      <path d="M -6 -7 Q -7 0 -4 5 L 4 5 Q 7 0 6 -7 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.1} />
      {/* rim ellipse at top */}
      <ellipse cx={0} cy={-7} rx={6} ry={1.5} fill="#fdf8f0" stroke={stroke} strokeWidth={0.8} />
      {/* cross-section lines (horizontal, like a turned vessel drawing) */}
      <line x1="-5.5" y1="-3" x2="5.5" y2="-3" stroke={stroke} strokeWidth={0.35} />
      <line x1="-5" y1="1" x2="5" y2="1" stroke={stroke} strokeWidth={0.35} />
      {/* stem */}
      <line x1="0" y1="5" x2="0" y2="8" stroke={stroke} strokeWidth={0.9} />
      {/* base */}
      <path d="M -4 8 Q -4.5 9 0 9 Q 4.5 9 4 8"
        fill="#fdf8f0" stroke={stroke} strokeWidth={0.9} />
      <line x1="-4" y1="9" x2="4" y2="9" stroke={stroke} strokeWidth={0.6} />
    </g>
  )
}
