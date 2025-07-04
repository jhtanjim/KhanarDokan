"use client";
import axios from "axios";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://khanar-dokan-server.vercel.app/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    setDeleteLoading(reviewToDelete._id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://khanar-dokan-server.vercel.app/reviews/${reviewToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted review from state
      setReviews(reviews.filter((review) => review._id !== reviewToDelete._id));
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">All Reviews</h1>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading reviews...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reviews available yet.</p>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {review.name}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="text-yellow-400 text-xl">
                    {"★".repeat(review.rating)}
                  </div>
                  <div className="text-gray-300 text-xl">
                    {"★".repeat(5 - review.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({review.rating}/5)
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteClick(review)}
                disabled={deleteLoading === review._id}
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Review"
              >
                {deleteLoading === review._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="ml-2 text-sm font-medium">Delete</span>
              </button>
            </div>

            <p className="text-gray-700 leading-relaxed">{review.details}</p>

            {review.createdAt && (
              <p className="text-sm text-gray-500 mt-3">
                Posted on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Delete Review
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review by{" "}
              <span className="font-medium">{reviewToDelete?.name}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
