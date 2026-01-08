import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Trip } from "../types";
import { TripCard } from "./TripCard";
import { Countdown } from "./Countdown";
import { useTripStore } from "../store";

export const TripList: React.FC = () => {
  const { trips, selectTrip, setView, loadTrips, isLoading } = useTripStore();

  const upcomingTrips = trips
    .filter((t) => t.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const pastTrips = trips
    .filter((t) => t.status === "past")
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

  const nextTrip = upcomingTrips[0];

  const handleTripClick = (trip: Trip) => {
    selectTrip(trip);
    setView("detail");
  };

  const handleAddTrip = () => {
    setView("add");
  };

  const handleRefresh = async () => {
    await loadTrips();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24">
      {/* Hero header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700" />
        <div className="absolute inset-x-0 -bottom-24 h-48 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
        <div className="relative px-6 pt-10 pb-16 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-sky-100/80">
              Trip Tracker
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Plan your next adventure
            </h1>
            <p className="mt-2 text-sm text-sky-100/80 max-w-xs">
              See upcoming trips, track flights, and keep your itinerary in one
              place.
            </p>
            <p className="mt-3 text-xs text-sky-100/80">
              {trips.length} trip{trips.length !== 1 ? "s" : ""} planned
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-sky-50 backdrop-blur hover:bg-white/20 transition-colors disabled:opacity-50"
              title="Refresh trips"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Sync</span>
            </button>
            <button
              onClick={handleAddTrip}
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-semibold shadow-md hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New trip
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {isLoading && trips.length === 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 text-center">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-sky-400" />
            <p className="text-slate-200 text-sm">Loading trips...</p>
          </div>
        )}

        {/* Next trip countdown card */}
        {nextTrip && (
          <div className="mb-2">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-400/10 via-sky-400/10 to-blue-500/10 border border-sky-400/30 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-sky-200/80">
                  Next trip
                </p>
                <p className="mt-1 text-sm font-semibold text-sky-50">
                  {nextTrip.destination}
                </p>
                <p className="text-xs text-sky-100/80">
                  {new Date(nextTrip.startDate).toLocaleDateString()} –{" "}
                  {new Date(nextTrip.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4">
                <Countdown trip={nextTrip} />
              </div>
            </div>
          </div>
        )}

        {upcomingTrips.length > 0 && (
          <div className="mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">
              Upcoming trips
            </h2>
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => handleTripClick(trip)}
                />
              ))}
            </div>
          </div>
        )}

        {pastTrips.length > 0 && (
          <div className="mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-3">
              Past trips
            </h2>
            <div className="space-y-4">
              {pastTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => handleTripClick(trip)}
                />
              ))}
            </div>
          </div>
        )}

        {trips.length === 0 && !isLoading && (
          <div className="text-center py-16 text-slate-300">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-900/70 flex items-center justify-center border border-slate-700">
              <span className="text-2xl">🗺️</span>
            </div>
            <p className="text-sm font-medium">No trips yet</p>
            <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
              Start by creating your first adventure—flights and itineraries
              included.
            </p>
            <button
              onClick={handleAddTrip}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-sky-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add a trip
            </button>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-2 text-[11px] text-slate-300">
              <span>☁️ Firebase Active</span>
              <span className="text-slate-500">
                Trips sync in real time across group members
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating add button for quick access */}
      <button
        onClick={handleAddTrip}
        className="fixed bottom-6 right-6 bg-sky-500 text-white rounded-full p-4 shadow-lg shadow-sky-900/60 hover:bg-sky-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
