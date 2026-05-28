import type { MotifProps } from './types'

// Upward open palm — diagrammatic/anatomical illustration style
export function MotifHand({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* wrist */}
      <path d="M -5 8 Q -5.5 10 -4 10 L 4 10 Q 5.5 10 5 8"
        fill="none" stroke={stroke} strokeWidth={0.9} />
      {/* palm */}
      <path d="M -5 8 L -6 0 Q -6.5 -3 -5 -3 L 5 -3 Q 6.5 -3 6 0 L 5 8 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.1} />
      {/* fingers — 4 vertical rounded columns */}
      {([-4.2, -1.4, 1.4, 4.2] as number[]).map((x, i) => (
        <path key={i}
          d={`M ${x - 1.2} -3 L ${x - 1.2} ${-9 - (i === 0 || i === 3 ? 1 : 0)} Q ${x} ${-11.5 - (i === 0 || i === 3 ? 0.5 : 0)} ${x + 1.2} ${-9 - (i === 0 || i === 3 ? 1 : 0)} L ${x + 1.2} -3`}
          fill="#fdf8f0" stroke={stroke} strokeWidth={0.9} />
      ))}
      {/* thumb */}
      <path d="M -5 0 Q -7.5 0 -8 -2 Q -8.5 -5 -6.5 -6 Q -5.5 -6.5 -5 -5"
        fill="#fdf8f0" stroke={stroke} strokeWidth={0.9} />
      {/* knuckle construction lines */}
      <line x1="-5.5" y1="-3" x2="5.5" y2="-3" stroke={stroke} strokeWidth={0.35} strokeDasharray="1 1.2" />
      <line x1="-5" y1="-6.5" x2="5" y2="-6.5" stroke={stroke} strokeWidth={0.35} strokeDasharray="1 1.2" />
    </g>
  )
}
