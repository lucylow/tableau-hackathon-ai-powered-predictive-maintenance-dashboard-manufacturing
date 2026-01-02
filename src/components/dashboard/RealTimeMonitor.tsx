import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Thermometer, 
  Activity, 
  Gauge, 
  Droplets, 
  Zap, 
  Play, 
  Pause, 
  AlertTriangle 
} from "lucide-react";
import { useSensorData } from "@/hooks/useEquipmentData";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface RealTimeMonitorProps {
  equipmentId: string;
  compact?: boolean;
}

export const RealTimeMonitor = ({ equipmentId, compact = false }: RealTimeMonitorProps) => {
  const { sensorData, isStreaming, setIsStreaming } = useSensorData(equipmentId);
  const [selectedMetric, setSelectedMetric] = useState<"temperature" | "vibration" | "pressure" | "power">("temperature");

  const metrics = [
    { key: "temperature", label: "Temp", icon: Thermometer, unit: "°C", threshold: 85, color: "#ef4444" },
    { key: "vibration", label: "Vibration", icon: Activity, unit: "mm/s", threshold: 5, color: "#f59e0b" },
    { key: "pressure", label: "Pressure", icon: Gauge, unit: "PSI", threshold: 115, color: "#0ea5e9" },
    { key: "power", label: "Power", icon: Zap, unit: "kW", threshold: 75, color: "#a855f7" },
  ];

  const currentMetric = metrics.find(m => m.key === selectedMetric)!;
  const latestReading = sensorData[sensorData.length - 1];
  
  const getCurrentValue = () => {
    if (!latestReading) return 0;
    switch (selectedMetric) {
      case "temperature": return latestReading.temperature;
      case "vibration": return latestReading.vibration;
      case "pressure": return latestReading.pressure;
      case "power": return latestReading.powerConsumption;
      default: return 0;
    }
  };

  const isAboveThreshold = getCurrentValue() > currentMetric.threshold;

  const chartData = sensorData.slice(-30).map(reading => ({
    time: formatDate(new Date(reading.timestamp), "time"),
    value: selectedMetric === "temperature" ? reading.temperature :
           selectedMetric === "vibration" ? reading.vibration :
           selectedMetric === "pressure" ? reading.pressure :
           reading.powerConsumption,
    anomaly: reading.isAnomaly,
  }));

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Real-time Sensors</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {metrics.map(metric => {
            const value = latestReading ? 
              metric.key === "temperature" ? latestReading.temperature :
              metric.key === "vibration" ? latestReading.vibration :
              metric.key === "pressure" ? latestReading.pressure :
              latestReading.powerConsumption : 0;
            const isHigh = value > metric.threshold;
            return (
              <div 
                key={metric.key}
                className={cn(
                  "p-2 rounded-lg border transition-all",
                  isHigh ? "border-destructive/50 bg-destructive/10" : "border-border bg-secondary/30"
                )}
              >
                <div className="flex items-center gap-1 mb-1">
                  <metric.icon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {isHigh && <AlertTriangle className="w-3 h-3 text-destructive ml-auto" />}
                </div>
                <p className={cn(
                  "text-lg font-bold",
                  isHigh ? "text-destructive" : "text-foreground"
                )}>
                  {value.toFixed(1)}<span className="text-xs font-normal ml-0.5">{metric.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Real-time Sensor Data
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isStreaming ? "default" : "secondary"} className="gap-1">
            <span className={cn("w-2 h-2 rounded-full", isStreaming ? "bg-success animate-pulse" : "bg-muted-foreground")} />
            {isStreaming ? "Live" : "Paused"}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Metric Selector */}
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as any)} className="mb-4">
          <TabsList className="grid grid-cols-4 w-full">
            {metrics.map(metric => (
              <TabsTrigger key={metric.key} value={metric.key} className="text-xs">
                <metric.icon className="w-4 h-4 mr-1" />
                {metric.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Current Value Display */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-secondary/30">
          <div>
            <p className="text-sm text-muted-foreground">Current {currentMetric.label}</p>
            <p className={cn(
              "text-3xl font-bold",
              isAboveThreshold ? "text-destructive" : "text-foreground"
            )}>
              {getCurrentValue().toFixed(1)}
              <span className="text-sm font-normal ml-1">{currentMetric.unit}</span>
            </p>
          </div>
          {isAboveThreshold && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              Above Threshold
            </Badge>
          )}
        </div>

        {/* Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <ReferenceLine 
                y={currentMetric.threshold} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5"
                label={{ value: "Threshold", fontSize: 10, fill: "hsl(var(--destructive))" }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={currentMetric.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: currentMetric.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Count */}
        {sensorData.filter(s => s.isAnomaly).length > 0 && (
          <div className="mt-4 p-2 rounded-lg bg-warning/10 border border-warning/30">
            <p className="text-sm text-warning flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {sensorData.filter(s => s.isAnomaly).length} anomalies detected in recent readings
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
