import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, User, ChevronRight, Clock } from "lucide-react";
import { mockMaintenanceRecords, mockEquipment } from "@/data/mockData";
import { MaintenanceType, WorkOrderStatus } from "@/types/equipment";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface MaintenanceScheduleProps {
  daysAhead?: number;
}

export const MaintenanceSchedule = ({ daysAhead = 7 }: MaintenanceScheduleProps) => {
  const navigate = useNavigate();

  const upcomingMaintenance = useMemo(() => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    
    return mockEquipment
      .filter(eq => {
        const nextMaint = new Date(eq.nextScheduledMaintenance);
        return nextMaint >= now && nextMaint <= futureDate;
      })
      .sort((a, b) => 
        new Date(a.nextScheduledMaintenance).getTime() - new Date(b.nextScheduledMaintenance).getTime()
      )
      .slice(0, 5);
  }, [daysAhead]);

  const recentRecords = mockMaintenanceRecords
    .filter(r => r.workOrderStatus === WorkOrderStatus.IN_PROGRESS || r.workOrderStatus === WorkOrderStatus.SCHEDULED)
    .slice(0, 3);

  const getTypeColor = (type: MaintenanceType) => {
    switch (type) {
      case MaintenanceType.PREDICTIVE:
        return "bg-primary/20 text-primary";
      case MaintenanceType.PREVENTIVE:
        return "bg-success/20 text-success";
      case MaintenanceType.CORRECTIVE:
        return "bg-warning/20 text-warning";
      case MaintenanceType.EMERGENCY:
        return "bg-destructive/20 text-destructive";
    }
  };

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.SCHEDULED:
        return "secondary";
      case WorkOrderStatus.IN_PROGRESS:
        return "default";
      case WorkOrderStatus.COMPLETED:
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Maintenance Schedule
        </CardTitle>
        <Badge variant="outline">{upcomingMaintenance.length + recentRecords.length} Items</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* In Progress / Scheduled Work Orders */}
        {recentRecords.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">ACTIVE WORK ORDERS</p>
            <div className="space-y-2">
              {recentRecords.map((record) => {
                const equipment = mockEquipment.find(e => e.id === record.equipmentId);
                return (
                  <div
                    key={record.id}
                    className="p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-all cursor-pointer"
                    onClick={() => navigate(`/maintenance/${record.id}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{equipment?.name || record.equipmentId}</span>
                      <Badge variant={getStatusColor(record.workOrderStatus)} className="text-xs">
                        {record.workOrderStatus.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{record.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {record.technicianName}
                      </span>
                      <Badge className={cn("text-xs", getTypeColor(record.maintenanceType))}>
                        {record.maintenanceType}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Scheduled */}
        {upcomingMaintenance.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">UPCOMING ({daysAhead} DAYS)</p>
            <div className="space-y-2">
              {upcomingMaintenance.map((equipment) => {
                const daysUntil = Math.ceil(
                  (new Date(equipment.nextScheduledMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={equipment.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/equipment/${equipment.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{equipment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(equipment.nextScheduledMaintenance), 'short')}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={daysUntil <= 2 ? "destructive" : daysUntil <= 5 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {daysUntil}d
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {upcomingMaintenance.length === 0 && recentRecords.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scheduled maintenance</p>
          </div>
        )}

        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={() => navigate('/maintenance')}
        >
          View Full Schedule
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
