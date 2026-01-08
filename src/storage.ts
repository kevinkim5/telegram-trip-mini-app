import { Trip } from "./types";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        version?: string;
        initData?: string;
        CloudStorage?: {
          setItem: (
            key: string,
            value: string,
            callback?: (error: string | null) => void
          ) => void;
          getItem: (
            key: string,
            callback: (error: string | null, value: string) => void
          ) => void;
        };
      };
    };
  }
}

const STORAGE_KEY = "trip_tracker_data";

// Get Telegram WebApp instance
const getTelegramWebApp = () => {
  return window.Telegram?.WebApp;
};

// Check if CloudStorage is available
const isCloudStorageAvailable = (): boolean => {
  const tg = getTelegramWebApp();
  if (!tg) {
    console.log("Telegram WebApp not available - using localStorage");
    return false;
  }

  if (!tg.CloudStorage) {
    console.warn(
      `CloudStorage not available. Telegram version: ${tg.version || "unknown"}`
    );
    console.warn("CloudStorage requires Telegram WebApp version 7.2+");
    console.log("Falling back to localStorage");
    return false;
  }

  console.log(
    `CloudStorage available! Telegram version: ${tg.version || "unknown"}`
  );
  return true;
};

// Load trips from Telegram CloudStorage (shared across group)
export const loadTrips = async (): Promise<Trip[]> => {
  try {
    if (isCloudStorageAvailable()) {
      const tg = getTelegramWebApp()!;

      return new Promise((resolve) => {
        tg.CloudStorage!.getItem(
          STORAGE_KEY,
          (error: string | null, value: string) => {
            if (error || !value) {
              console.log(
                "No data in CloudStorage, checking localStorage fallback"
              );
              // Try localStorage as backup
              const localData = localStorage.getItem(STORAGE_KEY);
              if (localData) {
                const trips = JSON.parse(localData);
                // Try to migrate to cloud
                saveTrips(trips);
                resolve(trips);
              } else {
                resolve([]);
              }
            } else {
              try {
                const trips = JSON.parse(value);
                // Also save to localStorage as backup
                localStorage.setItem(STORAGE_KEY, value);
                resolve(trips);
              } catch (e) {
                console.error("Error parsing CloudStorage data:", e);
                resolve([]);
              }
            }
          }
        );
      });
    } else {
      // Fallback to localStorage
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading trips:", error);
    return [];
  }
};

// Save trips to Telegram CloudStorage (shared across group)
export const saveTrips = async (trips: Trip[]): Promise<void> => {
  const data = JSON.stringify(trips);

  // Always save to localStorage as backup
  try {
    localStorage.setItem(STORAGE_KEY, data);
  } catch (e) {
    console.error("localStorage save failed:", e);
  }

  // Try to save to CloudStorage if available
  if (isCloudStorageAvailable()) {
    const tg = getTelegramWebApp()!;

    return new Promise((resolve, reject) => {
      tg.CloudStorage!.setItem(STORAGE_KEY, data, (error: string | null) => {
        if (error) {
          console.error("Error saving to CloudStorage:", error);
          console.log("Data saved to localStorage instead");
          reject(error);
        } else {
          console.log("✅ Successfully saved to Telegram Cloud Storage");
          resolve();
        }
      });
    });
  } else {
    // Just use localStorage
    console.log("💾 Saved to localStorage (CloudStorage not available)");
  }
};

export const addTrip = async (trip: Trip): Promise<void> => {
  const trips = await loadTrips();
  trips.push(trip);
  await saveTrips(trips);
};

export const updateTrip = async (
  id: string,
  updatedTrip: Trip
): Promise<void> => {
  const trips = await loadTrips();
  const index = trips.findIndex((t) => t.id === id);
  if (index !== -1) {
    trips[index] = updatedTrip;
    await saveTrips(trips);
  }
};

export const deleteTrip = async (id: string): Promise<void> => {
  const trips = await loadTrips();
  const filtered = trips.filter((t) => t.id !== id);
  await saveTrips(filtered);
};
