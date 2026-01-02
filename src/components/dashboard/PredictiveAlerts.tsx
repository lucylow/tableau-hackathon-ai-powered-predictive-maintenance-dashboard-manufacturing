import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ChevronRight 
} from "lucide-react";
import { FailurePrediction, PredictionStatus } from "@/types/equipment";
import { mockPredictions, mockEquipment } from "@/data/mockData";
import { formatCurrency, getDaysUntil, formatPercentage } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PredictiveAlertsProps {
  maxAlerts?: number;
  showActions?: boolean;
}

export const PredictiveAlerts = ({ maxAlerts = 5, showActions = true }: PredictiveAlertsProps) => {
  const navigate = useNavigate();

  const sortedPredictions = useMemo(() => {
    return [...mockPredictions]
      .filter(p => p.predictionStatus === PredictionStatus.ACTIVE)
      .sort((a, b) => b.failureProbability - a.failureProbability)
      .slice(0, maxAlerts);
  }, [maxAlerts]);

  const getEquipmentName = (equipmentId: string) => {
    const eq = mockEquipment.find(e => e.id === equipmentId);
    return eq?.name || equipmentId;
  };

  const getPriorityColor = (probability: number) => {
    if (probability >= 0.8) return "destructive";
    if (probability >= 0.6) return "default";
    return "secondary";
  };

  const getPriorityBg = (probability: number) => {
    if (probability >= 0.8) return "bg-destructive/10 border-destructive/30";
    if (probability >= 0.6) return "bg-warning/10 border-warning/30";
    return "bg-secondary/50 border-border";
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-warning" />
          Predictive Alerts
        </CardTitle>
        <Badge variant="outline">{sortedPredictions.length} Active</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className={cn(
              "p-3 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer",
              getPriorityBg(prediction.failureProbability)
            )}
            onClick={() => navigate(`/equipment/${prediction.equipmentId}`)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  prediction.failureProbability >= 0.8 ? "text-destructive" : "text-warning"
                )} />
                <span className="font-medium text-sm">
                  {getEquipmentName(prediction.equipmentId)}
                </span>
              </div>
              <Badge variant={getPriorityColor(prediction.failureProbability)}>
                {formatPercentage(prediction.failureProbability)} Risk
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {prediction.expectedFailureMode.replace(/_/g, ' ')} predicted in {getDaysUntil(prediction.expectedFailureDate)} days
            </p>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Est. Cost: {formatCurrency(prediction.estimatedCost)}
              </span>
              <div className="flex items-center gap-2">
                {prediction.isAcknowledged ? (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle className="w-3 h-3" />
                    Acknowledged
                  </span>
                ) : (
                  <span className="text-warning">Pending Review</span>
                )}
              </div>
            </div>

            {showActions && prediction.topContributingFactors.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Top Factors:</p>
                <div className="flex flex-wrap gap-1">
                  {prediction.topContributingFactors.slice(0, 2).map((factor, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {factor.factor}: {formatPercentage(factor.importance)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {sortedPredictions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success" />
            <p>No active alerts</p>
          </div>
        )}

        <Button 
          variant="ghost" 
          className="w-full mt-2" 
          onClick={() => navigate('/alerts')}
        >
          View All Alerts
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
