import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChefHat,
  Clock,
  Edit,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const AllReservation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Sample reservation data
  const reservations = [
    {
      id: "R001",
      customerName: "John Smith",
      email: "john@email.com",
      phone: "+1-555-0123",
      date: "2025-07-15",
      time: "7:00 PM",
      guests: 4,
      table: "Window View",
      status: "confirmed",
      special: "Anniversary dinner",
      created: "2025-07-01",
    },
    {
      id: "R002",
      customerName: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "+1-555-0124",
      date: "2025-07-15",
      time: "7:30 PM",
      guests: 2,
      table: "Private Booth",
      status: "pending",
      special: "Birthday celebration",
      created: "2025-07-01",
    },
    {
      id: "R003",
      customerName: "Michael Brown",
      email: "michael@email.com",
      phone: "+1-555-0125",
      date: "2025-07-16",
      time: "6:00 PM",
      guests: 6,
      table: "Chef's Table",
      status: "confirmed",
      special: "Business dinner",
      created: "2025-07-01",
    },
    {
      id: "R004",
      customerName: "Emily Davis",
      email: "emily@email.com",
      phone: "+1-555-0126",
      date: "2025-07-16",
      time: "8:00 PM",
      guests: 3,
      table: "Garden Terrace",
      status: "cancelled",
      special: "",
      created: "2025-06-30",
    },
    {
      id: "R005",
      customerName: "David Wilson",
      email: "david@email.com",
      phone: "+1-555-0127",
      date: "2025-07-17",
      time: "6:30 PM",
      guests: 5,
      table: "Window View",
      status: "confirmed",
      special: "Family dinner",
      created: "2025-07-01",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
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
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || reservation.status === filterStatus;
    const matchesDate = !filterDate || reservation.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Reservation Management
            </h1>
          </div>
          <p className="text-gray-600">Manage all restaurant reservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold text-gray-800">
                  {reservations.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {reservations.filter((r) => r.status === "confirmed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reservations.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reservations.reduce((sum, r) => sum + r.guests, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Reservation
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Details
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-800">
                          {reservation.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {reservation.created}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-800">
                          {reservation.customerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {reservation.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {reservation.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800">
                          {reservation.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800">
                          {reservation.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800">
                          {reservation.guests} guests
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800">
                          {reservation.table}
                        </span>
                      </div>
                      {reservation.special && (
                        <div className="text-sm text-blue-600 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {reservation.special}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {getStatusIcon(reservation.status)}
                        {reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500">
          <p>
            Showing {filteredReservations.length} of {reservations.length}{" "}
            reservations
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllReservation;
