import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Factory, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Activity,
  TrendingUp,
  FileText,
  Settings,
  ExternalLink
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RealTimeMonitor } from "@/components/dashboard/RealTimeMonitor";
import { HealthTrendChart } from "@/components/analytics/HealthTrendChart";
import { mockEquipment, mockPredictions, mockMaintenanceRecords } from "@/data/mockData";
import { formatDate, formatPercentage, formatCurrency, getDaysUntil, getHealthLabel } from "@/utils/formatters";
import { cn } from "@/lib/utils";

const EquipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const equipment = mockEquipment.find(e => e.id === id);
  const predictions = mockPredictions.filter(p => p.equipmentId === id);
  const maintenanceHistory = mockMaintenanceRecords.filter(m => m.equipmentId === id);

  if (!equipment) {
    return (
      <AppLayout>
        <div className="p-6 text-center py-20">
          <Factory className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Equipment Not Found</h2>
          <p className="text-muted-foreground mb-4">The equipment you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/equipment')}>Back to Equipment</Button>
        </div>
      </AppLayout>
    );
  }

  const health = equipment.currentHealthScore;
  const healthColor = health >= 0.8 ? "text-success" : health >= 0.6 ? "text-warning" : "text-destructive";
  const healthBg = health >= 0.8 ? "bg-success" : health >= 0.6 ? "bg-warning" : "bg-destructive";

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{equipment.name}</h1>
                <Badge variant="outline">{equipment.equipmentId}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Factory className="w-4 h-4" />
                  {equipment.factoryId}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {equipment.productionLine}, {equipment.location.zone}
                </span>
                <span className="capitalize">{equipment.type} • {equipment.manufacturer} {equipment.model}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Wrench className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid lg:grid-cols-4 gap-4">
          <Card className={cn("glass-card border-l-4", healthBg.replace("bg-", "border-l-"))}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Health Score</p>
              <div className="flex items-end gap-2">
                <span className={cn("text-4xl font-bold", healthColor)}>
                  {formatPercentage(health)}
                </span>
                <span className={cn("text-sm mb-1", healthColor)}>
                  {getHealthLabel(health)}
                </span>
              </div>
              <Progress value={health * 100} className="mt-3 h-2" indicatorClassName={healthBg} />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Criticality Score</p>
              <p className="text-2xl font-bold">{formatPercentage(equipment.criticalityScore)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {equipment.criticalityScore >= 0.8 ? "High Priority" : equipment.criticalityScore >= 0.5 ? "Medium Priority" : "Low Priority"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Next Maintenance</p>
              <p className="text-2xl font-bold">{getDaysUntil(new Date(equipment.nextScheduledMaintenance))} days</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(new Date(equipment.nextScheduledMaintenance), "short")}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Active Predictions</p>
              <p className="text-2xl font-bold">{predictions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {predictions.filter(p => p.failureProbability >= 0.7).length} high risk
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="monitoring" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity className="w-4 h-4" />
              Real-time Monitoring
            </TabsTrigger>
            <TabsTrigger value="predictions" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance History
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <Settings className="w-4 h-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <RealTimeMonitor equipmentId={equipment.id} />
              <Card className="glass-card">
                <CardContent className="p-4 h-[400px]">
                  <HealthTrendChart equipmentIds={[equipment.id]} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            {predictions.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Predictions</h3>
                  <p className="text-muted-foreground">This equipment has no predicted failures at this time.</p>
                </CardContent>
              </Card>
            ) : (
              predictions.map(prediction => (
                <Card key={prediction.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={cn(
                            "w-5 h-5",
                            prediction.failureProbability >= 0.8 ? "text-destructive" : "text-warning"
                          )} />
                          <span className="font-semibold capitalize">
                            {prediction.expectedFailureMode.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Predicted {getDaysUntil(new Date(prediction.expectedFailureDate))} days from now
                        </p>
                      </div>
                      <Badge variant={prediction.failureProbability >= 0.8 ? "destructive" : "default"}>
                        {formatPercentage(prediction.failureProbability)} Risk
                      </Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="font-medium">{formatPercentage(prediction.confidenceScore)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Cost</p>
                        <p className="font-medium">{formatCurrency(prediction.estimatedCost)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={prediction.isAcknowledged ? "outline" : "secondary"}>
                          {prediction.isAcknowledged ? "Acknowledged" : "Pending Review"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Contributing Factors</p>
                      <div className="space-y-2">
                        {prediction.topContributingFactors.map((factor, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-sm flex-1">{factor.factor}</span>
                            <Progress 
                              value={factor.importance * 100} 
                              className="w-24 h-1.5"
                              indicatorClassName="bg-primary"
                            />
                            <span className="text-xs text-muted-foreground w-10">
                              {formatPercentage(factor.importance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            {maintenanceHistory.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Maintenance History</h3>
                  <p className="text-muted-foreground">No maintenance records found for this equipment.</p>
                </CardContent>
              </Card>
            ) : (
              maintenanceHistory.map(record => (
                <Card key={record.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{record.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(record.startTime))} • {record.technicianName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {record.maintenanceType}
                        </Badge>
                        <Badge variant={record.workOrderStatus === "completed" ? "default" : "secondary"}>
                          {record.workOrderStatus.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                    {record.issuesFound.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">Issues Found:</p>
                        <ul className="text-sm list-disc list-inside">
                          {record.issuesFound.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost: {formatCurrency(record.totalCost)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="details">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Equipment ID", value: equipment.equipmentId },
                    { label: "Type", value: equipment.type },
                    { label: "Manufacturer", value: equipment.manufacturer },
                    { label: "Model", value: equipment.model },
                    { label: "Factory", value: equipment.factoryId },
                    { label: "Production Line", value: equipment.productionLine },
                    { label: "Zone", value: equipment.location.zone },
                    { label: "Installation Date", value: formatDate(new Date(equipment.installationDate), "short") },
                    { label: "Last Maintenance", value: formatDate(new Date(equipment.lastMaintenanceDate), "short") },
                    { label: "Degradation Rate", value: `${(equipment.degradationRate * 100).toFixed(1)}% / month` },
                    { label: "Typical Failure Modes", value: equipment.typicalFailureModes.join(", ").replace(/_/g, " ") },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-medium capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EquipmentDetail;
