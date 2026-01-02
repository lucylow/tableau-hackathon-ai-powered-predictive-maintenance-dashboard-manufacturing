import { cn } from "@/lib/utils";

interface FloatingOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "accent";
  delay?: boolean;
}

export const FloatingOrb = ({ 
  className, 
  size = "md", 
  color = "primary",
  delay = false 
}: FloatingOrbProps) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
  };

  const colorClasses = {
    primary: "from-primary/20 to-primary/5",
    accent: "from-accent/15 to-accent/5",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full bg-gradient-radial blur-3xl pointer-events-none",
        sizeClasses[size],
        colorClasses[color],
        delay ? "animate-float-delay" : "animate-float",
        className
      )}
      style={{
        background: `radial-gradient(circle, hsl(var(--${color}) / 0.2) 0%, transparent 70%)`,
      }}
    />
  );
};
