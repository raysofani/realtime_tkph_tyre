import { Cell, Pie, PieChart } from "recharts";

interface SemiCircleChartProps {
  value: number;
  min: number;
  max: number;
  color: string;
}

export function SemiCircleChart({
  value,
  min,
  max,
  color,
}: SemiCircleChartProps) {
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  const data = [{ value: percentage }, { value: 100 - percentage }];

  return (
    <PieChart width={100} height={60}>
      <Pie
        data={data}
        cx={50}
        cy={50}
        startAngle={180}
        endAngle={0}
        innerRadius={30}
        outerRadius={40}
        paddingAngle={0}
        dataKey="value"
      >
        <Cell fill={color} />
        <Cell fill="rgba(255, 255, 255, 0.2)" />
      </Pie>
    </PieChart>
  );
}
