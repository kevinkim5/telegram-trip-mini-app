import React from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Plane,
  List,
} from "lucide-react";
import { useTripStore } from "../store";
import { formatDate, formatDateTime } from "../utils";

export const TripDetail: React.FC = () => {
  const { selectedTrip, setView, deleteTrip } = useTripStore();

  if (!selectedTrip) return null;

  const handleBack = () => {
    setView("list");
  };

  const handleEdit = () => {
    setView("edit");
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${selectedTrip.destination}"?`
      )
    ) {
      deleteTrip(selectedTrip.id);
    }
  };

  const sortedItinerary = [...selectedTrip.itinerary].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const getTypeColor = (type: string) => {
    const colors = {
      activity: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
      accommodation:
        "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      transport:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      dining: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
      other: "bg-slate-700 text-slate-300 border border-slate-600",
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {selectedTrip.imageUrl && (
        <div className="h-64 bg-gradient-to-br from-sky-500 to-indigo-600 relative">
          <img
            src={selectedTrip.imageUrl}
            alt={selectedTrip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
        </div>
      )}
      {!selectedTrip.imageUrl && (
        <div className="h-64 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700"></div>
      )}

      <div className="sticky top-0 bg-transparent z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="bg-slate-900/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-50" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-slate-900/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-5 h-5 text-slate-50" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-slate-900/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-red-900/50 hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-16 relative z-0 pb-24">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">
            {selectedTrip.destination}
          </h1>

          <div className="flex items-center text-slate-300 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-slate-400" />
            <span>
              {formatDate(selectedTrip.startDate)} -{" "}
              {formatDate(selectedTrip.endDate)}
            </span>
          </div>

          {selectedTrip.description && (
            <p className="text-slate-300">{selectedTrip.description}</p>
          )}
        </div>

        {selectedTrip.flights.length > 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-sky-400" />
              Flights
            </h2>

            <div className="space-y-4">
              {selectedTrip.flights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-50">
                      {flight.airline} {flight.flightNumber}
                    </span>
                    {flight.bookingReference && (
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-lg">
                        {flight.bookingReference}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        Departure
                      </div>
                      <div className="font-medium text-slate-50">
                        {flight.departure.code}
                      </div>
                      <div className="text-sm text-slate-300">
                        {flight.departure.airport}
                      </div>
                      <div className="text-sm text-slate-400">
                        {formatDateTime(flight.departure.dateTime)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1">Arrival</div>
                      <div className="font-medium text-slate-50">
                        {flight.arrival.code}
                      </div>
                      <div className="text-sm text-slate-300">
                        {flight.arrival.airport}
                      </div>
                      <div className="text-sm text-slate-400">
                        {formatDateTime(flight.arrival.dateTime)}
                      </div>
                    </div>
                  </div>

                  {(flight.terminal || flight.gate || flight.seat) && (
                    <div className="mt-3 pt-3 border-t border-slate-700 flex gap-4 text-sm text-slate-400">
                      {flight.terminal && (
                        <span>Terminal: {flight.terminal}</span>
                      )}
                      {flight.gate && <span>Gate: {flight.gate}</span>}
                      {flight.seat && <span>Seat: {flight.seat}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTrip.itinerary.length > 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <List className="w-5 h-5 mr-2 text-purple-400" />
              Itinerary
            </h2>

            <div className="space-y-3">
              {sortedItinerary.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/50 border-l-4 border-sky-500 rounded-r-xl pl-4 pr-4 py-3"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="text-xs text-slate-400">
                        {formatDate(item.date)}
                        {item.time && ` • ${item.time}`}
                      </div>
                      <h3 className="font-semibold text-slate-50 mt-1">
                        {item.title}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-lg ${getTypeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {item.location && (
                    <div className="flex items-center text-sm text-slate-300 mb-1 mt-2">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                      {item.location}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-sm text-slate-300 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
