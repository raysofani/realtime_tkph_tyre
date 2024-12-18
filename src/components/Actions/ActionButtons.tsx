import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onToggleParkingBrake: () => void;
  onHaltCycle: () => void;
}

export function ActionButtons({ onToggleParkingBrake, onHaltCycle }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4 my-6">
      <Button onClick={onToggleParkingBrake}>
        Toggle Parking Brake
      </Button>
      <Button onClick={onHaltCycle}>
        Reached Destination
      </Button>
    </div>
  )
}