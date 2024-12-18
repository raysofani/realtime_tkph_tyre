import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimingData } from "@/types/types";
import { Calculator, Clock, TrendingUp, Truck } from "lucide-react";

interface GridSectionProps {
  timingData: TimingData;
  tkph: string | number;
  totalElapsedTime: number;
  // lastCycleTKPH: number;
  averageSpeed: string | number;
}

export function GridSection({
  timingData,
  tkph,
  totalElapsedTime,
  averageSpeed
}: GridSectionProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Loaded Dumper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1 text-amber-900">
                Loaded Travel Time
              </h3>
              <p className="text-amber-800">{timingData.loadingTime} seconds</p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-amber-900">
                Loaded Travelled Distance
              </h3>
              <p className="text-amber-800">
                {timingData.loadingDistance.toFixed(2)} meters
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
          <CardHeader>
            <CardTitle className="text-sky-700 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Empty Dumper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1 text-sky-900">
                Empty Travel Time
              </h3>
              <p className="text-sky-800">{timingData.unloadingTime} seconds</p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-sky-900">
                Empty Travelled Distance
              </h3>
              <p className="text-sky-800">
                {timingData.unloadingDistance.toFixed(2)} meters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
          <CardHeader>
            <CardTitle className="text-sm text-rose-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Time Elapsed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-800 font-semibold">
              {totalElapsedTime} seconds
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
          <CardHeader>
            <CardTitle className="text-sm text-violet-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Average Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-violet-800 font-semibold">{averageSpeed} km/h</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              TKPH Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-xs text-emerald-600">Current</span>
              <p className="text-xl font-bold text-emerald-800">{tkph}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
