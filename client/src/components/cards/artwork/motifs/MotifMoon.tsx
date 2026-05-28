import type { MotifProps } from './types'

export function MotifMoon({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  // crescent: outer circle r=8, inner offset circle at cx=-5 r=7
  // creates a right-facing crescent (D-shape)
  // intersection points: x=4, y=±6.93
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* dashed orbit guide */}
      <circle r={11} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1.5 2" />
      {/* outer circle */}
      <circle r={8} fill="none" stroke={stroke} strokeWidth={1.2} />
      {/* crescent cutout — parchment fill blocks left portion */}
      <circle cx={-5} cy={0} r={7} fill="#fdf8f0" stroke="none" />
      {/* fine concentric arc at r=6 inside crescent */}
      <path d="M 4 5.66 A 6 6 0 0 0 4 -5.66" fill="none" stroke={stroke} strokeWidth={0.5} />
      {/* fine inner arc at r=3.5 */}
      <path d="M 4 1.94 A 3.5 3.5 0 0 0 4 -1.94" fill="none" stroke={stroke} strokeWidth={0.35} />
      {/* center crosshair */}
      <line x1="-1" y1="0" x2="1" y2="0" stroke={stroke} strokeWidth={0.4} />
      <line x1="0" y1="-1" x2="0" y2="1" stroke={stroke} strokeWidth={0.4} />
    </g>
  )
}
