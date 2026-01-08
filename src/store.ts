import { create } from "zustand";
import { Trip } from "./types";
import {
  loadTrips,
  saveTrip,
  updateTrip as updateTripInFirebase,
  deleteTrip as deleteTripInFirebase,
  subscribeToTrips,
} from "./services/firebase";
import { isPast, parseISO } from "date-fns";

interface TripStore {
  trips: Trip[];
  selectedTrip: Trip | null;
  view: "list" | "detail" | "add" | "edit";
  isLoading: boolean;
  groupId: string | null;
  unsubscribe: (() => void) | null;

  setGroupId: (groupId: string | null) => void;
  loadTrips: () => Promise<void>;
  subscribeToTrips: () => void;
  addTrip: (trip: Trip) => Promise<void>;
  updateTrip: (id: string, trip: Trip) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  selectTrip: (trip: Trip | null) => void;
  setView: (view: "list" | "detail" | "add" | "edit") => void;
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  selectedTrip: null,
  view: "list",
  isLoading: false,
  groupId: null,
  unsubscribe: null,

  setGroupId: (groupId) => {
    // Unsubscribe from previous group if exists
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    set({ groupId, unsubscribe: null });
  },

  loadTrips: async () => {
    const { groupId } = get();
    if (!groupId) {
      console.warn("Cannot load trips: groupId not set");
      return;
    }

    set({ isLoading: true });
    try {
      const trips = await loadTrips(groupId);
      const now = new Date();

      const updatedTrips = trips.map(
        (trip) =>
          ({
            ...trip,
            status: isPast(parseISO(trip.endDate)) ? "past" : "upcoming",
          } as Trip)
      );

      set({ trips: updatedTrips, isLoading: false });
    } catch (error) {
      console.error("Error loading trips:", error);
      set({ isLoading: false });
    }
  },

  subscribeToTrips: () => {
    const { groupId, unsubscribe } = get();
    if (!groupId) {
      console.warn("Cannot subscribe to trips: groupId not set");
      return;
    }

    // Unsubscribe from previous subscription if exists
    if (unsubscribe) {
      unsubscribe();
    }

    const now = new Date();
    const unsubscribeFn = subscribeToTrips(groupId, (trips) => {
      const updatedTrips = trips.map(
        (trip) =>
          ({
            ...trip,
            status: isPast(parseISO(trip.endDate)) ? "past" : "upcoming",
          } as Trip)
      );
      set({ trips: updatedTrips, isLoading: false });
    });

    set({ unsubscribe: unsubscribeFn, isLoading: true });
  },

  addTrip: async (trip) => {
    const { groupId } = get();
    if (!groupId) {
      console.error("Cannot add trip: groupId not set");
      return;
    }

    set({ isLoading: true });
    try {
      const tripWithGroup = { ...trip, groupId };
      await saveTrip(tripWithGroup, groupId);
      // Real-time subscription will update the trips automatically
      set({ isLoading: false });
    } catch (error) {
      console.error("Error adding trip:", error);
      set({ isLoading: false });
    }
  },

  updateTrip: async (id, updatedTrip) => {
    const { groupId } = get();
    if (!groupId) {
      console.error("Cannot update trip: groupId not set");
      return;
    }

    set({ isLoading: true });
    try {
      const tripWithGroup = { ...updatedTrip, groupId };
      await updateTripInFirebase(id, tripWithGroup, groupId);
      // Real-time subscription will update the trips automatically
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating trip:", error);
      set({ isLoading: false });
    }
  },

  deleteTrip: async (id) => {
    set({ isLoading: true });
    try {
      await deleteTripInFirebase(id);
      // Real-time subscription will update the trips automatically
      set({ selectedTrip: null, view: "list", isLoading: false });
    } catch (error) {
      console.error("Error deleting trip:", error);
      set({ isLoading: false });
    }
  },

  selectTrip: (trip) => {
    set({ selectedTrip: trip });
  },

  setView: (view) => {
    set({ view });
  },
}));
