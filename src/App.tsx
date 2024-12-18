import { onValue } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import { JourneyControls } from "./components/Actions/JourneyControls";
import { GridSection } from "./components/GridSection/GridSection";
import { ParkingBrakeSwitch } from "./components/SensorData/ParkingBrakeSwitch";
import { SensorDataGrid } from "./components/SensorData/SensorDataGrid";
import { CONSTANTS } from "./constants/config";
import { toggleParkingBrake, updateTKPH, userRef } from "./services/firebase";
import { SensorData, TimingData } from "./types/types";
import { calculateTKPH } from "./utils/calculations";

function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    pressure: null,
    temperature: null,
    load: null,
    wheel_rotations: null,
    parking_brake: true, // This will be updated from Firebase
  });

  const [timingData, setTimingData] = useState<TimingData>({
    loadingTime: 0,
    unloadingTime: 0,
    loadingDistance: 0,
    unloadingDistance: 0,
    totalElapsedTime: 0,
  });

  const [tkph, setTkph] = useState<string>("N/A");
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [averageSpeed, setAverageSpeed] = useState<string>("N/A");

  const [storedLoad, setStoredLoad] = useState<number>(0);
  // const [lastCycleTKPH, setLastCycleTKPH] = useState<number>(0);

  // Reference values for calculations and timing
  const cycleStartTimeRef = useRef<number | null>(null);
  const cycleActiveRef = useRef<boolean>(false);
  const previousRotationsRef = useRef(0);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const isActive = useRef(false);

  // Keep track of the last parking brake state from Firebase
  const lastFirebaseParkingBrakeState = useRef<boolean>(false);

  // Calculate distance based on wheel rotations
  const calculateDistance = useCallback(
    (currentRotations: number, previousRotations: number): number => {
      // Calculate the actual number of new rotations
      const newRotations = currentRotations - previousRotations;

      // Ensure we're using the absolute value of rotations and multiply by circumference
      // Each rotation represents one complete turn of the wheel (2 meters circumference)
      const distance = Math.abs(newRotations) * CONSTANTS.WHEEL_CIRCUMFERENCE;

      console.log("Distance calculation:", {
        currentRotations,
        previousRotations,
        newRotations,
        distance,
        wheelCircumference: CONSTANTS.WHEEL_CIRCUMFERENCE,
      });

      return distance;
    },
    []
  );
  // Update timer and distance calculations
  const updateTimerAndDistance = useCallback(() => {
    const currentTime = Date.now();

    // Only update if journey is active
    if (isJourneyActive && cycleStartTimeRef.current) {
      setTimingData((prev) => {
        const totalElapsed = Math.floor(
          (currentTime - cycleStartTimeRef.current!) / 1000
        );

        // Update loading/unloading times only if parking brake is off
        if (
          !sensorData.parking_brake &&
          typeof sensorData.wheel_rotations === "number"
        ) {
          const timeDiff = (currentTime - lastUpdateTimeRef.current) / 1000;
          const currentRotations = sensorData.wheel_rotations;

          // Calculate distance based on actual wheel rotations
          const distance = calculateDistance(
            currentRotations,
            previousRotationsRef.current
          );

          // Log the values for debugging
          console.log("Updating distances:", {
            currentRotations,
            previousRotations: previousRotationsRef.current,
            calculatedDistance: distance,
            isLoading: (sensorData.load || 0) > CONSTANTS.LOAD_THRESHOLD,
          });

          const isLoading = (sensorData.load || 0) > CONSTANTS.LOAD_THRESHOLD;

          // Store current rotations for next calculation
          previousRotationsRef.current = currentRotations;

          return {
            ...prev,
            loadingTime: isLoading
              ? prev.loadingTime + timeDiff
              : prev.loadingTime,
            unloadingTime: !isLoading
              ? prev.unloadingTime + timeDiff
              : prev.unloadingTime,
            loadingDistance: isLoading
              ? prev.loadingDistance + distance
              : prev.loadingDistance,
            unloadingDistance: !isLoading
              ? prev.unloadingDistance + distance
              : prev.unloadingDistance,
            totalElapsedTime: totalElapsed,
          };
        }

        return {
          ...prev,
          totalElapsedTime: totalElapsed,
        };
      });
    }

    lastUpdateTimeRef.current = currentTime;
  }, [
    sensorData.wheel_rotations,
    sensorData.load,
    sensorData.parking_brake,
    calculateDistance,
    isJourneyActive,
  ]);

  // Effect for UI updates
  useEffect(() => {
    const updateInterval = setInterval(updateTimerAndDistance, 500);
    return () => clearInterval(updateInterval);
  }, [updateTimerAndDistance]);

  // Effect for Firebase data polling
  useEffect(() => {
    console.log("Setting up Firebase polling");

    const pollInterval = setInterval(() => {
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSensorData(data);
          if (data.load && data.load > 0) {
            setStoredLoad(data.load);
          }
          // setLastCycleTKPH(data.tkph || 0);
          // Check if parking brake state has changed in Firebase
          if (data.parking_brake !== lastFirebaseParkingBrakeState.current) {
            console.log(
              "Parking brake state changed in Firebase:",
              data.parking_brake
            );
            lastFirebaseParkingBrakeState.current = data.parking_brake;
            isActive.current = !data.parking_brake;
          }

          setSensorData(data);

          // Update TKPH calculations if the system is active
          // if (!data.parking_brake && typeof data.wheel_rotations === 'number') {
          //   const speed = calculateDistance(data.wheel_rotations, previousRotationsRef.current) * 7.2;
          //   const tonnage = (data.load || 0) / 1000;
          //   setTkph((speed * tonnage).toFixed(2));
          // }
        }
      });

      return () => unsubscribe();
    }, CONSTANTS.POLLING_INTERVAL);

    return () => {
      console.log("Cleaning up Firebase polling");
      clearInterval(pollInterval);
    };
  }, [calculateDistance]);

  const handleStartJourney = useCallback(async () => {
    // If parking brake is on, turn it off first
    if (sensorData.parking_brake) {
      await toggleParkingBrake(true); // Will toggle to false
    }

    // Initialize cycle tracking
    cycleStartTimeRef.current = Date.now();
    cycleActiveRef.current = true;
    setIsJourneyActive(true);
    lastUpdateTimeRef.current = Date.now();

    console.log("Journey started - Total time tracking initiated");
  }, [sensorData.parking_brake]);

  // Handler for parking brake toggle from UI
  const handleToggleParkingBrake = useCallback(() => {
    toggleParkingBrake(sensorData.parking_brake);

    // Start the cycle if it hasn't started yet
    if (!cycleActiveRef.current && sensorData.parking_brake) {
      // If brake is being released
      cycleStartTimeRef.current = Date.now();
      cycleActiveRef.current = true;
      console.log("Cycle started - Total time tracking initiated");
    }

    lastUpdateTimeRef.current = Date.now();
  }, [sensorData.parking_brake]);

  // Handler for halting the cycle
  const handleHaltCycle = useCallback(() => {
    // Only proceed if journey is active
    if (!isJourneyActive) return;

    const finalTotalTime = cycleStartTimeRef.current
      ? Math.floor((Date.now() - cycleStartTimeRef.current) / 1000)
      : timingData.totalElapsedTime;

    console.log("Completing journey with total time:", finalTotalTime);

    // Calculate final TKPH
    const tkphValue = calculateTKPH(
      timingData.loadingTime,
      timingData.unloadingTime,
      timingData.loadingDistance,
      timingData.unloadingDistance,
      storedLoad,
      finalTotalTime
    );

    // Update TKPH in Firebase
    updateTKPH(tkphValue.tkph);
    setTkph(tkphValue.tkph.toString());

    setAverageSpeed(tkphValue.averageSpeed.toString());

    setStoredLoad(0);
    // Reset all timers and states
    setTimingData({
      loadingTime: 0,
      unloadingTime: 0,
      loadingDistance: 0,
      unloadingDistance: 0,
      totalElapsedTime: 0,
    });

    // Reset tracking refs and journey state
    previousRotationsRef.current = 0;
    lastUpdateTimeRef.current = Date.now();
    cycleStartTimeRef.current = null;
    cycleActiveRef.current = false;
    setIsJourneyActive(false);

    console.log("Journey completed and systems reset");
  }, [timingData, storedLoad, isJourneyActive]);

  // Effect for regular updates
  useEffect(() => {
    const updateInterval = setInterval(updateTimerAndDistance, 500);
    return () => clearInterval(updateInterval);
  }, [updateTimerAndDistance]);

  // Get display value for wheel rotations
  const getWheelRotationsDisplay = useCallback((): string | number => {
    if (sensorData.parking_brake) {
      return "Parking Brake Engaged";
    }
    return sensorData.wheel_rotations ?? "Loading...";
  }, [sensorData.parking_brake, sensorData.wheel_rotations]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="w-full text-3xl font-bold text-center text-gray-900">
          SMART TYRE PULSE
        </h1>
        <SensorDataGrid
          data={{
            ...sensorData,
            wheel_rotations: getWheelRotationsDisplay(),
          }}
        />

        <div className="flex items-center justify-between">
          <ParkingBrakeSwitch
            isOn={sensorData.parking_brake}
            onToggle={handleToggleParkingBrake}
          />
          <JourneyControls
            onStartJourney={handleStartJourney}
            onHaltCycle={handleHaltCycle}
            isParkingBrakeOn={sensorData.parking_brake}
            isJourneyActive={isJourneyActive}
          />
        </div>
        <GridSection
          timingData={{
            ...timingData,
            loadingTime: Math.floor(timingData.loadingTime),
            unloadingTime: Math.floor(timingData.unloadingTime),
          }}
          tkph={tkph}
          // lastCycleTKPH={lastCycleTKPH}
          totalElapsedTime={timingData.totalElapsedTime}
          // Pass the last cycle TKPH
          averageSpeed={averageSpeed}
        />
      </div>
    </div>
  );
}

export default App;
