import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, RefreshCw } from 'lucide-react';
import { useTripStore } from '../store';
import { Trip, Flight, ItineraryItem } from '../types';
import { generateId, isUpcoming } from '../utils';

export const TripForm: React.FC = () => {
  const { selectedTrip, setView, addTrip, updateTrip, isLoading } = useTripStore();
  const isEdit = selectedTrip !== null;

  const [formData, setFormData] = useState<Omit<Trip, 'id' | 'status'>>({
    destination: selectedTrip?.destination || '',
    startDate: selectedTrip?.startDate || '',
    endDate: selectedTrip?.endDate || '',
    imageUrl: selectedTrip?.imageUrl || '',
    description: selectedTrip?.description || '',
    flights: selectedTrip?.flights || [],
    itinerary: selectedTrip?.itinerary || []
  });

  // Reset form data when selectedTrip changes (switching between add/edit)
  useEffect(() => {
    if (selectedTrip) {
      // Editing existing trip
      setFormData({
        destination: selectedTrip.destination || '',
        startDate: selectedTrip.startDate || '',
        endDate: selectedTrip.endDate || '',
        imageUrl: selectedTrip.imageUrl || '',
        description: selectedTrip.description || '',
        flights: selectedTrip.flights || [],
        itinerary: selectedTrip.itinerary || []
      });
    } else {
      // Adding new trip - reset to empty
      setFormData({
        destination: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        description: '',
        flights: [],
        itinerary: []
      });
    }
  }, [selectedTrip]);

  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    const status = isUpcoming(formData.endDate) ? 'upcoming' : 'past';

    try {
      if (isEdit && selectedTrip) {
        await updateTrip(selectedTrip.id, {
          ...formData,
          id: selectedTrip.id,
          status
        });
      } else {
        await addTrip({
          ...formData,
          id: generateId(),
          status
        });
      }

      setView('list');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addFlight = (flight: Flight) => {
    setFormData(prev => ({
      ...prev,
      flights: [...prev.flights, flight]
    }));
    setShowFlightForm(false);
  };

  const removeFlight = (id: string) => {
    setFormData(prev => ({
      ...prev,
      flights: prev.flights.filter(f => f.id !== id)
    }));
  };

  const addItineraryItem = (item: ItineraryItem) => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, item]
    }));
    setShowItineraryForm(false);
  };

  const removeItineraryItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter(i => i.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setView(isEdit ? 'detail' : 'list')}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit Trip' : 'New Trip'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Tokyo, Japan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of your trip..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Flights</h2>
            <button
              type="button"
              onClick={() => setShowFlightForm(true)}
              className="text-blue-600 flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Flight
            </button>
          </div>

          {formData.flights.length === 0 ? (
            <p className="text-gray-500 text-sm">No flights added yet</p>
          ) : (
            <div className="space-y-2">
              {formData.flights.map(flight => (
                <div key={flight.id} className="flex items-center justify-between border border-gray-200 rounded p-3">
                  <div className="text-sm">
                    <div className="font-medium">{flight.airline} {flight.flightNumber}</div>
                    <div className="text-gray-600">{flight.departure.code} → {flight.arrival.code}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFlight(flight.id)}
                    className="text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Itinerary</h2>
            <button
              type="button"
              onClick={() => setShowItineraryForm(true)}
              className="text-blue-600 flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>

          {formData.itinerary.length === 0 ? (
            <p className="text-gray-500 text-sm">No itinerary items yet</p>
          ) : (
            <div className="space-y-2">
              {formData.itinerary.map(item => (
                <div key={item.id} className="flex items-center justify-between border border-gray-200 rounded p-3">
                  <div className="text-sm">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-gray-600">{item.date} {item.time && `• ${item.time}`}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItineraryItem(item.id)}
                    className="text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            isEdit ? 'Update Trip' : 'Create Trip'
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

const FlightFormModal: React.FC<FlightFormModalProps> = ({ onClose, onAdd }) => {
  const [flight, setFlight] = useState<Omit<Flight, 'id'>>({
    airline: '',
    flightNumber: '',
    departure: { airport: '', code: '', dateTime: '' },
    arrival: { airport: '', code: '', dateTime: '' },
    terminal: '',
    gate: '',
    seat: '',
    bookingReference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flight.airline || !flight.flightNumber || !flight.departure.code || !flight.arrival.code) {
      alert('Please fill in all required fields');
      return;
    }

    onAdd({ ...flight, id: generateId() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add Flight</h3>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Airline *</label>
              <input
                type="text"
                value={flight.airline}
                onChange={e => setFlight(prev => ({ ...prev, airline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Singapore Airlines"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number *</label>
              <input
                type="text"
                value={flight.flightNumber}
                onChange={e => setFlight(prev => ({ ...prev, flightNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., SQ123"
                required
              />
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Departure</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={flight.departure.code}
                  onChange={e => setFlight(prev => ({ ...prev, departure: { ...prev.departure, code: e.target.value } }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Code (SIN)"
                  required
                />
                <input
                  type="text"
                  value={flight.departure.airport}
                  onChange={e => setFlight(prev => ({ ...prev, departure: { ...prev.departure, airport: e.target.value } }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Airport"
                />
              </div>
              <input
                type="datetime-local"
                value={flight.departure.dateTime}
                onChange={e => setFlight(prev => ({ ...prev, departure: { ...prev.departure, dateTime: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Arrival</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={flight.arrival.code}
                  onChange={e => setFlight(prev => ({ ...prev, arrival: { ...prev.arrival, code: e.target.value } }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Code (NRT)"
                  required
                />
                <input
                  type="text"
                  value={flight.arrival.airport}
                  onChange={e => setFlight(prev => ({ ...prev, arrival: { ...prev.arrival, airport: e.target.value } }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Airport"
                />
              </div>
              <input
                type="datetime-local"
                value={flight.arrival.dateTime}
                onChange={e => setFlight(prev => ({ ...prev, arrival: { ...prev.arrival, dateTime: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <input
                type="text"
                value={flight.terminal}
                onChange={e => setFlight(prev => ({ ...prev, terminal: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Terminal"
              />
              <input
                type="text"
                value={flight.gate}
                onChange={e => setFlight(prev => ({ ...prev, gate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Gate"
              />
              <input
                type="text"
                value={flight.seat}
                onChange={e => setFlight(prev => ({ ...prev, seat: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Seat"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Reference</label>
              <input
                type="text"
                value={flight.bookingReference}
                onChange={e => setFlight(prev => ({ ...prev, bookingReference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., ABC123"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
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

const ItineraryFormModal: React.FC<ItineraryFormModalProps> = ({ onClose, onAdd }) => {
  const [item, setItem] = useState<Omit<ItineraryItem, 'id'>>({
    date: '',
    time: '',
    title: '',
    description: '',
    location: '',
    type: 'activity'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.date || !item.title) {
      alert('Please fill in all required fields');
      return;
    }

    onAdd({ ...item, id: generateId() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add Itinerary Item</h3>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={item.title}
                onChange={e => setItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Visit Senso-ji Temple"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={item.date}
                  onChange={e => setItem(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={item.time}
                  onChange={e => setItem(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={item.type}
                onChange={e => setItem(prev => ({ ...prev, type: e.target.value as ItineraryItem['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="activity">Activity</option>
                <option value="accommodation">Accommodation</option>
                <option value="transport">Transport</option>
                <option value="dining">Dining</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={item.location}
                onChange={e => setItem(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Asakusa, Tokyo"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={item.description}
                onChange={e => setItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Additional details..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
