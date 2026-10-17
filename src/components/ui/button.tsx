import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-ink hover:bg-primary/90",
        outline: "border border-border bg-surface text-fg hover:bg-raised",
        ghost: "bg-transparent text-fg hover:bg-raised",
        danger: "bg-danger text-ink hover:bg-danger/90",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, asChild, type, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant }), className)}
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}
