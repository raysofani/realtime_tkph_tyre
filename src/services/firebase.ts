import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD1n4ca_HYGzuwMj2ffcg6jTuYDKUCahW4",
  authDomain: "pressure-monitoring-b592a.firebaseapp.com",
  databaseURL: "https://pressure-monitoring-b592a-default-rtdb.firebaseio.com",
  projectId: "pressure-monitoring-b592a",
  storageBucket: "pressure-monitoring-b592a.appspot.com",
  messagingSenderId: "258688387638",
  appId: "1:258688387638:web:796d15457607ab48002697",
  measurementId: "G-1LYYTBXRPW",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const USER_ID = "wmKpLeRocgRwhVf10Fe3cTlSlnw2";
export const userRef = ref(database, `UsersData/${USER_ID}`);

// Helper function to update parking brake
export const toggleParkingBrake = (currentState: boolean) => {
  const newState = !currentState;
  console.log("Toggling parking brake to:", newState);
  return update(userRef, {
    parking_brake: newState,
  }).catch((error) => {
    console.error("Error toggling parking brake:", error);
  });
};

export const updateTKPH = async (tkph: number) => {
  try {
    await update(userRef, { tkph });
    console.log("TKPH updated successfully:", tkph);
  } catch (error) {
    console.error("Error updating TKPH:", error);
  }
};
