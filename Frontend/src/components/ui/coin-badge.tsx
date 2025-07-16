import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoinBadgeProps {
  amount?: number; // ← ahora opcional
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CoinBadge({
  amount = 0,
  size = "md",
  className,
}: CoinBadgeProps) {
  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-coin text-coin-foreground font-semibold",
        sizeClasses[size],
        className
      )}
    >
      <Coins className={iconSizes[size]} />
      <span>{amount.toLocaleString()}</span>
    </div>
  );
}
