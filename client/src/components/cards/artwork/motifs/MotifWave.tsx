import type { MotifProps } from './types'

export function MotifWave({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* depth scale on left — ticks with decreasing spacing (shallow to deep) */}
      {([-7.5, -3.5, 0, 3, 5.5] as number[]).map((y, i) => (
        <line key={i} x1={-11.5} y1={y} x2={-9.5} y2={y} stroke={stroke} strokeWidth={0.35} opacity={0.6} />
      ))}

      {/* top wave with breaking crest curl */}
      <path d="M -10 -4 C -7.5 -8 -2.5 -8 0 -4 C 2.5 0 7.5 0 10 -4"
        fill="none" stroke={stroke} strokeWidth={1} />
      {/* breaking crest curl at peak (~0, -8) */}
      <path d="M -0.5 -8.5 C 0 -10.5 2 -11 2.5 -9.5 C 3 -8 2 -7 0 -8"
        fill="none" stroke={stroke} strokeWidth={0.55} />
      {/* hatching on front slope of top wave (right side, x=0 to x=6) */}
      <line x1="0.5" y1="-7.5" x2="2" y2="-9.5" stroke={stroke} strokeWidth={0.28} opacity={0.7} />
      <line x1="1.5" y1="-6.5" x2="3" y2="-8.5" stroke={stroke} strokeWidth={0.28} opacity={0.7} />
      <line x1="2.5" y1="-5.5" x2="4" y2="-7.5" stroke={stroke} strokeWidth={0.28} opacity={0.7} />
      <line x1="3.5" y1="-4.5" x2="5" y2="-6.5" stroke={stroke} strokeWidth={0.28} opacity={0.6} />
      <line x1="4.5" y1="-4" x2="6" y2="-5.8" stroke={stroke} strokeWidth={0.28} opacity={0.5} />

      {/* middle wave */}
      <path d="M -10 0 C -7.5 -4 -2.5 -4 0 0 C 2.5 4 7.5 4 10 0"
        fill="none" stroke={stroke} strokeWidth={0.7} />
      {/* bottom wave */}
      <path d="M -10 4 C -7.5 1.5 -2.5 1.5 0 4 C 2.5 6.5 7.5 6.5 10 4"
        fill="none" stroke={stroke} strokeWidth={0.45} />

      {/* depth gradient below waves — fading horizontal strokes */}
      <line x1="-6" y1="8" x2="6" y2="8" stroke={stroke} strokeWidth={0.4} opacity={0.5} />
      <line x1="-4" y1="9.2" x2="4" y2="9.2" stroke={stroke} strokeWidth={0.35} opacity={0.3} />
      <line x1="-2.5" y1="10.2" x2="2.5" y2="10.2" stroke={stroke} strokeWidth={0.28} opacity={0.18} />
    </g>
  )
}
