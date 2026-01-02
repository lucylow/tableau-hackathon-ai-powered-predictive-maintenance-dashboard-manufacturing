import { Equipment, EquipmentStatus } from "@/types/equipment";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Factory, AlertTriangle, CheckCircle, Clock, Wrench, XCircle, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage, getHealthLabel } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

interface EquipmentHealthCardProps {
  equipment: Equipment;
  compact?: boolean;
}

export const EquipmentHealthCard = ({ equipment, compact = false }: EquipmentHealthCardProps) => {
  const navigate = useNavigate();
  const health = equipment.currentHealthScore;

  const getHealthColorClass = (score: number) => {
    if (score >= 0.8) return "bg-success";
    if (score >= 0.6) return "bg-warning";
    return "bg-destructive";
  };

  const getHealthBorderClass = (score: number) => {
    if (score >= 0.8) return "border-l-success";
    if (score >= 0.6) return "border-l-warning";
    return "border-l-destructive";
  };

  const getStatusIcon = (status: EquipmentStatus) => {
    switch (status) {
      case EquipmentStatus.OPERATIONAL:
        return <CheckCircle className="w-4 h-4 text-success" />;
      case EquipmentStatus.DEGRADED:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case EquipmentStatus.MAINTENANCE:
        return <Wrench className="w-4 h-4 text-primary" />;
      case EquipmentStatus.FAILED:
        return <XCircle className="w-4 h-4 text-destructive" />;
      case EquipmentStatus.IDLE:
        return <Pause className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: EquipmentStatus, health: number) => {
    if (health < 0.6) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Critical
        </Badge>
      );
    }
    if (health < 0.8) {
      return (
        <Badge className="bg-warning text-warning-foreground gap-1">
          <Clock className="w-3 h-3" />
          Warning
        </Badge>
      );
    }
    return (
      <Badge className="bg-success text-success-foreground gap-1">
        <CheckCircle className="w-3 h-3" />
        Healthy
      </Badge>
    );
  };

  if (compact) {
    return (
      <div 
        onClick={() => navigate(`/equipment/${equipment.id}`)}
        className="flex items-center gap-4 p-3 rounded-lg glass-card hover:bg-card/60 transition-all cursor-pointer group"
      >
        <div className={cn(
          "p-2 rounded-lg",
          health >= 0.8 ? "bg-success/20 text-success" : 
          health >= 0.6 ? "bg-warning/20 text-warning" : 
          "bg-destructive/20 text-destructive"
        )}>
          <Factory className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{equipment.name}</span>
            {getStatusBadge(equipment.status, health)}
          </div>
          <p className="text-sm text-muted-foreground">{equipment.type} • {equipment.productionLine}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20">
            <Progress value={health * 100} indicatorClassName={getHealthColorClass(health)} />
          </div>
          <span className={cn(
            "text-sm font-mono font-semibold w-14 text-right",
            health >= 0.8 ? "text-success" : health >= 0.6 ? "text-warning" : "text-destructive"
          )}>
            {formatPercentage(health)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-l-4",
        getHealthBorderClass(health)
      )}
      onClick={() => navigate(`/equipment/${equipment.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">{equipment.equipmentId}</p>
          </div>
          {getStatusIcon(equipment.status)}
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Health Score</span>
              <span className={cn(
                "font-mono font-bold",
                health >= 0.8 ? "text-success" : health >= 0.6 ? "text-warning" : "text-destructive"
              )}>
                {formatPercentage(health)}
              </span>
            </div>
            <Progress value={health * 100} className="h-2" indicatorClassName={getHealthColorClass(health)} />
          </div>

          <div className="flex flex-wrap gap-2">
            {getStatusBadge(equipment.status, health)}
            <Badge variant="outline" className="text-xs">
              {equipment.factoryId}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Crit: {formatPercentage(equipment.criticalityScore)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
