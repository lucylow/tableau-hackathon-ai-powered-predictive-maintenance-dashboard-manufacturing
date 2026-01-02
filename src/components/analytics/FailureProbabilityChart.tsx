import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { mockPredictions, mockEquipment } from "@/data/mockData";
import { PredictionStatus } from "@/types/equipment";
import { formatPercentage } from "@/utils/formatters";

interface FailureProbabilityChartProps {
  limit?: number;
}

export const FailureProbabilityChart = ({ limit = 5 }: FailureProbabilityChartProps) => {
  const data = useMemo(() => {
    return mockPredictions
      .filter(p => p.predictionStatus === PredictionStatus.ACTIVE)
      .sort((a, b) => b.failureProbability - a.failureProbability)
      .slice(0, limit)
      .map(prediction => {
        const equipment = mockEquipment.find(e => e.id === prediction.equipmentId);
        return {
          name: equipment?.name?.split(' ').slice(0, 2).join(' ') || prediction.equipmentId,
          probability: prediction.failureProbability * 100,
          confidence: prediction.confidenceScore * 100,
          fullName: equipment?.name || prediction.equipmentId,
        };
      });
  }, [limit]);

  const getBarColor = (probability: number) => {
    if (probability >= 80) return "hsl(var(--destructive))";
    if (probability >= 60) return "hsl(var(--warning))";
    return "hsl(var(--primary))";
  };

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={80}
            tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`,
              name === 'probability' ? 'Failure Probability' : 'Confidence'
            ]}
            labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
          />
          <Bar 
            dataKey="probability" 
            radius={[0, 4, 4, 0]}
            maxBarSize={30}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.probability)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
