import type { MotifProps } from '../motifs/types'

export function SuitSword({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* blade */}
      <path d="M 0 -9 L 1 4 L 0 5.5 L -1 4 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1} />
      {/* fuller line */}
      <line x1="0" y1="-7.5" x2="0" y2="3.5" stroke={stroke} strokeWidth={0.35} />
      {/* guard */}
      <line x1="-5" y1="5.5" x2="5" y2="5.5" stroke={stroke} strokeWidth={1} />
      {/* grip */}
      <rect x={-0.9} y={5.5} width={1.8} height={3.5} rx={0.3} fill="#fdf8f0" stroke={stroke} strokeWidth={0.7} />
      {/* pommel */}
      <circle cx={0} cy={10.5} r={1.2} fill="#fdf8f0" stroke={stroke} strokeWidth={0.7} />
      {/* tip dot */}
      <circle cx={0} cy={-9} r={0.4} fill={stroke} />
    </g>
  )
}
