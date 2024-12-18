export interface SensorData {
  pressure: number | null;
  temperature: number | null;
  load: number | null;
  wheel_rotations: number | string | null;
  parking_brake: boolean;
}

export interface TimingData {
  loadingTime: number;
  unloadingTime: number;
  loadingDistance: number;
  unloadingDistance: number;
  totalElapsedTime: number;
}
