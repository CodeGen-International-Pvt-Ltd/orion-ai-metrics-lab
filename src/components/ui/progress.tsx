
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  variant?: 'default' | 'score';
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-emerald-600"; // Dark green
  if (score >= 80) return "bg-green-500"; // Light green
  if (score >= 70) return "bg-lime-500"; // Yellow-green
  if (score >= 60) return "bg-yellow-500"; // Yellow
  if (score >= 50) return "bg-orange-500"; // Orange
  if (score >= 40) return "bg-red-400"; // Light red
  if (score >= 30) return "bg-red-600"; // Red
  return "bg-blue-600"; // Blue for very low scores
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-500 ease-out",
        variant === 'score' && value !== undefined 
          ? getScoreColor(value)
          : "bg-primary"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
