import type { MotifProps } from './types'

const P = '#fdf8f0'

export function MotifEye({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* all-seeing triangle framing above */}
      <path d="M -5.5 -8 L 0 -13 L 5.5 -8"
        fill="none" stroke={stroke} strokeWidth={0.65} opacity={0.8} />

      {/* eye outline — almond/vesica ~22 units wide */}
      <path d="M -11 0 C -6 -6.5 6 -6.5 11 0 C 6 6.5 -6 6.5 -11 0 Z"
        fill={P} stroke={stroke} strokeWidth={1.2} />

      {/* iris radial lines (14 spokes, pupil r=1.5 → iris r=5) */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i * (360 / 14)) * Math.PI / 180
        return (
          <line key={i}
            x1={+(Math.cos(a) * 1.5).toFixed(2)} y1={+(Math.sin(a) * 1.5).toFixed(2)}
            x2={+(Math.cos(a) * 5).toFixed(2)} y2={+(Math.sin(a) * 5).toFixed(2)}
            stroke={stroke} strokeWidth={0.25} />
        )
      })}

      {/* iris ring */}
      <circle r={5} fill="none" stroke={stroke} strokeWidth={0.75} />
      {/* pupil */}
      <circle r={1.5} fill={stroke} />

      {/* upper eyelid crease arc */}
      <path d="M -8 -1.5 Q 0 -5 8 -1.5" fill="none" stroke={stroke} strokeWidth={0.4} />
      {/* lower lid shadow arc */}
      <path d="M -8 1.5 Q 0 5 8 1.5" fill="none" stroke={stroke} strokeWidth={0.35} opacity={0.5} />

      {/* lash lines from right corner */}
      <line x1="10.5" y1="0.2" x2="13.5" y2="-1.5" stroke={stroke} strokeWidth={0.4} />
      <line x1="10.5" y1="0" x2="14" y2="0.8" stroke={stroke} strokeWidth={0.35} />
      <line x1="10.5" y1="-0.5" x2="13" y2="-3.5" stroke={stroke} strokeWidth={0.3} />
      <line x1="10.5" y1="0.5" x2="12.5" y2="2.5" stroke={stroke} strokeWidth={0.3} />
      {/* lash lines from left corner (mirrored) */}
      <line x1="-10.5" y1="0.2" x2="-13.5" y2="-1.5" stroke={stroke} strokeWidth={0.4} />
      <line x1="-10.5" y1="0" x2="-14" y2="0.8" stroke={stroke} strokeWidth={0.35} />
      <line x1="-10.5" y1="-0.5" x2="-13" y2="-3.5" stroke={stroke} strokeWidth={0.3} />
      <line x1="-10.5" y1="0.5" x2="-12.5" y2="2.5" stroke={stroke} strokeWidth={0.3} />

      {/* ground shadow ellipse below */}
      <ellipse cx={0} cy={8} rx={7.5} ry={1.8}
        fill="none" stroke={stroke} strokeWidth={0.3} opacity={0.3} />
    </g>
  )
}
