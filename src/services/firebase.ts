import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Trip } from "../types";

const TRIPS_COLLECTION = "trips";

/**
 * Convert trip data from Firestore format to app format
 */
function firestoreToTrip(docData: DocumentData): Trip {
  return {
    id: docData.id,
    destination: docData.destination,
    startDate: docData.startDate,
    endDate: docData.endDate,
    description: docData.description || "",
    imageUrl: docData.imageUrl || "",
    flights: docData.flights || [],
    itinerary: docData.itinerary || [],
    status: docData.status || "upcoming",
  };
}

/**
 * Convert trip data to Firestore format
 */
function tripToFirestore(trip: Trip): DocumentData {
  return {
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    description: trip.description || "",
    imageUrl: trip.imageUrl || "",
    flights: trip.flights || [],
    itinerary: trip.itinerary || [],
    status: trip.status,
    groupId: trip.groupId, // This will be added by the caller
    updatedAt: Timestamp.now(),
  };
}

/**
 * Load trips for a specific group
 */
export async function loadTrips(groupId: string): Promise<Trip[]> {
  try {
    const tripsRef = collection(db, TRIPS_COLLECTION);
    const q = query(tripsRef, where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);

    const trips: Trip[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      trips.push({
        ...firestoreToTrip({ ...data, id: doc.id }),
        groupId: data.groupId,
      });
    });

    return trips;
  } catch (error) {
    console.error("Error loading trips:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for trips in a group
 */
export function subscribeToTrips(
  groupId: string,
  callback: (trips: Trip[]) => void
): () => void {
  const tripsRef = collection(db, TRIPS_COLLECTION);
  const q = query(tripsRef, where("groupId", "==", groupId));

  return onSnapshot(
    q,
    (querySnapshot: QuerySnapshot<DocumentData>) => {
      const trips: Trip[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trips.push({
          ...firestoreToTrip({ ...data, id: doc.id }),
          groupId: data.groupId,
        });
      });
      callback(trips);
    },
    (error) => {
      console.error("Error in trips subscription:", error);
    }
  );
}

/**
 * Save a new trip
 * Uses the trip.id as the Firestore document ID for consistency
 */
export async function saveTrip(trip: Trip, groupId: string): Promise<string> {
  try {
    if (!trip.id) {
      throw new Error("Trip ID is required");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, trip.id);
    const tripData = {
      ...tripToFirestore(trip),
      groupId,
      createdAt: Timestamp.now(),
    };

    await setDoc(tripRef, tripData);
    return trip.id;
  } catch (error) {
    console.error("Error saving trip:", error);
    throw error;
  }
}

/**
 * Update an existing trip
 */
export async function updateTrip(
  tripId: string,
  trip: Trip,
  groupId: string
): Promise<void> {
  try {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripData = {
      ...tripToFirestore(trip),
      groupId,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(tripRef, tripData);
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
}

/**
 * Delete a trip
 */
export async function deleteTrip(tripId: string): Promise<void> {
  try {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}
