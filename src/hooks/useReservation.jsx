// Custom hook for reservation API calls
import { useState } from "react";

const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://khanar-dokan-server.vercel.app/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create reservation");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getUserReservations = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://khanar-dokan-server.vercel.app/reservations?email=${email}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const cancelReservation = async (id, email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://khanar-dokan-server.vercel.app/reservations/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getAllReservations = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);
      if (filters.search) params.append("search", filters.search);

      const token = localStorage.getItem("access-token");
      const response = await fetch(
        `https://khanar-dokan-server.vercel.app/admin/reservations?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const updateReservationStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access-token");
      const response = await fetch(
        `https://khanar-dokan-server.vercel.app/admin/reservations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const deleteReservation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access-token");
      const response = await fetch(
        `https://khanar-dokan-server.vercel.app/admin/reservations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    createReservation,
    getUserReservations,
    cancelReservation,
    getAllReservations,
    updateReservationStatus,
    deleteReservation,
  };
};
export default useReservation;
