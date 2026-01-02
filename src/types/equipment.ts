// Equipment Types
export interface Equipment {
  id: string;
  equipmentId: string;
  name: string;
  type: EquipmentType;
  manufacturer: string;
  model: string;
  factoryId: string;
  productionLine: string;
  location: { x: number; y: number; zone: string };
  installationDate: Date;
  criticalityScore: number;
  status: EquipmentStatus;
  currentHealthScore: number;
  lastMaintenanceDate: Date;
  nextScheduledMaintenance: Date;
  degradationRate: number;
  typicalFailureModes: string[];
  salesforceAssetId?: string;
}

export interface SensorReading {
  id: string;
  equipmentId: string;
  timestamp: Date;
  temperature: number;
  vibration: number;
  pressure: number;
  humidity: number;
  powerConsumption: number;
  throughput: number;
  isAnomaly: boolean;
  anomalyScore: number;
}

export interface FailurePrediction {
  id: string;
  equipmentId: string;
  predictionTime: Date;
  failureProbability: number;
  confidenceScore: number;
  predictionHorizonDays: number;
  expectedFailureDate: Date;
  expectedFailureMode: FailureMode;
  estimatedCost: number;
  topContributingFactors: FactorContribution[];
  predictionStatus: PredictionStatus;
  isAcknowledged: boolean;
  alertSent: boolean;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  startTime: Date;
  endTime?: Date;
  maintenanceType: MaintenanceType;
  description: string;
  technicianName: string;
  totalCost: number;
  workOrderStatus: WorkOrderStatus;
  issuesFound: string[];
}

export interface FactorContribution {
  factor: string;
  importance: number;
  currentValue: number;
  contribution: number;
}

export interface RealTimeUpdate {
  type: 'sensor_reading' | 'health_update' | 'prediction_update' | 'alert';
  equipmentId: string;
  data: any;
  timestamp: Date;
}

// Enums
export enum EquipmentType {
  PUMP = 'pump',
  MOTOR = 'motor',
  COMPRESSOR = 'compressor',
  CONVEYOR = 'conveyor',
  MIXER = 'mixer',
  REACTOR = 'reactor',
  SEPARATOR = 'separator'
}

export enum EquipmentStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  FAILED = 'failed',
  IDLE = 'idle',
  DEGRADED = 'degraded'
}

export enum FailureMode {
  BEARING_FAILURE = 'bearing_failure',
  MOTOR_FAILURE = 'motor_failure',
  SEAL_FAILURE = 'seal_failure',
  ELECTRICAL_FAILURE = 'electrical_failure',
  SENSOR_FAILURE = 'sensor_failure',
  HYDRAULIC_FAILURE = 'hydraulic_failure',
  UNKNOWN = 'unknown'
}

export enum PredictionStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  EXPIRED = 'expired',
  FALSE_ALARM = 'false_alarm'
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
  EMERGENCY = 'emergency'
}

export enum WorkOrderStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum AlertChannel {
  SLACK = 'slack',
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app'
}
