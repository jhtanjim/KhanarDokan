import { Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";

const Reviews = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    details: "",
    rating: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (star) => {
    setFormData((prev) => ({
      ...prev,
      rating: star,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post("/reviews", formData);
      Swal.fire("Success", "Your review has been submitted", "success");
      navigate("/");
    } catch (error) {
      console.error("Failed to submit review:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Add Your Review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Write your review..."
          required
          rows="5"
          className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div>
          <label className="block text-lg font-medium mb-2">Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`w-7 h-7 cursor-pointer transition-all ${
                  star <= formData.rating
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Reviews;
