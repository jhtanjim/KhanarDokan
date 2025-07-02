import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Phone,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useReservation from "../../hooks/useReservation";

// Reservation Create Component

// User Reservations Component
const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const { getUserReservations, cancelReservation, loading, error } =
    useReservation();
  const { user } = useAuth();
  useEffect(() => {
    // Get user email from localStorage or context
    const email = user.email || "user@example.com";
    setUserEmail(email);
    fetchReservations(email);
  }, []);

  const fetchReservations = async (email) => {
    try {
      const data = await getUserReservations(email);
      setReservations(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await cancelReservation(id, userEmail);
        fetchReservations(userEmail);
      } catch (err) {
        console.error("Error cancelling reservation:", err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        My Reservations
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reservations found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-800">
                    {reservation.reservationId}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {getStatusIcon(reservation.status)}
                    {reservation.status}
                  </span>
                </div>
                {reservation.status === "pending" && (
                  <button
                    onClick={() => handleCancel(reservation._id)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Date:</span>{" "}
                    {reservation.date}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Time:</span>{" "}
                    {reservation.time}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Guests:</span>{" "}
                    {reservation.guests}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Name:</span>{" "}
                    {reservation.customerName}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Phone:</span>{" "}
                    {reservation.phone}
                  </p>
                  {reservation.table && (
                    <p className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">Table:</span>{" "}
                      {reservation.table}
                    </p>
                  )}
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Special Requests:</span>{" "}
                    {reservation.specialRequests}
                  </p>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Created: {new Date(reservation.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Reservations;
