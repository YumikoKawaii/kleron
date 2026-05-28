import type { MotifProps } from '../motifs/types'

const P = '#fdf8f0'

// Pentagram outer points at r=10.5 (extend slightly past circle r=9)
const PTS = Array.from({ length: 5 }, (_, i) => {
  const a = (i * 72 - 90) * (Math.PI / 180)
  return [+(Math.cos(a) * 10.5).toFixed(3), +(Math.sin(a) * 10.5).toFixed(3)] as [number, number]
})

// Pentagram: connect every other vertex (0→2→4→1→3→0)
const STAR_D = `M ${PTS[0].join(' ')} L ${PTS[2].join(' ')} L ${PTS[4].join(' ')} L ${PTS[1].join(' ')} L ${PTS[3].join(' ')} Z`

// Dashed construction pentagon (sequential vertices)
const PENT_D = `M ${PTS.map(p => p.join(',')).join(' L ')} Z`

// 5 diamond lozenge marks at midpoints between consecutive star points, r=9.7
const DIAMONDS = Array.from({ length: 5 }, (_, i) => {
  const a = ((i * 72 - 90) + 36) * (Math.PI / 180)
  return {
    cx: +(Math.cos(a) * 9.7).toFixed(2),
    cy: +(Math.sin(a) * 9.7).toFixed(2),
  }
})

export function SuitPentacle({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* outer circle r=9 */}
      <circle r={9} fill="none" stroke={stroke} strokeWidth={0.9} />
      {/* dashed construction pentagon */}
      <path d={PENT_D} fill="none" stroke={stroke} strokeWidth={0.35} strokeDasharray="1 1.5" />

      {/* pentagram star — points extend slightly past circle */}
      <path d={STAR_D} fill={P} stroke={stroke} strokeWidth={1} />

      {/* 5 diamond lozenge marks between arms and circle */}
      {DIAMONDS.map((d, i) => (
        <rect key={i}
          x={d.cx - 0.85} y={d.cy - 0.85} width={1.7} height={1.7}
          transform={`rotate(45 ${d.cx} ${d.cy})`}
          fill={P} stroke={stroke} strokeWidth={0.35} />
      ))}

      {/* center dot with inner circle */}
      <circle r={1.3} fill={P} stroke={stroke} strokeWidth={0.4} />
      <circle r={0.5} fill={stroke} />
    </g>
  )
}
