import { ChefHat, Mail, Lock, User, Phone } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";

export default function SignUp() {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    const form = event.target;

    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;
    const acceptedTerms = form.terms.checked;
    const photo = form.photo.files[0];

    if (!acceptedTerms) {
      Swal.fire("Oops!", "Please accept the terms and conditions.", "warning");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Mismatch!", "Passwords do not match.", "error");
      return;
    }

    try {
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      const photoURL = photo ? URL.createObjectURL(photo) : "";

      await updateUserProfile(name, photoURL);

      form.reset();

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
      console.error("Error creating user:", error.message);
      Swal.fire("Error!", error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-amber-600 text-white rounded-full mb-4">
            <ChefHat size={32} />
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Flavor Haven</h1>
          <p className="text-amber-700 mt-2">Join our culinary community</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">Create Account</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-amber-900">
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
                <label htmlFor="email" className="block text-sm font-medium text-amber-900">
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
                <label htmlFor="phone" className="block text-sm font-medium text-amber-900">
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
                <label htmlFor="photo" className="block text-sm font-medium text-amber-900">
                  Profile Photo (optional)
                </label>
                <input type="file" id="photo" name="photo" accept="image/*" />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-amber-900">
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
                <label htmlFor="confirm-password" className="block text-sm font-medium text-amber-900">
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
                <label htmlFor="terms" className="ml-2 block text-sm text-amber-700">
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

              {/* Submit */}
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out">
                Create Account
              </button>

              <div className="text-center mt-4">
                <p className="text-amber-700 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-amber-600 hover:text-amber-500 font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-amber-100 p-4 text-center text-amber-800">
            <p className="text-sm font-medium">Join us for a delightful experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
