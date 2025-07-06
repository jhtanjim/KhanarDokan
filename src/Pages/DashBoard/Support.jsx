import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useSupport from "../../hooks/useSupport";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    priority: "medium",
    message: "",
  });
  const [notification, setNotification] = useState(null);

  const { user } = useAuth();
  const {
    loading,
    error,
    createTicket,
    getUserTickets, // Updated to match the hook
    clearError,
  } = useSupport();

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

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  const statusConfig = {
    open: { icon: Clock, color: "bg-blue-100 text-blue-800", label: "Open" },
    "in-progress": {
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-800",
      label: "In Progress",
    },
    resolved: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
      label: "Resolved",
    },
    closed: {
      icon: CheckCircle,
      color: "bg-gray-100 text-gray-800",
      label: "Closed",
    },
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        name: user.name || "",
      }));
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) {
        showNotification("Please log in to view tickets", "error");
        return;
      }

      const data = await getUserTickets(userEmail);
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      showNotification("Failed to load tickets", "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.category ||
      !formData.message
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      await createTicket(formData);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        subject: "",
        category: "",
        priority: "medium",
        message: "",
      });
      setShowCreateForm(false);
      showNotification("Support ticket created successfully!");
      await fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      showNotification(
        error?.response?.data?.message || "Failed to create ticket",
        "error"
      );
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

  const getPriorityBadge = (priority) => {
    const config = priorities.find((p) => p.value === priority);
    return config ? config : priorities[1];
  };

  const getStatusIcon = (status) => {
    const config = statusConfig[status];
    return config ? config : statusConfig.open;
  };

  // Clear error when component mounts or error changes
  useEffect(() => {
    if (error) {
      showNotification(
        error?.response?.data?.message || "An error occurred",
        "error"
      );
      if (clearError) {
        clearError();
      }
    }
  }, [error, clearError]);

  // Notification component
  const NotificationBanner = ({ notification, onClose }) => {
    if (!notification) return null;

    const bgColor =
      notification.type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-green-50 border-green-200";
    const textColor =
      notification.type === "error" ? "text-red-800" : "text-green-800";

    return (
      <div
        className={`fixed top-4 right-4 z-50 ${bgColor} border rounded-lg p-4 max-w-sm shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <p className={`${textColor} font-medium`}>{notification.message}</p>
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 ml-2`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <NotificationBanner
          notification={notification}
          onClose={() => setNotification(null)}
        />

        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Support
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Support Ticket
          </h1>
          <p className="text-gray-600">
            Fill out the form below to get help with your issue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue in detail..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedTicket) {
    const statusInfo = getStatusIcon(selectedTicket.status);
    const StatusIcon = statusInfo.icon;
    const priorityInfo = getPriorityBadge(selectedTicket.priority);

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <NotificationBanner
          notification={notification}
          onClose={() => setNotification(null)}
        />

        <div className="mb-6">
          <button
            onClick={() => setSelectedTicket(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Support
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Ticket #{selectedTicket.ticketId}
              </h1>
              <p className="text-xl text-gray-600">{selectedTicket.subject}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
              >
                <StatusIcon className="w-4 h-4 inline mr-1" />
                {statusInfo.label}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${priorityInfo.color}`}
              >
                {priorityInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Original Message
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedTicket.message}
              </p>
            </div>

            {selectedTicket.responses &&
              selectedTicket.responses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Responses
                  </h3>
                  {selectedTicket.responses.map((response, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-blue-800">
                          Support Team
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
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Category:
                  </span>
                  <p className="text-gray-800">{selectedTicket.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Created:
                  </span>
                  <p className="text-gray-800">
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Last Updated:
                  </span>
                  <p className="text-gray-800">
                    {formatDate(selectedTicket.updatedAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Contact:
                  </span>
                  <p className="text-gray-800">{selectedTicket.email}</p>
                  {selectedTicket.phone && (
                    <p className="text-gray-800">{selectedTicket.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <NotificationBanner
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Support Center
        </h1>
        <p className="text-gray-600">
          Get help with your orders, account, and more
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Your Support Tickets
          </h2>
          <p className="text-gray-600">
            Track and manage your support requests
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Create New Ticket
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Support Tickets
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't created any support tickets yet.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create Your First Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const statusInfo = getStatusIcon(ticket.status);
            const StatusIcon = statusInfo.icon;
            const priorityInfo = getPriorityBadge(ticket.priority);

            return (
              <div
                key={ticket._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      #{ticket.ticketId}
                    </h3>
                    <p className="text-sm text-gray-500">{ticket.category}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {statusInfo.label}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}
                    >
                      {priorityInfo.label}
                    </span>
                  </div>
                </div>

                <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                  {ticket.subject}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {ticket.message}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Created: {formatDate(ticket.createdAt)}</span>
                  {ticket.responses && ticket.responses.length > 0 && (
                    <span className="text-blue-600">
                      {ticket.responses.length} response
                      {ticket.responses.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Support;
