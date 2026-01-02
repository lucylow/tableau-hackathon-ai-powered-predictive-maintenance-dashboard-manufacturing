import { ReactNode } from "react";

interface StatCardProps {
  value: string;
  label: string;
  icon: ReactNode;
  delay?: number;
}

export const StatCard = ({ value, label, icon, delay = 0 }: StatCardProps) => {
  return (
    <div 
      className="group p-6 rounded-2xl glass-card hover:glow-primary transition-all duration-500 hover:scale-105 hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
          <div className="text-primary-foreground">{icon}</div>
        </div>
        <div className="text-4xl font-bold gradient-text mb-2">{value}</div>
        <div className="text-muted-foreground text-sm">{label}</div>
      </div>
    </div>
  );
};
