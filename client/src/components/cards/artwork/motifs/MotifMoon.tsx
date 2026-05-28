import type { MotifProps } from './types'

const P = '#fdf8f0'

export function MotifMoon({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* dashed outer orbit r=14 */}
      <circle r={14} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
      {/* faint halo r=10 */}
      <circle r={10} fill="none" stroke={stroke} strokeWidth={0.3} opacity={0.3} />

      {/* main crescent centered at (0,-5): outer r=8, inner mask at (-5,-5) r=7 */}
      <circle cx={0} cy={-5} r={8} fill="none" stroke={stroke} strokeWidth={1.2} />
      <circle cx={-5} cy={-5} r={7} fill={P} stroke="none" />
      {/* concentric arcs inside crescent body */}
      <path d="M 3.5 -0.13 A 6 6 0 0 0 3.5 -9.87" fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d="M 2 -2.13 A 3.5 3.5 0 0 0 2 -7.87" fill="none" stroke={stroke} strokeWidth={0.35} />

      {/* vertical dashed axis connecting main crescent and reflection */}
      <line x1="0" y1="-13" x2="0" y2="13" stroke={stroke} strokeWidth={0.3} strokeDasharray="1.5 2.5" />

      {/* water reflection — inverted crescent at (0,+7), slightly smaller */}
      <circle cx={0} cy={7} r={6} fill="none" stroke={stroke} strokeWidth={0.75} opacity={0.45} />
      <circle cx={-3.75} cy={7} r={5.25} fill={P} stroke="none" />

      {/* ripple rings around reflection center */}
      <ellipse cx={0} cy={7} rx={3} ry={0.65} fill="none" stroke={stroke} strokeWidth={0.35} opacity={0.5} />
      <ellipse cx={0} cy={7} rx={5.5} ry={1.1} fill="none" stroke={stroke} strokeWidth={0.28} opacity={0.35} />
      <ellipse cx={0} cy={7} rx={8} ry={1.5} fill="none" stroke={stroke} strokeWidth={0.22} opacity={0.2} />

      {/* crosshair at global center */}
      <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke={stroke} strokeWidth={0.4} />
      <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke={stroke} strokeWidth={0.4} />
    </g>
  )
}
