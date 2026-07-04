import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        premium: "bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground font-bold shadow-lg",
        available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        rented: "bg-blue-50 text-blue-700 border border-blue-200",
        sold: "bg-purple-50 text-purple-700 border border-purple-200",
        maintenance: "bg-orange-50 text-orange-700 border border-orange-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}