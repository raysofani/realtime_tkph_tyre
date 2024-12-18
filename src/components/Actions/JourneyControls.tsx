// src/components/Actions/JourneyControls.tsx
import { Button } from "@/components/ui/button";

interface JourneyControlsProps {
  onStartJourney: () => void;
  onHaltCycle: () => void;
  isParkingBrakeOn: boolean;
  isJourneyActive: boolean;
}

export function JourneyControls({
  onStartJourney,
  onHaltCycle,
  isJourneyActive,
}: JourneyControlsProps) {
  return (
    <>
      <div className="flex gap-4">
        <Button
          onClick={onStartJourney}
          disabled={isJourneyActive}
          className={`${
            isJourneyActive ? "bg-gray-400" : "bg-emerald-500"
          } hover:bg-emerald-600`}
        >
          {isJourneyActive ? "Journey In Progress" : "Start Journey"}
        </Button>
        <Button
          onClick={onHaltCycle}
          disabled={!isJourneyActive}
          variant="destructive"
        >
          Reached Destination
        </Button>
      </div>
    </>
  );
}
