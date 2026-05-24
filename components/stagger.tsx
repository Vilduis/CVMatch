"use client"

import { motion, type HTMLMotionProps } from "motion/react"
import { ease, duration } from "@/lib/motion"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
}

const item = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
}

export function StaggerList(props: HTMLMotionProps<"ul">) {
  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={container}
      {...props}
    />
  )
}

export function StaggerListItem(props: HTMLMotionProps<"li">) {
  return <motion.li variants={item} {...props} />
}

export function StaggerDiv(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      {...props}
    />
  )
}

export function StaggerDivItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={item} {...props} />
}
