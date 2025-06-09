import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

// Add this function
const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-emerald-600";
  if (score >= 80) return "bg-green-500";
  if (score >= 70) return "bg-lime-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 50) return "bg-orange-500";
  if (score >= 40) return "bg-red-400";
  if (score >= 30) return "bg-red-600";
  return "bg-blue-600";
};

interface DynamicSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  value: number[]; // Expecting [value]
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DynamicSliderProps
>(({ className, value, ...props }, ref) => {
  const currentValue = value?.[0] ?? 0;

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className={cn("absolute h-full", getScoreColor(currentValue))} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
