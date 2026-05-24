"use client"

import { motion, type HTMLMotionProps } from "motion/react"
import { ease, duration } from "@/lib/motion"

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number
  y?: number
}

export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
