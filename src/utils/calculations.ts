// Function to calculate TKPH based on the provided formula
export const calculateTKPH = (
  loadedTravelTime: number, // in seconds - But treating them as minutes
  unloadedTravelTime: number, // in seconds - But treating them as minutes
  loadedDistance: number, // in meters
  unloadedDistance: number, // in meters
  load: number, // current load
  finalTotalTime: number
) => {
  // Calculate total time in hours (convert from seconds)
  // const totalTimeHours = (loadedTravelTime + unloadedTravelTime) / 60; //We are treating the seconds as minutes
  const totalTimeHours2 = finalTotalTime / 60; //We are treating the seconds as minutes

  // Calculate mean load
  const meanLoad =
    (loadedTravelTime * load + unloadedTravelTime * 2) / totalTimeHours2;

  // Convert distances to kilometers
  const loadedDistanceKm = loadedDistance / 1000;
  const unloadedDistanceKm = unloadedDistance / 1000;
  const totalDistanceKm = loadedDistanceKm + unloadedDistanceKm;

  const averageSpeed =
    totalTimeHours2 > 0 ? totalDistanceKm / totalTimeHours2 : 0;

  // Total distance divided by total time gives us km/h
  const awss =
    totalTimeHours2 > 0
      ? (loadedDistanceKm + unloadedDistanceKm) / totalTimeHours2
      : 0;

  // Calculate final TKPH
  const tkph = meanLoad * awss;

  return {
    tkph: Number(tkph.toFixed(2)), // Round TKPH to 2 decimal places
    averageSpeed: Number(averageSpeed.toFixed(2)), // Round average speed to 2 decimal places
  };
};
