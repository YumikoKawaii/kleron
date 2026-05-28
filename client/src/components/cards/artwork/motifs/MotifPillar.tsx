import type { MotifProps } from './types'

export function MotifPillar({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  // Classical column with entasis (slight curvature), capital and base
  const shaft = 'M -3 -7 Q -3.4 0 -3 7 L 3 7 Q 3.4 0 3 -7 Z'
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* capital (top block) */}
      <rect x={-5} y={-10} width={10} height={2.2} rx={0.3} fill="#fdf8f0" stroke={stroke} strokeWidth={0.9} />
      <rect x={-3.8} y={-7.8} width={7.6} height={1} rx={0.2} fill="#fdf8f0" stroke={stroke} strokeWidth={0.5} />
      {/* shaft with entasis */}
      <path d={shaft} fill="#fdf8f0" stroke={stroke} strokeWidth={1} />
      {/* horizontal drum lines — like blocks on a column */}
      {[-4, -1, 2, 5].map(y => (
        <line key={y} x1={-3.2} y1={y} x2={3.2} y2={y} stroke={stroke} strokeWidth={0.35} />
      ))}
      {/* base blocks */}
      <rect x={-3.8} y={7} width={7.6} height={1} rx={0.2} fill="#fdf8f0" stroke={stroke} strokeWidth={0.5} />
      <rect x={-5} y={8} width={10} height={2} rx={0.3} fill="#fdf8f0" stroke={stroke} strokeWidth={0.9} />
      {/* centre line, dashed */}
      <line x1="0" y1="-12" x2="0" y2="-10.5" stroke={stroke} strokeWidth={0.35} strokeDasharray="0.8 1" />
      <line x1="0" y1="10" x2="0" y2="11.5" stroke={stroke} strokeWidth={0.35} strokeDasharray="0.8 1" />
    </g>
  )
}
