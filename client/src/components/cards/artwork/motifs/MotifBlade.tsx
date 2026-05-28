import type { MotifProps } from './types'

export function MotifBlade({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* blade — double edge implied by parallel lines */}
      <path d="M 0 -10 L 1.2 5 L 0 7 L -1.2 5 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.1} />
      {/* centre fuller (groove line) */}
      <line x1="0" y1="-8" x2="0" y2="5" stroke={stroke} strokeWidth={0.4} />
      {/* guard — crosspiece */}
      <path d="M -5.5 5 Q -4 4.5 0 5.5 Q 4 4.5 5.5 5"
        fill="none" stroke={stroke} strokeWidth={1} />
      <path d="M -5.5 6.5 Q -4 6 0 7 Q 4 6 5.5 6.5"
        fill="none" stroke={stroke} strokeWidth={0.5} />
      {/* grip */}
      <rect x={-1} y={7} width={2} height={4} rx={0.4} fill="#fdf8f0" stroke={stroke} strokeWidth={0.7} />
      {/* grip wrap lines */}
      {[8, 9, 10].map(y => (
        <line key={y} x1="-1" y1={y} x2="1" y2={y} stroke={stroke} strokeWidth={0.3} />
      ))}
      {/* pommel */}
      <circle cx={0} cy={12} r={1.5} fill="#fdf8f0" stroke={stroke} strokeWidth={0.8} />
      {/* tip dot */}
      <circle cx={0} cy={-10} r={0.45} fill={stroke} />
    </g>
  )
}
