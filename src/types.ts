export interface Flight {
  id: string;
  flightNumber: string;
  date: string;
  bookingReference?: string;
  type: "departing" | "returning" | "additional";
}

export interface ItineraryItem {
  id: string;
  date: string;
  time?: string;
  title: string;
  description?: string;
  location?: string;
  type: "activity" | "accommodation" | "transport" | "dining" | "other";
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  description?: string;
  flights: Flight[];
  itinerary: ItineraryItem[];
  status: "upcoming" | "past";
  groupId?: string; // Added for Firebase group-based access
}
