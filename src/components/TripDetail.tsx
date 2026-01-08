import React from 'react';
import { ArrowLeft, Edit2, Trash2, MapPin, Calendar, Plane, List } from 'lucide-react';
import { useTripStore } from '../store';
import { formatDate, formatDateTime } from '../utils';

export const TripDetail: React.FC = () => {
  const { selectedTrip, setView, deleteTrip } = useTripStore();
  
  if (!selectedTrip) return null;
  
  const handleBack = () => {
    setView('list');
  };
  
  const handleEdit = () => {
    setView('edit');
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${selectedTrip.destination}"?`)) {
      deleteTrip(selectedTrip.id);
    }
  };
  
  const sortedItinerary = [...selectedTrip.itinerary].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  const getTypeColor = (type: string) => {
    const colors = {
      activity: 'bg-blue-100 text-blue-800',
      accommodation: 'bg-purple-100 text-purple-800',
      transport: 'bg-green-100 text-green-800',
      dining: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {selectedTrip.imageUrl && (
        <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative">
          <img
            src={selectedTrip.imageUrl}
            alt={selectedTrip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      )}
      {!selectedTrip.imageUrl && (
        <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600"></div>
      )}
      
      <div className="sticky top-0 bg-transparent z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="bg-white rounded-full p-2 shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-white rounded-full p-2 shadow-md"
            >
              <Edit2 className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white rounded-full p-2 shadow-md"
            >
              <Trash2 className="w-6 h-6 text-red-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-4 -mt-16 relative z-0">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedTrip.destination}
          </h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}</span>
          </div>
          
          {selectedTrip.description && (
            <p className="text-gray-600">{selectedTrip.description}</p>
          )}
        </div>
        
        {selectedTrip.flights.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Plane className="w-6 h-6 mr-2 text-blue-600" />
              Flights
            </h2>
            
            <div className="space-y-4">
              {selectedTrip.flights.map(flight => (
                <div key={flight.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800">
                      {flight.airline} {flight.flightNumber}
                    </span>
                    {flight.bookingReference && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {flight.bookingReference}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Departure</div>
                      <div className="font-medium">{flight.departure.code}</div>
                      <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                      <div className="text-sm text-gray-600">{formatDateTime(flight.departure.dateTime)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Arrival</div>
                      <div className="font-medium">{flight.arrival.code}</div>
                      <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                      <div className="text-sm text-gray-600">{formatDateTime(flight.arrival.dateTime)}</div>
                    </div>
                  </div>
                  
                  {(flight.terminal || flight.gate || flight.seat) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-4 text-sm text-gray-600">
                      {flight.terminal && <span>Terminal: {flight.terminal}</span>}
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <List className="w-6 h-6 mr-2 text-purple-600" />
              Itinerary
            </h2>
            
            <div className="space-y-3">
              {sortedItinerary.map((item) => (
                <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="text-sm text-gray-500">
                        {formatDate(item.date)}
                        {item.time && ` • ${item.time}`}
                      </div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  {item.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                  )}
                  
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
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
