export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    code: string;
    dateTime: string;
  };
  arrival: {
    airport: string;
    code: string;
    dateTime: string;
  };
  terminal?: string;
  gate?: string;
  seat?: string;
  bookingReference?: string;
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
