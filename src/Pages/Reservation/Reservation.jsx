import { Calendar, ChefHat, Clock, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedGuests, setSelectedGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState("");

  const timeSlots = [
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];
  const tableTypes = [
    { id: "window", name: "Window View", icon: "🌅", premium: false },
    { id: "private", name: "Private Booth", icon: "🥂", premium: true },
    { id: "chef", name: "Chef's Table", icon: "👨‍🍳", premium: true },
    { id: "garden", name: "Garden Terrace", icon: "🌿", premium: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Make a Reservation
          </h1>
          <p className="text-lg text-gray-600">
            Book your table at Lumière Bistro
          </p>
        </div>

        {/* Main reservation card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left side - Form */}
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  Choose Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Selection */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  Party Size
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedGuests(Math.max(1, selectedGuests - 1))
                    }
                    className="w-10 h-10 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {selectedGuests}
                    </div>
                    <div className="text-gray-600">
                      Guest{selectedGuests !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedGuests(Math.min(12, selectedGuests + 1))
                    }
                    className="w-10 h-10 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Table Selection & Details */}
            <div className="space-y-6">
              {/* Table Selection */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Table Preference
                </label>
                <div className="space-y-2">
                  {tableTypes.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedTable === table.id
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{table.icon}</span>
                          <div>
                            <div className="text-gray-800 font-medium flex items-center gap-2">
                              {table.name}
                              {table.premium && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            {table.premium && (
                              <div className="text-yellow-600 text-sm">
                                Premium Experience
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedTable === table.id && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Restaurant Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <ChefHat className="w-6 h-6 text-orange-500" />
                  <h3 className="text-gray-800 font-bold text-lg">
                    Lumière Bistro
                  </h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>5.0 • Michelin Starred</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Downtown • Fine Dining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reserve Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg transition-colors">
              Reserve Your Table
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500">
          <p>
            Experience culinary excellence • Reservations confirmed instantly
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
