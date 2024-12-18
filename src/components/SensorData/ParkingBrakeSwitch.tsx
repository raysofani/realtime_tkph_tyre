import { Switch } from "@/components/ui/switch";

interface ParkingBrakeSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

export function ParkingBrakeSwitch({
  isOn,
  onToggle,
}: ParkingBrakeSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center gap-2">
        <Switch id="parking-brake" checked={isOn} onCheckedChange={onToggle} />
        <span className="text-sm font-semibold text-black">
          Parking Brake: {isOn ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}
