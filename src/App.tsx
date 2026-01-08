import { useEffect } from "react";
import { init } from "@tma.js/sdk";
import { useTripStore } from "./store";
import { authenticateWithFirebase } from "./services/auth";
import { getGroupId, isTelegramWebApp } from "./utils/telegram";
import { TripList } from "./components/TripList";
import { TripForm } from "./components/TripForm";
import { TripDetail } from "./components/TripDetail";
import "./App.css";

export default function App() {
  const { view, setGroupId, subscribeToTrips } = useTripStore();

  useEffect(() => {
    // Initialize Telegram Mini App SDK
    const initializeApp = async () => {
      try {
        // Only call Telegram init when actually running inside Telegram
        // and when launch parameters (initData) are present.
        if (isTelegramWebApp() && window.Telegram?.WebApp?.initData) {
          try {
            init();
          } catch (sdkError) {
            // If SDK init fails (e.g. unexpected environment), log and continue.
            console.warn(
              "Telegram SDK init failed, continuing without it:",
              sdkError
            );
          }
        } else {
          console.log(
            "Running outside Telegram or without initData - development mode"
          );
        }

        // Authenticate with Firebase
        await authenticateWithFirebase();

        // Get group ID from Telegram
        const groupId = getGroupId();
        console.log("groupId", groupId);
        console.log("isTelegramWebApp", isTelegramWebApp());
        if (groupId) {
          setGroupId(groupId);
          // Subscribe to real-time updates
          subscribeToTrips();
        } else {
          // Development fallback: use a default group ID when not in Telegram
          if (!isTelegramWebApp()) {
            console.log("Running outside Telegram - development mode");
            const devGroupId = "dev_group_local";
            console.warn(
              "Telegram not available - using development group ID:",
              devGroupId
            );
            setGroupId(devGroupId);
            subscribeToTrips();
          } else {
            console.error(
              "Could not determine group ID. App may not work correctly."
            );
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, [setGroupId, subscribeToTrips]);

  // Render based on current view
  switch (view) {
    case "add":
    case "edit":
      return <TripForm />;
    case "detail":
      return <TripDetail />;
    case "list":
    default:
      return <TripList />;
  }
}
