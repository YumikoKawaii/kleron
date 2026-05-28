import type { MotifProps } from './types'

const P = '#fdf8f0'

export function MotifHand({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* wrist shadow arc */}
      <path d="M -5 8 Q 0 10.5 5 8" fill="none" stroke={stroke} strokeWidth={0.35} opacity={0.5} />
      {/* wrist */}
      <path d="M -5 8 Q -5.5 10 -4 10 L 4 10 Q 5.5 10 5 8"
        fill="none" stroke={stroke} strokeWidth={0.9} />
      {/* palm */}
      <path d="M -5 8 L -6 0 Q -6.5 -3 -5 -3 L 5 -3 Q 6.5 -3 6 0 L 5 8 Z"
        fill={P} stroke={stroke} strokeWidth={1.1} />

      {/* palm crease lines (simplified life/head/heart lines) */}
      <path d="M -1 -2 Q -3 1 -4 4.5" fill="none" stroke={stroke} strokeWidth={0.38} opacity={0.6} />
      <path d="M -4 0.5 Q -1 0 3 1.5" fill="none" stroke={stroke} strokeWidth={0.38} opacity={0.6} />
      <path d="M -4.5 -1 Q -1 -1.5 3.5 -0.5" fill="none" stroke={stroke} strokeWidth={0.38} opacity={0.6} />

      {/* fingers — 4 tapered rounded columns */}
      {([-4.2, -1.4, 1.4, 4.2] as number[]).map((x, i) => (
        <path key={i}
          d={`M ${x - 1.1} -3 L ${x - 0.9} ${-9 - (i === 0 || i === 3 ? 1 : 0.5)} Q ${x} ${-11.5 - (i === 0 || i === 3 ? 0.5 : 0)} ${x + 0.9} ${-9 - (i === 0 || i === 3 ? 1 : 0.5)} L ${x + 1.1} -3`}
          fill={P} stroke={stroke} strokeWidth={0.9} />
      ))}
      {/* thumb */}
      <path d="M -5 0 Q -7.5 0 -8 -2 Q -8.5 -5 -6.5 -6 Q -5.5 -6.5 -5 -5"
        fill={P} stroke={stroke} strokeWidth={0.9} />

      {/* energy radiating lines from palm center */}
      {([-50, -25, 0, 25, 50] as number[]).map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180
        return (
          <line key={i} x1="0" y1="2"
            x2={+(Math.cos(a) * 7).toFixed(2)} y2={+(2 + Math.sin(a) * 7).toFixed(2)}
            stroke={stroke} strokeWidth={0.32} strokeDasharray="0.7 0.8" opacity={0.5} />
        )
      })}

      {/* Hamsa eye in palm center */}
      <path d="M -2 1.5 C -1 0 1 0 2 1.5 C 1 3 -1 3 -2 1.5 Z"
        fill={P} stroke={stroke} strokeWidth={0.55} />
      <circle cx={0} cy={1.5} r={0.5} fill={stroke} />
    </g>
  )
}
