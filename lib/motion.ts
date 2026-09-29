export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  in: [0.5, 0, 0.75, 0] as const,
} as const

export const duration = {
  instant: 0.1,
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  slower: 0.45,
} as const
