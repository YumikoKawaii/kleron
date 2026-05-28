import type { MotifProps } from '../motifs/types'

export function SuitWand({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* main staff */}
      <line x1="0" y1="-9" x2="0" y2="9" stroke={stroke} strokeWidth={1} />
      {/* branches — three pairs at different heights */}
      <path d="M 0 -5 Q 3 -5.5 4 -4" fill="none" stroke={stroke} strokeWidth={0.8} />
      <path d="M 0 -5 Q -3 -5.5 -4 -4" fill="none" stroke={stroke} strokeWidth={0.8} />
      <path d="M 0 0 Q 3.5 0 4.5 1.5" fill="none" stroke={stroke} strokeWidth={0.7} />
      <path d="M 0 0 Q -3.5 0 -4.5 1.5" fill="none" stroke={stroke} strokeWidth={0.7} />
      <path d="M 0 5 Q 2.5 4.5 3.5 6" fill="none" stroke={stroke} strokeWidth={0.55} />
      <path d="M 0 5 Q -2.5 4.5 -3.5 6" fill="none" stroke={stroke} strokeWidth={0.55} />
      {/* tip and base dots */}
      <circle cx={0} cy={-9} r={0.55} fill={stroke} />
      <circle cx={0} cy={9} r={0.55} fill={stroke} />
    </g>
  )
}
