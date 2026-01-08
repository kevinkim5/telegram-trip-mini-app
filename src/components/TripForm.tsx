import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, RefreshCw } from "lucide-react";
import { useTripStore } from "../store";
import { Trip, Flight, ItineraryItem } from "../types";
import { generateId, isUpcoming } from "../utils";

export const TripForm: React.FC = () => {
  const { selectedTrip, setView, addTrip, updateTrip, isLoading } =
    useTripStore();
  const isEdit = selectedTrip !== null;

  const [formData, setFormData] = useState<Omit<Trip, "id" | "status">>({
    destination: selectedTrip?.destination || "",
    startDate: selectedTrip?.startDate || "",
    endDate: selectedTrip?.endDate || "",
    imageUrl: selectedTrip?.imageUrl || "",
    description: selectedTrip?.description || "",
    flights: selectedTrip?.flights || [],
    itinerary: selectedTrip?.itinerary || [],
  });

  // Reset form data when selectedTrip changes (switching between add/edit)
  useEffect(() => {
    if (selectedTrip) {
      // Editing existing trip
      setFormData({
        destination: selectedTrip.destination || "",
        startDate: selectedTrip.startDate || "",
        endDate: selectedTrip.endDate || "",
        imageUrl: selectedTrip.imageUrl || "",
        description: selectedTrip.description || "",
        flights: selectedTrip.flights || [],
        itinerary: selectedTrip.itinerary || [],
      });
    } else {
      // Adding new trip - reset to empty
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        imageUrl: "",
        description: "",
        flights: [],
        itinerary: [],
      });
    }
  }, [selectedTrip]);

  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    const status = isUpcoming(formData.endDate) ? "upcoming" : "past";

    try {
      if (isEdit && selectedTrip) {
        await updateTrip(selectedTrip.id, {
          ...formData,
          id: selectedTrip.id,
          status,
        });
      } else {
        await addTrip({
          ...formData,
          id: generateId(),
          status,
        });
      }

      setView("list");
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addFlight = (flight: Flight) => {
    setFormData((prev) => ({
      ...prev,
      flights: [...prev.flights, flight],
    }));
    setShowFlightForm(false);
  };

  const removeFlight = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      flights: prev.flights.filter((f) => f.id !== id),
    }));
  };

  const addItineraryItem = (item: ItineraryItem) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, item],
    }));
    setShowItineraryForm(false);
  };

  const removeItineraryItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((i) => i.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700" />
        <div className="relative px-6 pt-10 pb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setView(isEdit ? "detail" : "list")}
              className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-semibold text-white">
              {isEdit ? "Edit Trip" : "New Trip"}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
            Basic Information
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              placeholder="e.g., Tokyo, Japan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
              placeholder="Brief description of your trip..."
            />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Flights
            </h2>
            <button
              type="button"
              onClick={() => setShowFlightForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Flight
            </button>
          </div>

          {formData.flights.length === 0 ? (
            <p className="text-slate-400 text-sm">No flights added yet</p>
          ) : (
            <div className="space-y-2">
              {formData.flights.map((flight) => (
                <div
                  key={flight.id}
                  className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-3"
                >
                  <div className="text-sm">
                    <div className="font-medium text-slate-50">
                      {flight.airline} {flight.flightNumber}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {flight.departure.code} → {flight.arrival.code}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFlight(flight.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Itinerary
            </h2>
            <button
              type="button"
              onClick={() => setShowItineraryForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {formData.itinerary.length === 0 ? (
            <p className="text-slate-400 text-sm">No itinerary items yet</p>
          ) : (
            <div className="space-y-2">
              {formData.itinerary.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-3"
                >
                  <div className="text-sm">
                    <div className="font-medium text-slate-50">
                      {item.title}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {item.date} {item.time && `• ${item.time}`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItineraryItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="w-full bg-sky-500 text-white py-4 rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-sky-900/50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Update Trip"
          ) : (
            "Create Trip"
          )}
        </button>
      </form>

      {showFlightForm && (
        <FlightFormModal
          onClose={() => setShowFlightForm(false)}
          onAdd={addFlight}
        />
      )}

      {showItineraryForm && (
        <ItineraryFormModal
          onClose={() => setShowItineraryForm(false)}
          onAdd={addItineraryItem}
        />
      )}
    </div>
  );
};

interface FlightFormModalProps {
  onClose: () => void;
  onAdd: (flight: Flight) => void;
}

const FlightFormModal: React.FC<FlightFormModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [flight, setFlight] = useState<Omit<Flight, "id">>({
    airline: "",
    flightNumber: "",
    departure: { airport: "", code: "", dateTime: "" },
    arrival: { airport: "", code: "", dateTime: "" },
    terminal: "",
    gate: "",
    seat: "",
    bookingReference: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !flight.airline ||
      !flight.flightNumber ||
      !flight.departure.code ||
      !flight.arrival.code
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onAdd({ ...flight, id: generateId() });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-50">Add Flight</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Airline *
              </label>
              <input
                type="text"
                value={flight.airline}
                onChange={(e) =>
                  setFlight((prev) => ({ ...prev, airline: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="e.g., Singapore Airlines"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Flight Number *
              </label>
              <input
                type="text"
                value={flight.flightNumber}
                onChange={(e) =>
                  setFlight((prev) => ({
                    ...prev,
                    flightNumber: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="e.g., SQ123"
                required
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Departure
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={flight.departure.code}
                  onChange={(e) =>
                    setFlight((prev) => ({
                      ...prev,
                      departure: { ...prev.departure, code: e.target.value },
                    }))
                  }
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Code (SIN)"
                  required
                />
                <input
                  type="text"
                  value={flight.departure.airport}
                  onChange={(e) =>
                    setFlight((prev) => ({
                      ...prev,
                      departure: { ...prev.departure, airport: e.target.value },
                    }))
                  }
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Airport"
                />
              </div>
              <input
                type="datetime-local"
                value={flight.departure.dateTime}
                onChange={(e) =>
                  setFlight((prev) => ({
                    ...prev,
                    departure: { ...prev.departure, dateTime: e.target.value },
                  }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Arrival
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={flight.arrival.code}
                  onChange={(e) =>
                    setFlight((prev) => ({
                      ...prev,
                      arrival: { ...prev.arrival, code: e.target.value },
                    }))
                  }
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Code (NRT)"
                  required
                />
                <input
                  type="text"
                  value={flight.arrival.airport}
                  onChange={(e) =>
                    setFlight((prev) => ({
                      ...prev,
                      arrival: { ...prev.arrival, airport: e.target.value },
                    }))
                  }
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Airport"
                />
              </div>
              <input
                type="datetime-local"
                value={flight.arrival.dateTime}
                onChange={(e) =>
                  setFlight((prev) => ({
                    ...prev,
                    arrival: { ...prev.arrival, dateTime: e.target.value },
                  }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={flight.terminal}
                onChange={(e) =>
                  setFlight((prev) => ({ ...prev, terminal: e.target.value }))
                }
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Terminal"
              />
              <input
                type="text"
                value={flight.gate}
                onChange={(e) =>
                  setFlight((prev) => ({ ...prev, gate: e.target.value }))
                }
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Gate"
              />
              <input
                type="text"
                value={flight.seat}
                onChange={(e) =>
                  setFlight((prev) => ({ ...prev, seat: e.target.value }))
                }
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Seat"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Booking Reference
              </label>
              <input
                type="text"
                value={flight.bookingReference}
                onChange={(e) =>
                  setFlight((prev) => ({
                    ...prev,
                    bookingReference: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="e.g., ABC123"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-900/50"
            >
              Add Flight
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ItineraryFormModalProps {
  onClose: () => void;
  onAdd: (item: ItineraryItem) => void;
}

const ItineraryFormModal: React.FC<ItineraryFormModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [item, setItem] = useState<Omit<ItineraryItem, "id">>({
    date: "",
    time: "",
    title: "",
    description: "",
    location: "",
    type: "activity",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.date || !item.title) {
      alert("Please fill in all required fields");
      return;
    }

    onAdd({ ...item, id: generateId() });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-50">
              Add Itinerary Item
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  setItem((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="e.g., Visit Senso-ji Temple"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={item.date}
                  onChange={(e) =>
                    setItem((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) =>
                    setItem((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Type
              </label>
              <select
                value={item.type}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    type: e.target.value as ItineraryItem["type"],
                  }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              >
                <option value="activity">Activity</option>
                <option value="accommodation">Accommodation</option>
                <option value="transport">Transport</option>
                <option value="dining">Dining</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={item.location}
                onChange={(e) =>
                  setItem((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="e.g., Asakusa, Tokyo"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) =>
                  setItem((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
                rows={3}
                placeholder="Additional details..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-900/50"
            >
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
