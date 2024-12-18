import { SensorData } from "@/types/types";
import { Gauge, RotateCw, Thermometer, Weight } from "lucide-react";
import { SensorCard } from "./SensorCard";

interface SensorDataGridProps {
  data?: SensorData;
}

export function SensorDataGrid({ data }: SensorDataGridProps) {
  const sensorConfig = [
    {
      title: "Pressure",
      value: data?.pressure ?? 0,
      icon: <Gauge className="h-4 w-4" />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      min: 0,
      max: 1000,
      unit: "Pa",
    },
    {
      title: "Temperature",
      value: data?.temperature ?? 0,
      icon: <Thermometer className="h-4 w-4" />,
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      min: 0,
      max: 60,
      unit: "°C",
    },
    {
      title: "Load",
      value: data?.load ?? 0,
      icon: <Weight className="h-4 w-4" />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      min: 0,
      max: 200,
      unit: "gm",
    },
    {
      title: "Wheel Rotations",
      value: data?.wheel_rotations ?? "N/A",
      icon: <RotateCw className="h-4 w-4" />,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {sensorConfig.map((sensor) => (
        <SensorCard
          key={sensor.title}
          title={sensor.title}
          value={sensor.value}
          icon={sensor.icon}
          gradient={sensor.gradient}
          min={sensor.min}
          max={sensor.max}
          unit={sensor.unit}
        />
      ))}
    </div>
  );
}
