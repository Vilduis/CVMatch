import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full",
    "border border-transparent px-2 py-0.5 text-[11px] font-medium",
    "transition-colors duration-150",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
    "aria-invalid:border-destructive/60 aria-invalid:ring-destructive/30",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-muted text-foreground border-border/60",
        outline:
          "border-border/80 text-foreground",
        success:
          "bg-[oklch(0.68_0.13_160/0.14)] text-[var(--success)] border-[oklch(0.68_0.13_160/0.30)]",
        warning:
          "bg-[oklch(0.76_0.14_75/0.14)] text-[var(--warning)] border-[oklch(0.76_0.14_75/0.30)]",
        destructive:
          "bg-destructive/12 text-destructive border-destructive/30",
        ghost:
          "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
