import {
  AlertCircle,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Mail,
  MessageCircle,
  MessageSquare,
  Minus,
  Phone,
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSupport from "../../hooks/useSupport";

const SupportList = () => {
  const {
    loading,
    error,
    getAllTickets,
    updateTicketStatus,
    updateTicketPriority,
    addTicketResponse,
    getSupportStats,
  } = useSupport();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });

  const statusConfig = {
    open: {
      icon: Clock,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: "Open",
    },
    "in-progress": {
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: "In Progress",
    },
    resolved: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Resolved",
    },
    closed: {
      icon: CheckCircle,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Closed",
    },
  };

  const priorities = [
    {
      value: "low",
      label: "Low",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: ArrowDownCircle,
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Minus,
    },
    {
      value: "high",
      label: "High",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: ArrowUpCircle,
    },
    {
      value: "urgent",
      label: "Urgent",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertTriangle,
    },
  ];

  const categories = [
    "Order Issues",
    "Payment Problems",
    "Account Issues",
    "Technical Support",
    "Reservation Problems",
    "Food Quality",
    "Delivery Issues",
    "General Inquiry",
    "Other",
  ];

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      const filterParams = {};
      if (filters.status !== "all") filterParams.status = filters.status;
      if (filters.priority !== "all") filterParams.priority = filters.priority;
      if (filters.search) filterParams.search = filters.search;

      const data = await getAllTickets(filterParams);
      if (data) {
        setTickets(data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getSupportStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (result) {
        fetchTickets();
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Error updating ticket status:", err);
    }
  };

  const handleUpdateTicketPriority = async (ticketId, newPriority) => {
    try {
      const result = await updateTicketPriority(ticketId, newPriority);
      if (result) {
        fetchTickets();
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({ ...selectedTicket, priority: newPriority });
        }
      }
    } catch (err) {
      console.error("Error updating ticket priority:", err);
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    if (!responseMessage.trim()) return;

    try {
      const result = await addTicketResponse(
        selectedTicket._id,
        responseMessage
      );
      if (result) {
        setResponseMessage("");
        setShowResponseModal(false);
        fetchTickets();

        // Update selected ticket with new response
        const updatedResponses = [
          ...(selectedTicket.responses || []),
          {
            message: responseMessage,
            respondedBy: localStorage.getItem("userEmail"),
            respondedAt: new Date(),
          },
        ];
        setSelectedTicket({
          ...selectedTicket,
          responses: updatedResponses,
          status: "in-progress",
        });
      }
    } catch (err) {
      console.error("Error sending response:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityInfo = (priority) => {
    return priorities.find((p) => p.value === priority) || priorities[1];
  };

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.open;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Show error message if there's an error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">
              Error loading support tickets. Please try again.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTicket) {
    const statusInfo = getStatusInfo(selectedTicket.status);
    const StatusIcon = statusInfo.icon;
    const priorityInfo = getPriorityInfo(selectedTicket.priority);
    const PriorityIcon = priorityInfo.icon;

    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => setSelectedTicket(null)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Support List
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Ticket #{selectedTicket.ticketId}
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                {selectedTicket.subject}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>{selectedTicket.name}</span>
                <span>•</span>
                <Mail className="w-4 h-4" />
                <span>{selectedTicket.email}</span>
                {selectedTicket.phone && (
                  <>
                    <span>•</span>
                    <Phone className="w-4 h-4" />
                    <span>{selectedTicket.phone}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex flex-col space-y-2">
                <select
                  value={selectedTicket.status}
                  onChange={(e) =>
                    handleUpdateTicketStatus(selectedTicket._id, e.target.value)
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}
                  disabled={loading}
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedTicket.priority}
                  onChange={(e) =>
                    handleUpdateTicketPriority(
                      selectedTicket._id,
                      e.target.value
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityInfo.color}`}
                  disabled={loading}
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowResponseModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                disabled={loading}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Respond
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Original Message
                </h3>
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {selectedTicket.category}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedTicket.message}
                </p>
              </div>

              {selectedTicket.responses &&
                selectedTicket.responses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Responses ({selectedTicket.responses.length})
                    </h3>
                    {selectedTicket.responses.map((response, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-blue-800">
                            {response.respondedBy || "Support Team"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(response.respondedAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ticket Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Status:
                    </span>
                    <div
                      className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {statusInfo.label}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Priority:
                    </span>
                    <div
                      className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${priorityInfo.color}`}
                    >
                      <PriorityIcon className="w-4 h-4 mr-1" />
                      {priorityInfo.label}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Category:
                    </span>
                    <p className="text-gray-800 mt-1">
                      {selectedTicket.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Created:
                    </span>
                    <p className="text-gray-800 mt-1">
                      {formatDate(selectedTicket.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Last Updated:
                    </span>
                    <p className="text-gray-800 mt-1">
                      {formatDate(selectedTicket.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Modal */}
        {showResponseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Respond to Ticket</h3>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleResponse}>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Type your response here..."
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  required
                  disabled={loading}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResponseModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                    disabled={loading || !responseMessage.trim()}
                  >
                    {loading ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Response
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Support Management
            </h1>
            <p className="text-gray-600">
              Manage and respond to customer support tickets
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.openTickets || 0}
              </div>
              <div className="text-sm text-gray-500">Open Tickets</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {stats?.urgentTickets || 0}
              </div>
              <div className="text-sm text-gray-500">Urgent</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalTickets}
                  </div>
                  <div className="text-sm text-gray-600">Total Tickets</div>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.statusCounts.find((s) => s._id === "in-progress")
                      ?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.statusCounts.find((s) => s._id === "resolved")
                      ?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {stats.statusCounts.find((s) => s._id === "closed")
                      ?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Closed</div>
                </div>
                <X className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="all">All Priority</option>
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Support Tickets Found
            </h3>
            <p className="text-gray-600">
              No tickets match your current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const statusInfo = getStatusInfo(ticket.status);
                  const StatusIcon = statusInfo.icon;
                  const priorityInfo = getPriorityInfo(ticket.priority);
                  const PriorityIcon = priorityInfo.icon;

                  return (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{ticket.ticketId}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {ticket.subject}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}
                        >
                          <PriorityIcon className="w-3 h-3 inline mr-1" />
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-blue-600 hover:text-blue-900 flex items-center disabled:opacity-50"
                          disabled={loading}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportList;
