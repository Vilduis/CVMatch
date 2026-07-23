/**
 * Motion design tokens — easings + durations.
 * Used with motion/react across the app. See design-tokens.md §8.
 */

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,        // ease-out quartic — snappy entrance
  inOut: [0.65, 0, 0.35, 1] as const,     // smooth bidirectional
  in: [0.5, 0, 0.75, 0] as const,         // exit
} as const

export const duration = {
  instant: 0.1,
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  slower: 0.45,
} as const

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, ease: ease.out },
}

export function stagger(delayPerItem = 0.04) {
  return (index: number) => ({
    ...fadeUp,
    transition: { ...fadeUp.transition, delay: index * delayPerItem },
  })
}
