import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  RefreshCw, 
  Factory, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Activity,
  Wifi,
  WifiOff
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EquipmentHealthCard } from "@/components/dashboard/EquipmentHealthCard";
import { PredictiveAlerts } from "@/components/dashboard/PredictiveAlerts";
import { MaintenanceSchedule } from "@/components/dashboard/MaintenanceSchedule";
import { HealthTrendChart } from "@/components/analytics/HealthTrendChart";
import { FailureProbabilityChart } from "@/components/analytics/FailureProbabilityChart";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { calculateDashboardStats } from "@/data/mockData";
import { formatCurrency, formatPercentage, formatDate } from "@/utils/formatters";
import { useState } from "react";

const Dashboard = () => {
  const { equipment, loading, refreshData } = useEquipmentData();
  const [isConnected, setIsConnected] = useState(true);
  const stats = calculateDashboardStats(equipment);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.05);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      label: "Total Equipment",
      value: stats.total.toString(),
      icon: Factory,
      subtext: `Across 2 factories`,
      color: "text-primary",
    },
    {
      label: "Average Health",
      value: formatPercentage(stats.avgHealth),
      icon: TrendingUp,
      subtext: `${stats.healthy} healthy`,
      color: stats.avgHealth >= 0.8 ? "text-success" : stats.avgHealth >= 0.6 ? "text-warning" : "text-destructive",
    },
    {
      label: "Active Alerts",
      value: stats.critical.toString(),
      icon: AlertTriangle,
      subtext: `${stats.warning} warnings`,
      color: "text-warning",
    },
    {
      label: "Est. Savings",
      value: formatCurrency(45000),
      icon: DollarSign,
      subtext: "Monthly potential",
      color: "text-success",
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Predictive Maintenance Dashboard</h1>
            <p className="text-muted-foreground">
              Last updated: {formatDate(new Date())}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="gap-1.5"
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? "Real-time Connected" : "Disconnected"}
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Status Banner */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {[
                  { label: "IoT Data", status: "active" },
                  { label: "ML Predictions", status: "running" },
                  { label: "Salesforce Sync", status: "connected" },
                  { label: "Slack Alerts", status: "enabled" },
                ].map((system, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm">{system.label}</span>
                    <Badge variant="secondary" className="text-xs">{system.status}</Badge>
                  </div>
                ))}
              </div>
              <Badge variant="outline" className="gap-1">
                <Activity className="w-3 h-3" />
                10,245 sensors/sec
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Equipment & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment Grid */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Equipment Health Overview</h2>
                  <Badge variant="outline">{equipment.length} units</Badge>
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {equipment
                    .sort((a, b) => a.currentHealthScore - b.currentHealthScore)
                    .map((eq) => (
                      <EquipmentHealthCard key={eq.id} equipment={eq} />
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Trend Chart */}
            <Card className="glass-card">
              <CardContent className="p-4 h-[350px]">
                <HealthTrendChart 
                  equipmentIds={equipment.slice(0, 3).map(e => e.id)}
                />
              </CardContent>
            </Card>

            {/* Failure Probability */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Top Failure Predictions</h3>
                <div className="h-[200px]">
                  <FailureProbabilityChart limit={5} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts & Schedule */}
          <div className="space-y-6">
            <PredictiveAlerts maxAlerts={5} />
            <MaintenanceSchedule daysAhead={7} />
          </div>
        </div>

        {/* Critical Alert Banner */}
        {stats.critical > 0 && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">
                    {stats.critical} equipment in critical condition!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Immediate maintenance required to prevent failures.
                  </p>
                </div>
              </div>
              <Button variant="destructive">View All Alerts</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
