import { EquipmentStatus } from "@/types/equipment";

export const formatDate = (date: Date, format: 'full' | 'short' | 'time' = 'full'): string => {
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

export const getHealthColor = (score: number): string => {
  if (score >= 0.8) return 'hsl(var(--success))';
  if (score >= 0.6) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};

export const getHealthLabel = (score: number): string => {
  if (score >= 0.8) return 'Healthy';
  if (score >= 0.6) return 'Warning';
  return 'Critical';
};

export const getStatusColor = (status: EquipmentStatus): string => {
  switch (status) {
    case EquipmentStatus.OPERATIONAL:
      return 'hsl(var(--success))';
    case EquipmentStatus.DEGRADED:
      return 'hsl(var(--warning))';
    case EquipmentStatus.MAINTENANCE:
      return 'hsl(var(--primary))';
    case EquipmentStatus.FAILED:
      return 'hsl(var(--destructive))';
    case EquipmentStatus.IDLE:
      return 'hsl(var(--muted-foreground))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

export const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
