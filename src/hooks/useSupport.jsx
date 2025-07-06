import { useState } from "react";
import useAxios from "./useAxios";

const useSupport = () => {
  const axiosSecure = useAxios();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new support ticket
  const createTicket = async (ticketData) => {
    try {
      setLoading(true);
      const res = await axiosSecure.post("/support", ticketData);
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get all support tickets (Admin only)
  const getAllTickets = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/support", { params: filters });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get user's tickets by email
  const getUserTickets = async (email) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/support", { params: { email } });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get single ticket by ID
  const getTicketById = async (id) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/support/${id}`);
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Update status (Admin)
  const updateTicketStatus = async (id, status) => {
    try {
      setLoading(true);
      const res = await axiosSecure.patch(`/admin/support/${id}/status`, {
        status,
      });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Update priority (Admin)
  const updateTicketPriority = async (id, priority) => {
    try {
      setLoading(true);
      const res = await axiosSecure.patch(`/admin/support/${id}/priority`, {
        priority,
      });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Add admin response (Admin)
  const addTicketResponse = async (id, response) => {
    try {
      setLoading(true);
      const res = await axiosSecure.post(`/admin/support/${id}/response`, {
        response,
      });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket (Admin)
  const deleteTicket = async (id) => {
    try {
      setLoading(true);
      const res = await axiosSecure.delete(`/admin/support/${id}`);
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get statistics (Admin)
  const getSupportStats = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/support-stats");
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get tickets by date range (Admin)
  const getTicketsByDateRange = async (startDate, endDate) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/support/date-range", {
        params: { startDate, endDate },
      });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTicket,
    getAllTickets,
    getUserTickets,
    getTicketById,
    updateTicketStatus,
    updateTicketPriority,
    addTicketResponse,
    deleteTicket,
    getSupportStats,
    getTicketsByDateRange,
  };
};

export default useSupport;
