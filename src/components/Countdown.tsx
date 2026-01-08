import React, { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Trip } from "../types";
import { getDaysUntil, formatDate } from "../utils";

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
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center mb-3">
        <Clock className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium opacity-90">Next Trip</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <h2 className="text-2xl font-bold">{trip.destination}</h2>
          </div>
          <p className="text-sm opacity-90">{formatDate(trip.startDate)}</p>
        </div>

        <div className="text-right">
          <div className="text-4xl font-bold">
            {daysUntil === 0 ? "🎉" : daysUntil}
          </div>
          <div className="text-sm opacity-90">
            {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "day" : "days"}
          </div>
        </div>
      </div>
    </div>
  );
};
