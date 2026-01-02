import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge: string;
  color: string;
}

export const FeatureCard = ({ icon, title, description, badge, color }: FeatureCardProps) => {
  return (
    <div 
      className="group p-6 rounded-2xl glass-card hover:bg-card/60 transition-all duration-500 hover:scale-[1.02] border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="p-3 rounded-xl transition-colors duration-300"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <Badge variant="secondary" className="bg-secondary/80">
        {badge}
      </Badge>
    </div>
  );
};
