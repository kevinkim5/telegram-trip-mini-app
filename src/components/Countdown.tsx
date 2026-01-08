import React, { useEffect, useState } from "react";
import { Trip } from "../types";
import { getDaysUntil } from "../utils";

interface CountdownProps {
  trip: Trip;
}

export const Countdown: React.FC<CountdownProps> = ({ trip }) => {
  const [daysUntil, setDaysUntil] = useState(getDaysUntil(trip.startDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysUntil(getDaysUntil(trip.startDate));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [trip.startDate]);

  if (daysUntil < 0) return null;

  return (
    <div className="text-right">
      <div className="text-3xl font-bold text-sky-50">
        {daysUntil === 0 ? "🎉" : daysUntil}
      </div>
      <div className="text-xs text-sky-200/80 mt-1">
        {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "day" : "days"}
      </div>
    </div>
  );
};
