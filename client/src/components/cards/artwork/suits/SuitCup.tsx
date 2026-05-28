import type { MotifProps } from '../motifs/types'

const P = '#fdf8f0'

export function SuitCup({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* bowl */}
      <path d="M -6 -7 Q -7 0 -4 5 L 4 5 Q 7 0 6 -7 Z"
        fill={P} stroke={stroke} strokeWidth={1.1} />

      {/* rim — double line */}
      <ellipse cx={0} cy={-7} rx={6} ry={1.5} fill={P} stroke={stroke} strokeWidth={0.8} />
      <ellipse cx={0} cy={-7.9} rx={5.4} ry={1.2} fill="none" stroke={stroke} strokeWidth={0.4} />

      {/* interior liquid surface */}
      <ellipse cx={0} cy={-6.3} rx={5} ry={1} fill={P} stroke={stroke} strokeWidth={0.5} />
      {/* ripple arcs on liquid */}
      <ellipse cx={0} cy={-6.3} rx={3.4} ry={0.6} fill="none" stroke={stroke} strokeWidth={0.3} opacity={0.7} />
      <ellipse cx={0} cy={-6.3} rx={1.9} ry={0.35} fill="none" stroke={stroke} strokeWidth={0.25} opacity={0.55} />

      {/* cross-section lines on bowl body */}
      <line x1="-5.5" y1="-3" x2="5.5" y2="-3" stroke={stroke} strokeWidth={0.35} />
      <line x1="-5" y1="1" x2="5" y2="1" stroke={stroke} strokeWidth={0.35} />

      {/* stem */}
      <line x1="0" y1="5" x2="0" y2="6.2" stroke={stroke} strokeWidth={0.9} />
      {/* knop */}
      <circle cx={0} cy={6.7} r={0.8} fill={P} stroke={stroke} strokeWidth={0.6} />
      <line x1="0" y1="7.2" x2="0" y2="8.2" stroke={stroke} strokeWidth={0.9} />

      {/* base */}
      <path d="M -4 8.2 Q -4.5 9.2 0 9.2 Q 4.5 9.2 4 8.2"
        fill={P} stroke={stroke} strokeWidth={0.9} />
      <line x1="-4" y1="9.2" x2="4" y2="9.2" stroke={stroke} strokeWidth={0.6} />

      {/* shadow ellipse below base */}
      <ellipse cx={0} cy={9.8} rx={4.5} ry={0.8}
        fill="none" stroke={stroke} strokeWidth={0.3} opacity={0.35} />
    </g>
  )
}
