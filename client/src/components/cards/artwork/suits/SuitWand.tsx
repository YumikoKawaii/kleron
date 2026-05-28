import type { MotifProps } from '../motifs/types'

const P = '#fdf8f0'

// Leaf bud teardrop at a branch tip position/angle
function bud(cx: number, cy: number, angleDeg: number) {
  const a = angleDeg * Math.PI / 180
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  const bx = +(cx + dx * 1.1).toFixed(2)
  const by = +(cy + dy * 1.1).toFixed(2)
  return (
    <ellipse cx={bx} cy={by} rx={0.55} ry={0.9}
      transform={`rotate(${angleDeg} ${bx} ${by})`}
      fill={P} stroke="none" />
  )
}

export function SuitWand({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* tapered staff — wider at base */}
      <path d="M -0.8 -10 L -1.5 10 L 1.5 10 L 0.8 -10 Z"
        fill={P} stroke={stroke} strokeWidth={0.85} />
      {/* bark texture — diagonal tick marks */}
      {([[-7, 0.8], [-4, -0.6], [-1, 0.7], [2, -0.5], [5, 0.6]] as [number, number][]).map(([y, s], i) => (
        <line key={i} x1={-0.8 + s * 0.25} y1={y} x2={0.8 + s * 0.25} y2={y + s * 0.45}
          stroke={stroke} strokeWidth={0.3} opacity={0.65} />
      ))}

      {/* branches at y=-6 */}
      <path d="M 0 -6 Q 3.5 -6.5 5 -5" fill="none" stroke={stroke} strokeWidth={0.75} />
      <path d="M 0 -6 Q -3.5 -6.5 -5 -5" fill="none" stroke={stroke} strokeWidth={0.75} />
      {bud(5, -5, -20)}
      {bud(-5, -5, -160)}

      {/* branches at y=0 */}
      <path d="M 0 0 Q 3.5 0 4.5 1.5" fill="none" stroke={stroke} strokeWidth={0.65} />
      <path d="M 0 0 Q -3.5 0 -4.5 1.5" fill="none" stroke={stroke} strokeWidth={0.65} />
      {bud(4.5, 1.5, 30)}
      {bud(-4.5, 1.5, 150)}

      {/* branches at y=+6 */}
      <path d="M 0 6 Q 2.5 5.5 3.5 7" fill="none" stroke={stroke} strokeWidth={0.55} />
      <path d="M 0 6 Q -2.5 5.5 -3.5 7" fill="none" stroke={stroke} strokeWidth={0.55} />
      {bud(3.5, 7, 40)}
      {bud(-3.5, 7, 140)}

      {/* tip glow dot */}
      <circle cx={0} cy={-10} r={1} fill={stroke} />
      <circle cx={0} cy={-10} r={1.8} fill="none" stroke={stroke} strokeWidth={0.3} opacity={0.4} />

      {/* base root strokes */}
      <path d="M 0 9.5 Q -1.5 11 -1.5 12" fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d="M 0 9.5 Q 1.5 11 1.5 12" fill="none" stroke={stroke} strokeWidth={0.5} />
      <path d="M 0 10 Q 0 11.5 0 12.5" fill="none" stroke={stroke} strokeWidth={0.4} />
    </g>
  )
}
