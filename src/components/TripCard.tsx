import React from "react";
import { MapPin, Calendar, Plane } from "lucide-react";
import { Trip } from "../types";
import { formatDate, getDaysUntil, getCountdownText } from "../utils";

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const daysUntil = getDaysUntil(trip.startDate);
  const isUpcoming = trip.status === "upcoming";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_45px_rgba(15,23,42,0.75)] hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-[0_22px_55px_rgba(8,47,73,0.9)] transition-all duration-200 overflow-hidden"
    >
      {trip.imageUrl && (
        <div className="h-40 bg-gradient-to-br from-sky-500 to-indigo-600 relative">
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>
      )}
      {!trip.imageUrl && (
        <div className="h-32 bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-white opacity-70" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-slate-50 truncate">
            {trip.destination}
          </h3>
          {isUpcoming && daysUntil >= 0 && (
            <span className="bg-sky-500/90 text-white text-[10px] px-2 py-1 rounded-full">
              {getCountdownText(daysUntil)}
            </span>
          )}
          {!isUpcoming && (
            <span className="bg-slate-700 text-slate-100 text-[10px] px-2 py-1 rounded-full">
              Past
            </span>
          )}
        </div>

        <div className="flex items-center text-slate-300 text-xs mb-1">
          <Calendar className="w-3 h-3 mr-2 text-slate-400" />
          <span>
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </span>
        </div>

        {trip.flights.length > 0 && (
          <div className="flex items-center text-slate-300 text-xs">
            <Plane className="w-3 h-3 mr-2 text-sky-400" />
            <span>
              {trip.flights.length} flight
              {trip.flights.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {trip.description && (
          <p className="text-slate-300 text-xs mt-2 line-clamp-2">
            {trip.description}
          </p>
        )}
        {!trip.description && (
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-slate-700/70 to-transparent" />
        )}

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>✈️ {trip.flights.length} flights</span>
          <span>📋 {trip.itinerary.length} items</span>
        </div>
      </div>
    </div>
  );
};
