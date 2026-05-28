import type { MotifProps } from './types'

export function MotifWave({ stroke = '#2c1d0e', opacity = 1 }: MotifProps) {
  // Three stacked sinusoidal waves — like a physics diagram
  // Each wave: amplitude markers + the sinusoidal path
  return (
    <g opacity={opacity} strokeLinecap="round">
      {/* baseline construction lines */}
      <line x1="-10" y1="-4" x2="10" y2="-4" stroke={stroke} strokeWidth={0.3} strokeDasharray="1.5 2" />
      <line x1="-10" y1="0" x2="10" y2="0" stroke={stroke} strokeWidth={0.3} strokeDasharray="1.5 2" />
      <line x1="-10" y1="4" x2="10" y2="4" stroke={stroke} strokeWidth={0.3} strokeDasharray="1.5 2" />

      {/* top wave */}
      <path d="M -10 -4 C -7.5 -8 -2.5 -8 0 -4 C 2.5 0 7.5 0 10 -4"
        fill="none" stroke={stroke} strokeWidth={1} />
      {/* middle wave */}
      <path d="M -10 0 C -7.5 -4 -2.5 -4 0 0 C 2.5 4 7.5 4 10 0"
        fill="none" stroke={stroke} strokeWidth={0.7} />
      {/* bottom wave — tighter */}
      <path d="M -10 4 C -7.5 1.5 -2.5 1.5 0 4 C 2.5 6.5 7.5 6.5 10 4"
        fill="none" stroke={stroke} strokeWidth={0.45} />

      {/* amplitude markers */}
      <line x1="-10" y1="-8.5" x2="-10" y2="0.5" stroke={stroke} strokeWidth={0.4} />
      <line x1="-10.8" y1="-8" x2="-9.2" y2="-8" stroke={stroke} strokeWidth={0.4} />
      <line x1="-10.8" y1="0" x2="-9.2" y2="0" stroke={stroke} strokeWidth={0.4} />
    </g>
  )
}
