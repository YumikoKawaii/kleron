import type { MotifProps } from './types'

export function MotifFlame({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* outer flame — ogive/teardrop */}
      <path d="M 0 -10 C 5 -7 7 -2 6 3 Q 4 8 0 9 Q -4 8 -6 3 C -7 -2 -5 -7 0 -10 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.2} />
      {/* inner field lines — parallel curved lines suggesting heat */}
      <path d="M 0 -7 C 3 -4 3.5 0 2.5 4" fill="none" stroke={stroke} strokeWidth={0.45} />
      <path d="M 0 -7 C -3 -4 -3.5 0 -2.5 4" fill="none" stroke={stroke} strokeWidth={0.45} />
      <path d="M 0 -5 C 1.5 -2 1.5 1 0.8 4" fill="none" stroke={stroke} strokeWidth={0.35} />
      {/* base construction mark */}
      <line x1="-3" y1="9" x2="3" y2="9" stroke={stroke} strokeWidth={0.4} strokeDasharray="1 1" />
      {/* tip dot */}
      <circle cx={0} cy={-10} r={0.5} fill={stroke} />
    </g>
  )
}
