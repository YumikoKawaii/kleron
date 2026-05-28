import type { MotifProps } from '../motifs/types'

const P = '#fdf8f0'

export function SuitSword({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* blade — slim, slight asymmetric taper (right edge straighter) */}
      <path d="M -0.3 -9 L 0.9 4 L 0 5.5 L -0.8 4 Z"
        fill={P} stroke={stroke} strokeWidth={1} />
      {/* single fuller line */}
      <line x1="0.2" y1="-7.5" x2="0.2" y2="3.5" stroke={stroke} strokeWidth={0.35} opacity={0.6} />

      {/* small teardrop / tear at blade tip */}
      <path d="M -0.35 -9.5 Q 0 -11.5 0.35 -9.5 Q 0 -9.1 -0.35 -9.5 Z"
        fill={stroke} stroke="none" opacity={0.75} />

      {/* straight guard bar */}
      <line x1="-5" y1="5.5" x2="5" y2="5.5" stroke={stroke} strokeWidth={1} />
      {/* quillon dots at ends */}
      <circle cx={-5} cy={5.5} r={0.6} fill={stroke} />
      <circle cx={5} cy={5.5} r={0.6} fill={stroke} />

      {/* grip — rectangular with 3 wrap lines */}
      <rect x={-0.9} y={5.5} width={1.8} height={3.8} rx={0.3} fill={P} stroke={stroke} strokeWidth={0.7} />
      {[6.4, 7.3, 8.2].map(y => (
        <line key={y} x1="-0.9" y1={y} x2="0.9" y2={y} stroke={stroke} strokeWidth={0.3} />
      ))}

      {/* pommel */}
      <circle cx={0} cy={10.5} r={1.2} fill={P} stroke={stroke} strokeWidth={0.7} />
    </g>
  )
}
