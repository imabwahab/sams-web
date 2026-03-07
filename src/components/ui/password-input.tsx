"use client";

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative group">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-border/60 bg-background/50 px-4 py-3 pr-12 text-base transition-all duration-200",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground/50",
          "focus-visible:outline-none focus-visible:border-primary focus-visible:bg-background focus-visible:shadow-sm focus-visible:shadow-primary/10",
          "hover:border-primary/40 hover:bg-background/80",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200",
          "text-muted-foreground/60 hover:text-foreground hover:bg-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        )}
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
        data-testid="button-toggle-password"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </button>
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

