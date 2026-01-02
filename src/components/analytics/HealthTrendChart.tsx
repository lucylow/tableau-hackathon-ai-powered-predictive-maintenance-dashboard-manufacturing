import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { mockEquipment, generateSensorReadings } from "@/data/mockData";
import { formatDate, formatPercentage } from "@/utils/formatters";

interface HealthTrendChartProps {
  equipmentIds?: string[];
  timeRange?: "1h" | "24h" | "7d" | "30d";
}

export const HealthTrendChart = ({ 
  equipmentIds = mockEquipment.slice(0, 3).map(e => e.id),
  timeRange = "24h" 
}: HealthTrendChartProps) => {
  const [selectedRange, setSelectedRange] = useState(timeRange);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock health trend data
    const points = selectedRange === "1h" ? 12 : selectedRange === "24h" ? 24 : selectedRange === "7d" ? 7 : 30;
    const now = Date.now();
    const interval = selectedRange === "1h" ? 5 * 60 * 1000 : 
                     selectedRange === "24h" ? 60 * 60 * 1000 :
                     selectedRange === "7d" ? 24 * 60 * 60 * 1000 :
                     24 * 60 * 60 * 1000;

    const chartData = Array.from({ length: points }, (_, i) => {
      const timestamp = new Date(now - (points - 1 - i) * interval);
      const dataPoint: any = {
        time: timestamp,
        label: selectedRange === "1h" || selectedRange === "24h" 
          ? formatDate(timestamp, "time")
          : formatDate(timestamp, "short"),
      };

      equipmentIds.forEach((id, idx) => {
        const equipment = mockEquipment.find(e => e.id === id);
        if (equipment) {
          // Simulate health trend with some variation
          const baseHealth = equipment.currentHealthScore;
          const variation = Math.sin(i / 3) * 0.05 + (Math.random() - 0.5) * 0.03;
          dataPoint[equipment.name] = Math.max(0.1, Math.min(1, baseHealth + variation + (points - i) * 0.002));
        }
      });

      return dataPoint;
    });

    setData(chartData);
  }, [selectedRange, equipmentIds]);

  const colors = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444"];

  const getTrend = (name: string) => {
    if (data.length < 2) return "stable";
    const firstValue = data[0][name] || 0;
    const lastValue = data[data.length - 1][name] || 0;
    const diff = lastValue - firstValue;
    if (diff > 0.02) return "up";
    if (diff < -0.02) return "down";
    return "stable";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-medium">Health Trends</span>
        </div>
        <Tabs value={selectedRange} onValueChange={(v) => setSelectedRange(v as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="1h" className="text-xs px-2">1H</TabsTrigger>
            <TabsTrigger value="24h" className="text-xs px-2">24H</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-2">7D</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-2">30D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {equipmentIds.map((id, idx) => {
                const equipment = mockEquipment.find(e => e.id === id);
                return (
                  <linearGradient key={id} id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              domain={[0, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
            />
            <Legend />
            {equipmentIds.map((id, idx) => {
              const equipment = mockEquipment.find(e => e.id === id);
              if (!equipment) return null;
              return (
                <Area
                  key={id}
                  type="monotone"
                  dataKey={equipment.name}
                  stroke={colors[idx % colors.length]}
                  fill={`url(#gradient-${id})`}
                  strokeWidth={2}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Indicators */}
      <div className="flex flex-wrap gap-2 mt-4">
        {equipmentIds.map((id, idx) => {
          const equipment = mockEquipment.find(e => e.id === id);
          if (!equipment) return null;
          const trend = getTrend(equipment.name);
          return (
            <Badge 
              key={id} 
              variant="outline" 
              className="flex items-center gap-1"
              style={{ borderColor: colors[idx % colors.length] }}
            >
              {trend === "up" && <TrendingUp className="w-3 h-3 text-success" />}
              {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
              {trend === "stable" && <Minus className="w-3 h-3 text-muted-foreground" />}
              <span className="text-xs">{equipment.name}</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
