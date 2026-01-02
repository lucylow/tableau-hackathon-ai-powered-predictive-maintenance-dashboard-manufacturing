import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Factory,
  AlertTriangle,
  CheckCircle,
  Download
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HealthTrendChart } from "@/components/analytics/HealthTrendChart";
import { FailureProbabilityChart } from "@/components/analytics/FailureProbabilityChart";
import { mockEquipment, mockPredictions, mockMaintenanceRecords, calculateDashboardStats } from "@/data/mockData";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const stats = calculateDashboardStats(mockEquipment);

  // Mock data for charts
  const healthDistribution = [
    { name: "Healthy", value: stats.healthy, color: "hsl(var(--success))" },
    { name: "Warning", value: stats.warning, color: "hsl(var(--warning))" },
    { name: "Critical", value: stats.critical, color: "hsl(var(--destructive))" },
  ];

  const maintenanceCostData = [
    { month: "Jul", preventive: 12000, predictive: 8000, corrective: 25000 },
    { month: "Aug", preventive: 11000, predictive: 9500, corrective: 18000 },
    { month: "Sep", preventive: 13000, predictive: 7500, corrective: 22000 },
    { month: "Oct", preventive: 10500, predictive: 11000, corrective: 15000 },
    { month: "Nov", preventive: 12500, predictive: 12000, corrective: 12000 },
    { month: "Dec", preventive: 11500, predictive: 14000, corrective: 8000 },
  ];

  const downtimeData = [
    { month: "Jul", actual: 48, predicted: 72, saved: 24 },
    { month: "Aug", actual: 36, predicted: 60, saved: 24 },
    { month: "Sep", actual: 42, predicted: 68, saved: 26 },
    { month: "Oct", actual: 30, predicted: 55, saved: 25 },
    { month: "Nov", actual: 24, predicted: 52, saved: 28 },
    { month: "Dec", actual: 18, predicted: 48, saved: 30 },
  ];

  const predictionAccuracy = [
    { week: "W1", accuracy: 88 },
    { week: "W2", accuracy: 91 },
    { week: "W3", accuracy: 85 },
    { week: "W4", accuracy: 93 },
    { week: "W5", accuracy: 95 },
    { week: "W6", accuracy: 92 },
    { week: "W7", accuracy: 94 },
    { week: "W8", accuracy: 96 },
  ];

  const equipmentByType = mockEquipment.reduce((acc, eq) => {
    acc[eq.type] = (acc[eq.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(equipmentByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#64748b"];

  const kpiCards = [
    { 
      label: "Average Health Score", 
      value: formatPercentage(stats.avgHealth), 
      change: "+2.3%",
      trend: "up",
      icon: TrendingUp 
    },
    { 
      label: "Predicted Savings", 
      value: formatCurrency(157000), 
      change: "+18%",
      trend: "up",
      icon: DollarSign 
    },
    { 
      label: "Downtime Prevented", 
      value: "157 hrs", 
      change: "-32%",
      trend: "down",
      icon: Clock 
    },
    { 
      label: "Prediction Accuracy", 
      value: "94.2%", 
      change: "+1.5%",
      trend: "up",
      icon: CheckCircle 
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    <Badge 
                      variant={kpi.trend === "up" ? "default" : "secondary"}
                      className="mt-2"
                    >
                      {kpi.change} vs last period
                    </Badge>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Health Distribution */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Factory className="w-5 h-5" />
                Equipment Health Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Accuracy Trend */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                ML Prediction Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictionAccuracy}>
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Accuracy']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#accuracyGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Cost Comparison */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Maintenance Cost by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend />
                    <Bar dataKey="preventive" name="Preventive" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predictive" name="Predictive" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="corrective" name="Corrective" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Downtime Analysis */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Downtime Analysis (Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={downtimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="actual" name="Actual Downtime" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saved" name="Hours Saved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Charts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Equipment Health Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <HealthTrendChart equipmentIds={mockEquipment.slice(0, 4).map(e => e.id)} />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Failure Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <FailureProbabilityChart limit={8} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
