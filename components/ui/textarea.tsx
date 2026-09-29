import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground",
        "transition-[border-color,box-shadow] duration-150 ease-out outline-none",
        "placeholder:text-muted-foreground/70",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
