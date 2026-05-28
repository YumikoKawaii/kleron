import type { MotifProps } from './types'

export function MotifEye({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {/* construction lines — horizontal axis extension */}
      <line x1="-11" y1="0" x2="-9.5" y2="0" stroke={stroke} strokeWidth={0.4} />
      <line x1="9.5" y1="0" x2="11" y2="0" stroke={stroke} strokeWidth={0.4} />
      {/* vertical dashed axis */}
      <line x1="0" y1="-8" x2="0" y2="-5.2" stroke={stroke} strokeWidth={0.35} strokeDasharray="0.8 1" />
      <line x1="0" y1="5.2" x2="0" y2="8" stroke={stroke} strokeWidth={0.35} strokeDasharray="0.8 1" />

      {/* eye outline — almond shape via cubic beziers */}
      <path d="M -9.5 0 C -5 -5.5 5 -5.5 9.5 0 C 5 5.5 -5 5.5 -9.5 0 Z"
        fill="#fdf8f0" stroke={stroke} strokeWidth={1.2} />

      {/* iris */}
      <circle r={4.2} fill="#fdf8f0" stroke={stroke} strokeWidth={0.8} />
      {/* iris inner ring dashed */}
      <circle r={2.6} fill="none" stroke={stroke} strokeWidth={0.4} strokeDasharray="0.9 1.2" />
      {/* pupil */}
      <circle r={1.3} fill={stroke} />

      {/* upper eyelid crease arc */}
      <path d="M -7 -1 Q 0 -4 7 -1" fill="none" stroke={stroke} strokeWidth={0.35} />
    </g>
  )
}
