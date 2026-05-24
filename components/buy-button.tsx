"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface BuyButtonProps {
  planId: string
  credits: number
  popular?: boolean
  variant?: "default" | "outline"
  size?: "sm" | "default" | "lg"
  className?: string
  children?: React.ReactNode
}

export default function BuyButton({
  planId,
  credits,
  popular,
  variant,
  size = "sm",
  className,
  children,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()

      if (res.status === 401) {
        toast.error("Debes iniciar sesión para comprar créditos")
        setLoading(false)
        return
      }
      if (!res.ok) throw new Error(data.error ?? "Error al procesar el pago")

      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar el pago")
      setLoading(false)
    }
  }

  const resolvedVariant = variant ?? (popular ? "default" : "outline")

  return (
    <Button
      onClick={handleBuy}
      disabled={loading}
      size={size}
      variant={resolvedVariant}
      className={className ?? "w-full"}
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      {children ?? (loading ? "Procesando…" : `Comprar ${credits} análisis`)}
    </Button>
  )
}
