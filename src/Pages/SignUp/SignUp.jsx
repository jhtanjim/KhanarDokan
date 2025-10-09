import { ChefHat, Lock, Mail, Phone, User } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";

export default function SignUp() {
  const { createUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;
    const acceptedTerms = form.terms.checked;
    const photo = form.photo.files[0];

    // Validation checks
    if (!acceptedTerms) {
      setIsLoading(false);
      Swal.fire("Oops!", "Please accept the terms and conditions.", "warning");
      return;
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      Swal.fire("Mismatch!", "Passwords do not match.", "error");
      return;
    }

    if (password.length < 6) {
      setIsLoading(false);
      Swal.fire(
        "Weak Password!",
        "Password must be at least 6 characters.",
        "error"
      );
      return;
    }

    try {
      // 1. Create user in Firebase
      const result = await createUser(email, password);
      console.log("User created in Firebase:", result.user.email);

      // 2. Handle photo upload if provided
      let photoURL = "";
      if (photo) {
        // For now, we'll use a placeholder. In production, upload to cloud storage
        photoURL = "https://via.placeholder.com/150";
      }

      // 3. Update user profile with name and photo
      await updateUserProfile(name, photoURL);
      console.log("User profile updated with name and photo");

      // 4. IMPORTANT: Wait a bit for Firebase to sync the profile update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 5. Send user info to backend
      const userInfo = {
        name: name,
        email: email,
        phone: phone || "",
        photoURL: photoURL,
        role: "user",
        createdAt: new Date().toISOString(), // Use ISO string for consistency
      };

      console.log("Sending user info to backend:", userInfo);

      try {
        const response = await axiosPublic.post("/users", userInfo);
        console.log("Backend response:", response.data);

        if (response.data.message === "user already exists") {
          console.log("User already exists in database, continuing...");
        } else if (response.data.insertedId) {
          console.log("User successfully created in database!");
        }
      } catch (backendError) {
        console.error("Backend user creation failed:", backendError);
        console.error("Error details:", backendError.response?.data);

        // Show a warning but don't block signup
        Swal.fire({
          title: "Warning",
          text: "Account created but profile sync failed. Please contact support if you experience issues.",
          icon: "warning",
          confirmButtonColor: "#D97706",
        });
      }

      setIsLoading(false);

      // Show success message and redirect
      Swal.fire({
        title: "Account Created!",
        text: "Welcome to Flavor Haven 🎉",
        icon: "success",
        confirmButtonText: "Go to Home",
        confirmButtonColor: "#D97706",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Signup error:", error);

      let errorMessage = "An error occurred during signup.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please login instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire("Signup Failed", errorMessage, "error");
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      console.log("Google sign-up successful:", user.email);

      if (user?.email && user.email.includes("@")) {
        const userInfo = {
          name: user?.displayName || "Google User",
          email: user?.email,
          photoURL: user?.photoURL || "",
          role: "user",
          createdAt: new Date().toISOString(),
        };

        console.log("Sending Google user info to backend:", userInfo);

        try {
          const response = await axiosPublic.post("/users", userInfo);
          console.log("Backend response:", response.data);
        } catch (backendError) {
          console.error("Backend user creation failed:", backendError);
          console.error("Error details:", backendError.response?.data);
        }
      }

      setIsLoading(false);

      Swal.fire({
        title: "Account Created!",
        text: "Welcome to Flavor Haven 🎉",
        icon: "success",
        confirmButtonText: "Go to Home",
        confirmButtonColor: "#D97706",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Google sign-up error:", error);

      let errorMessage = error.message;
      if (error.code === "auth/invalid-email") {
        errorMessage =
          "There was an issue with the email address. Please try again.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-up was cancelled. Please try again.";
      }

      Swal.fire("Error!", errorMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-amber-600 text-white rounded-full mb-4">
            <ChefHat size={32} />
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Flavor Haven</h1>
          <p className="text-amber-700 mt-2">Join our culinary community</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">
              Create Account
            </h2>

            {/* Google Sign-Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className={`w-full mb-6 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Signing up..." : "Sign up with Google"}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-amber-900"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-amber-900"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-amber-900"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                    <Phone size={18} />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-amber-900"
                >
                  Profile Photo (optional)
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  className="w-full text-sm text-amber-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-amber-900"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-amber-900"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-amber-700"
                >
                  I agree to the{" "}
                  <Link to="#" className="text-amber-600 hover:text-amber-500">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-amber-600 hover:text-amber-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                  isLoading
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                } text-white`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center mt-4">
                <p className="text-amber-700 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-amber-600 hover:text-amber-500 font-medium"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="bg-amber-100 p-4 text-center text-amber-800">
            <p className="text-sm font-medium">
              Join us for a delightful experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
