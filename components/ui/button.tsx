import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium select-none",
    "border border-transparent bg-clip-padding",
    "transition-[background,border,box-shadow,color,transform] duration-150 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "active:not-disabled:translate-y-px",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)]",
        secondary:
          "bg-muted text-foreground hover:bg-muted/80 border-border/60",
        outline:
          "border-border/80 bg-transparent text-foreground hover:bg-muted/60 hover:border-border",
        ghost:
          "bg-transparent text-foreground/80 hover:bg-muted/60 hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 hover:border-destructive/40 focus-visible:ring-destructive/40",
        link:
          "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline focus-visible:ring-0",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 rounded-md px-3 text-[13px]",
        lg: "h-11 rounded-md px-6 text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
