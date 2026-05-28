import type { MotifProps } from './types'

const P = '#fdf8f0'

export function MotifFlame({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* smoke wisps above tip — render behind flame */}
      <path d="M 0.5 -11 C 1.5 -13.5 -1 -15 -0.5 -17"
        fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="0.8 1.2" opacity={0.6} />
      <path d="M -0.5 -11 C -2 -13 0.5 -15.5 -1.5 -17.5"
        fill="none" stroke={stroke} strokeWidth={0.28} strokeDasharray="0.8 1.2" opacity={0.4} />
      <path d="M 1.5 -11 C 3 -13.5 1.5 -16 2.5 -18"
        fill="none" stroke={stroke} strokeWidth={0.22} strokeDasharray="0.8 1.2" opacity={0.25} />

      {/* outer flame — teardrop/ogive, leans slightly left */}
      <path d="M -0.5 -10 C 5 -7 7 -2 6 3 Q 4 8 0 9 Q -4 8 -6 3 C -7 -2 -5.5 -7.5 -0.5 -10 Z"
        fill={P} stroke={stroke} strokeWidth={1.2} />

      {/* inner flame core — smaller, offset right */}
      <path d="M 0.5 -7 C 3 -5 3.5 -1 2.5 3.5"
        fill="none" stroke={stroke} strokeWidth={0.55} />

      {/* outer field lines */}
      <path d="M -0.5 -7 C -3.5 -4 -4 0 -2.5 4" fill="none" stroke={stroke} strokeWidth={0.45} />
      <path d="M -0.5 -5 C 1.5 -2 1.5 1 0.8 4" fill="none" stroke={stroke} strokeWidth={0.35} />

      {/* brazier base: two columns + horizontal platform */}
      <rect x={-4} y={9.5} width={1.2} height={3.5} rx={0.2} fill={P} stroke={stroke} strokeWidth={0.5} />
      <rect x={2.8} y={9.5} width={1.2} height={3.5} rx={0.2} fill={P} stroke={stroke} strokeWidth={0.5} />
      <rect x={-5.2} y={12.8} width={10.4} height={1.1} rx={0.2} fill={P} stroke={stroke} strokeWidth={0.6} />

      {/* tip dot */}
      <circle cx={-0.5} cy={-10} r={0.5} fill={stroke} />
    </g>
  )
}
