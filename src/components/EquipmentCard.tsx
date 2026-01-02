import { Factory, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Equipment {
  id: number;
  name: string;
  health: number;
  status: "critical" | "warning" | "healthy";
  type: string;
  lastMaintenance: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
}

export const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-success";
    if (health >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Critical
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-warning text-warning-foreground gap-1">
            <Clock className="w-3 h-3" />
            Warning
          </Badge>
        );
      default:
        return (
          <Badge className="bg-success text-success-foreground gap-1">
            <CheckCircle className="w-3 h-3" />
            Healthy
          </Badge>
        );
    }
  };

  const getIconColor = (health: number) => {
    if (health >= 80) return "text-success";
    if (health >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="group p-4 rounded-xl glass-card hover:bg-card/60 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded-lg bg-secondary/50", getIconColor(equipment.health))}>
          <Factory className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">{equipment.name}</span>
            {getStatusBadge(equipment.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            {equipment.type} • Last: {equipment.lastMaintenance}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-20">
            <Progress 
              value={equipment.health} 
              className="h-2"
              indicatorClassName={getHealthColor(equipment.health)}
            />
          </div>
          <span className={cn("text-sm font-mono font-semibold w-12 text-right", getIconColor(equipment.health))}>
            {Math.round(equipment.health)}%
          </span>
        </div>
      </div>
    </div>
  );
};
