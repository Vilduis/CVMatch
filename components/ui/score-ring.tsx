"use client"

import { useEffect, useRef } from "react"

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getConfig(score: number) {
  if (score >= 70)
    return {
      color: "#10b981",
      textClass: "text-emerald-600 dark:text-emerald-400",
    }
  if (score >= 50)
    return {
      color: "#f59e0b",
      textClass: "text-amber-600 dark:text-amber-400",
    }
  return {
    color: "#f43f5e",
    textClass: "text-rose-600 dark:text-rose-400",
  }
}

interface ScoreRingProps {
  score: number
  size?: number
}

export function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const { color, textClass } = getConfig(score)
  const targetOffset = CIRCUMFERENCE * (1 - score / 100)

  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
    circle.style.strokeDashoffset = String(CIRCUMFERENCE)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
        circle.style.strokeDashoffset = String(targetOffset)
      })
    })
  }, [targetOffset])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          className="text-border"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black leading-none tabular-nums ${textClass}`}>
          {score}
        </span>
        <span className="mt-0.5 text-sm font-medium text-muted-foreground">%</span>
      </div>
    </div>
  )
}
