import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { SemiCircleChart } from "./SemiCircleChart";

interface SensorCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  gradient: string;
  min?: number;
  max?: number;
  unit?: string;
}

export function SensorCard({
  title,
  value,
  icon,
  gradient,
  min,
  max,
  unit,
}: SensorCardProps) {
  const hasChart = typeof min !== "undefined" && typeof max !== "undefined";

  return (
    <Card className={`${gradient} border-0`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          {hasChart && (
            <span className="text-xs opacity-75">
              {min}-{max}
              {unit}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {hasChart && (
          <SemiCircleChart
            value={Number(value)}
            min={min!}
            max={max!}
            color="rgba(255, 255, 255, 0.8)"
          />
        )}
        <p className="text-3xl font-bold text-white mt-2">
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
