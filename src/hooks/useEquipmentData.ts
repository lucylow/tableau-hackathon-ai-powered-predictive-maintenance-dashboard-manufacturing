import { useState, useEffect, useCallback, useRef } from "react";
import { SensorReading, RealTimeUpdate } from "@/types/equipment";
import { mockEquipment, generateSensorReadings } from "@/data/mockData";

// Simulated WebSocket hook for real-time data
export const useEquipmentData = () => {
  const [equipment, setEquipment] = useState(mockEquipment);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev => 
        prev.map(eq => ({
          ...eq,
          currentHealthScore: Math.max(0.1, Math.min(1, eq.currentHealthScore + (Math.random() - 0.52) * 0.02))
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setEquipment(mockEquipment);
      setLoading(false);
    }, 500);
  }, []);

  return { equipment, loading, error, refreshData };
};

export const useSensorData = (equipmentId: string) => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    // Initial data
    setSensorData(generateSensorReadings(equipmentId, 30));
  }, [equipmentId]);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        const newReading: SensorReading = {
          id: `sr-${Date.now()}`,
          equipmentId,
          timestamp: new Date(),
          temperature: 65 + Math.random() * 30,
          vibration: 2 + Math.random() * 4,
          pressure: 100 + Math.random() * 20,
          humidity: 40 + Math.random() * 20,
          powerConsumption: 50 + Math.random() * 30,
          throughput: 80 + Math.random() * 20,
          isAnomaly: Math.random() > 0.9,
          anomalyScore: Math.random() * 0.5,
        };
        return [...prev.slice(-49), newReading];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [equipmentId, isStreaming]);

  return { sensorData, isStreaming, setIsStreaming };
};

export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<RealTimeUpdate[]>([]);

  useEffect(() => {
    const alertMessages = [
      { type: 'alert' as const, equipmentId: 'eq-001', data: { message: 'Temperature threshold exceeded', severity: 'warning' } },
      { type: 'prediction_update' as const, equipmentId: 'eq-002', data: { message: 'Failure probability increased to 62%', severity: 'error' } },
      { type: 'health_update' as const, equipmentId: 'eq-003', data: { message: 'Health score improved', severity: 'success' } },
    ];

    const interval = setInterval(() => {
      const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      setAlerts(prev => [{
        ...randomAlert,
        timestamp: new Date(),
      }, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return alerts;
};
