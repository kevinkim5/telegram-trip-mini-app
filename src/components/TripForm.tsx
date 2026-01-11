import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, RefreshCw, Edit2 } from "lucide-react";
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

  const getDepartingFlight = () => {
    return formData.flights.find((f) => f.type === "departing");
  };

  const getReturningFlight = () => {
    return formData.flights.find((f) => f.type === "returning");
  };

  const getAdditionalFlights = () => {
    return formData.flights.filter((f) => f.type === "additional");
  };

  const setDepartingFlight = (flight: Flight | null) => {
    setFormData((prev) => {
      const otherFlights = prev.flights.filter((f) => f.type !== "departing");
      return {
        ...prev,
        flights: flight ? [...otherFlights, flight] : otherFlights,
      };
    });
  };

  const setReturningFlight = (flight: Flight | null) => {
    setFormData((prev) => {
      const otherFlights = prev.flights.filter((f) => f.type !== "returning");
      return {
        ...prev,
        flights: flight ? [...otherFlights, flight] : otherFlights,
      };
    });
  };

  const addAdditionalFlight = (flight: Flight) => {
    setFormData((prev) => ({
      ...prev,
      flights: [...prev.flights, flight],
    }));
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
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-6">
            Flights
          </h2>

          <div className="space-y-6">
            {/* Departing Flight */}
            <div>
              <h3 className="text-xs font-medium text-slate-400 mb-3">
                Departing Flight
              </h3>
              <FlightInput
                flight={getDepartingFlight() || null}
                onSave={(flight) => setDepartingFlight(flight)}
                onRemove={() => setDepartingFlight(null)}
                type="departing"
              />
            </div>

            {/* Additional Flights */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-slate-400">
                  Additional Flights
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newFlight: Flight = {
                      id: generateId(),
                      flightNumber: "",
                      date: "",
                      type: "additional",
                    };
                    addAdditionalFlight(newFlight);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-2 py-1 text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
              {getAdditionalFlights().length === 0 ? (
                <p className="text-slate-500 text-xs italic">
                  No additional flights (for multi-city trips)
                </p>
              ) : (
                <div className="space-y-3">
                  {getAdditionalFlights().map((flight) => (
                    <FlightInput
                      key={flight.id}
                      flight={flight}
                      onSave={(updatedFlight) => {
                        removeFlight(flight.id);
                        if (updatedFlight) {
                          addAdditionalFlight(updatedFlight);
                        }
                      }}
                      onRemove={() => removeFlight(flight.id)}
                      type="additional"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Returning Flight */}
            <div>
              <h3 className="text-xs font-medium text-slate-400 mb-3">
                Returning Flight
              </h3>
              <FlightInput
                flight={getReturningFlight() || null}
                onSave={(flight) => setReturningFlight(flight)}
                onRemove={() => setReturningFlight(null)}
                type="returning"
              />
            </div>
          </div>
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

      {showItineraryForm && (
        <ItineraryFormModal
          onClose={() => setShowItineraryForm(false)}
          onAdd={addItineraryItem}
        />
      )}
    </div>
  );
};

interface FlightInputProps {
  flight: Flight | null;
  onSave: (flight: Flight | null) => void;
  onRemove: () => void;
  type: "departing" | "returning" | "additional";
}

const FlightInput: React.FC<FlightInputProps> = ({
  flight,
  onSave,
  onRemove,
  type,
}) => {
  const [flightNumber, setFlightNumber] = useState(flight?.flightNumber || "");
  const [date, setDate] = useState(flight?.date || "");
  const [bookingReference, setBookingReference] = useState(
    flight?.bookingReference || ""
  );
  const [isEditing, setIsEditing] = useState(!flight);

  useEffect(() => {
    if (flight) {
      setFlightNumber(flight.flightNumber);
      setDate(flight.date);
      setBookingReference(flight.bookingReference || "");
      setIsEditing(false);
    } else {
      setFlightNumber("");
      setDate("");
      setBookingReference("");
      setIsEditing(true);
    }
  }, [flight]);

  const handleSave = () => {
    if (!flightNumber.trim() || !date.trim()) {
      alert("Please fill in flight number and date");
      return;
    }

    const savedFlight: Flight = {
      id: flight?.id || generateId(),
      flightNumber: flightNumber.trim(),
      date: date,
      bookingReference: bookingReference.trim() || undefined,
      type,
    };

    onSave(savedFlight);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (flight) {
      setFlightNumber(flight.flightNumber);
      setDate(flight.date);
      setBookingReference(flight.bookingReference || "");
      setIsEditing(false);
    } else {
      onRemove();
    }
  };

  const formatFlightDate = (dateString: string): string => {
    if (!dateString) return "Date not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const year = date.getFullYear();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const day = date.getDate();
      return `${year} ${month} ${day}`;
    } catch {
      return dateString;
    }
  };

  if (!isEditing && flight) {
    return (
      <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-3">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-slate-400 uppercase">
              {type === "departing"
                ? "Departing"
                : type === "returning"
                  ? "Returning"
                  : "Additional"}
            </span>
            {bookingReference && (
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                {bookingReference}
              </span>
            )}
          </div>
          <div className="font-medium text-slate-50">
            {flight.flightNumber || "Flight number not set"}
          </div>
          <div className="text-slate-400 text-xs">
            {formatFlightDate(flight.date)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-slate-300 transition-colors p-1"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase">
          {type === "departing"
            ? "Departing"
            : type === "returning"
              ? "Returning"
              : "Additional"}
        </span>
        {flight && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Flight Number *
        </label>
        <input
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm"
          placeholder="e.g., SQ123"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Date *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Booking Reference
        </label>
        <input
          type="text"
          value={bookingReference}
          onChange={(e) => setBookingReference(e.target.value)}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm"
          placeholder="Optional"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm"
        >
          {flight ? "Update" : "Add"}
        </button>
        {flight && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors text-sm"
          >
            Cancel
          </button>
        )}
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
