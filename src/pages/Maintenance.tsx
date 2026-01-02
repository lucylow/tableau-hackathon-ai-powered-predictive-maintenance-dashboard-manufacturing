import { AppLayout } from "@/components/layout/AppLayout";
import { MaintenanceSchedule } from "@/components/dashboard/MaintenanceSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Wrench, Clock, CheckCircle, User, Plus } from "lucide-react";
import { mockMaintenanceRecords, mockEquipment } from "@/data/mockData";
import { MaintenanceType, WorkOrderStatus } from "@/types/equipment";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

const MaintenancePage = () => {
  const getTypeColor = (type: MaintenanceType) => {
    switch (type) {
      case MaintenanceType.PREDICTIVE: return "bg-primary/20 text-primary";
      case MaintenanceType.PREVENTIVE: return "bg-success/20 text-success";
      case MaintenanceType.CORRECTIVE: return "bg-warning/20 text-warning";
      case MaintenanceType.EMERGENCY: return "bg-destructive/20 text-destructive";
    }
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.SCHEDULED: return <Badge variant="secondary">Scheduled</Badge>;
      case WorkOrderStatus.IN_PROGRESS: return <Badge>In Progress</Badge>;
      case WorkOrderStatus.COMPLETED: return <Badge variant="outline" className="text-success border-success">Completed</Badge>;
      case WorkOrderStatus.CANCELLED: return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const stats = {
    scheduled: mockMaintenanceRecords.filter(m => m.workOrderStatus === WorkOrderStatus.SCHEDULED).length,
    inProgress: mockMaintenanceRecords.filter(m => m.workOrderStatus === WorkOrderStatus.IN_PROGRESS).length,
    completed: mockMaintenanceRecords.filter(m => m.workOrderStatus === WorkOrderStatus.COMPLETED).length,
    totalCost: mockMaintenanceRecords.reduce((sum, m) => sum + m.totalCost, 0),
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Management</h1>
            <p className="text-muted-foreground">Schedule, track, and manage maintenance activities</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Work Order
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Scheduled", value: stats.scheduled, icon: Calendar, color: "text-primary" },
            { label: "In Progress", value: stats.inProgress, icon: Wrench, color: "text-warning" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-success" },
            { label: "Total Cost", value: formatCurrency(stats.totalCost), icon: Clock, color: "text-muted-foreground" },
          ].map((stat, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                </div>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Schedule */}
          <div className="lg:col-span-1">
            <MaintenanceSchedule daysAhead={14} />
          </div>

          {/* Work Orders */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3">
                    {mockMaintenanceRecords.map(record => {
                      const equipment = mockEquipment.find(e => e.id === record.equipmentId);
                      return (
                        <div key={record.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{equipment?.name || record.equipmentId}</p>
                              <p className="text-sm text-muted-foreground">{record.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={cn("text-xs", getTypeColor(record.maintenanceType))}>
                                {record.maintenanceType}
                              </Badge>
                              {getStatusBadge(record.workOrderStatus)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {record.technicianName}
                            </span>
                            <span>{formatDate(new Date(record.startTime), "short")}</span>
                            <span>{formatCurrency(record.totalCost)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MaintenancePage;
