import Image from "next/image"
import { cn } from "@/lib/utils"

export default function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      aria-hidden
      width={195}
      height={128}
      priority
      className={cn("h-6 w-auto shrink-0 select-none", className)}
    />
  )
}
