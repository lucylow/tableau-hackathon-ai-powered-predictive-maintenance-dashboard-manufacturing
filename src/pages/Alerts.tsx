import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PredictiveAlerts } from "@/components/dashboard/PredictiveAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Bell, AlertTriangle, CheckCircle, Clock, Search, Filter, BellOff } from "lucide-react";
import { mockPredictions, mockEquipment } from "@/data/mockData";
import { PredictionStatus } from "@/types/equipment";
import { formatCurrency, formatPercentage, getDaysUntil, formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const AlertsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const activeAlerts = mockPredictions.filter(p => p.predictionStatus === PredictionStatus.ACTIVE);
  const acknowledgedAlerts = activeAlerts.filter(p => p.isAcknowledged);
  const pendingAlerts = activeAlerts.filter(p => !p.isAcknowledged);
  const highRiskAlerts = activeAlerts.filter(p => p.failureProbability >= 0.7);

  const getEquipmentName = (id: string) => mockEquipment.find(e => e.id === id)?.name || id;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Predictions</h1>
            <p className="text-muted-foreground">Monitor AI-powered failure predictions and alerts</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {highRiskAlerts.length} High Risk
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {pendingAlerts.length} Pending
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Alerts", value: activeAlerts.length, icon: Bell, color: "text-warning" },
            { label: "High Risk", value: highRiskAlerts.length, icon: AlertTriangle, color: "text-destructive" },
            { label: "Acknowledged", value: acknowledgedAlerts.length, icon: CheckCircle, color: "text-success" },
            { label: "Pending Review", value: pendingAlerts.length, icon: Clock, color: "text-primary" },
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

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Alerts List */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingAlerts.length})</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {activeAlerts.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <BellOff className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">All systems are operating within normal parameters.</p>
                </CardContent>
              </Card>
            ) : (
              activeAlerts
                .sort((a, b) => b.failureProbability - a.failureProbability)
                .map(alert => (
                  <Card 
                    key={alert.id} 
                    className={cn(
                      "glass-card cursor-pointer transition-all hover:scale-[1.01]",
                      alert.failureProbability >= 0.8 && "border-destructive/50"
                    )}
                    onClick={() => navigate(`/equipment/${alert.equipmentId}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            alert.failureProbability >= 0.8 ? "bg-destructive/20" : "bg-warning/20"
                          )}>
                            <AlertTriangle className={cn(
                              "w-5 h-5",
                              alert.failureProbability >= 0.8 ? "text-destructive" : "text-warning"
                            )} />
                          </div>
                          <div>
                            <p className="font-semibold">{getEquipmentName(alert.equipmentId)}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {alert.expectedFailureMode.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={alert.failureProbability >= 0.8 ? "destructive" : "default"}>
                            {formatPercentage(alert.failureProbability)} Risk
                          </Badge>
                          {alert.isAcknowledged ? (
                            <Badge variant="outline" className="text-success border-success">Acknowledged</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expected Failure</p>
                          <p className="font-medium">{getDaysUntil(new Date(alert.expectedFailureDate))} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Confidence</p>
                          <p className="font-medium">{formatPercentage(alert.confidenceScore)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estimated Cost</p>
                          <p className="font-medium">{formatCurrency(alert.estimatedCost)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Predicted</p>
                          <p className="font-medium">{formatDate(new Date(alert.predictionTime), "short")}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {alert.topContributingFactors.slice(0, 3).map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {factor.factor}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Acknowledge</Button>
                          <Button size="sm">Schedule Maintenance</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AlertsPage;
