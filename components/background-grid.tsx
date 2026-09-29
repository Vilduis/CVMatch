export default function BackgroundGrid({
  origin = "top",
  className = "h-[640px]",
}: {
  origin?: "top" | "center"
  className?: string
}) {
  const mask = `radial-gradient(ellipse 70% 60% at 50% ${origin === "top" ? "0%" : "50%"}, black 30%, transparent 75%)`

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.270 0.006 257 / 60%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.270 0.006 257 / 60%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  )
}
