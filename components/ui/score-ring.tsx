"use client"

import { useEffect, useRef } from "react"

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type Level = "excellent" | "moderate" | "low"

function getLevel(score: number): Level {
  if (score >= 70) return "excellent"
  if (score >= 50) return "moderate"
  return "low"
}

const levelStyles: Record<Level, { stroke: string; text: string }> = {
  excellent: { stroke: "var(--success)", text: "text-[var(--success)]" },
  moderate:  { stroke: "var(--warning)", text: "text-[var(--warning)]" },
  low:       { stroke: "var(--danger)",  text: "text-[var(--danger)]" },
}

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ScoreRing({ score, size = 160, strokeWidth = 6 }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const level = getLevel(score)
  const { stroke, text } = levelStyles[level]
  const targetOffset = CIRCUMFERENCE * (1 - score / 100)

  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
    circle.style.strokeDashoffset = String(CIRCUMFERENCE)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.transition = "stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.30, 1)"
        circle.style.strokeDashoffset = String(targetOffset)
      })
    })
  }, [targetOffset])

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        className="-rotate-90"
        width={size}
        height={size}
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          ref={circleRef}
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-[44px] font-semibold leading-none tabular-nums ${text}`}>
          {score}
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  )
}
