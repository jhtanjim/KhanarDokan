import { ChefHat, Mail, Lock } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../../Provider/AuthProvider'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Login() {

const {signIn}=useContext(AuthContext)

const navigate = useNavigate();

const handleLogin = (event) => {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;

  signIn(email, password)
    .then(result => {
      const user = result.user;
      console.log(user);

      // ✅ Show success modal
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome back to Flavor Haven 🍽️",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#D97706", // amber-600
      }).then(() => {
        navigate("/"); // Redirect to homepage
      });
    })
    .catch(error => {
      console.error(error);
      Swal.fire("Login Failed", error.message, "error");
    });
};

    
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-amber-600 text-white rounded-full mb-4">
            <ChefHat size={32} />
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Flavor Haven</h1>
          <p className="text-amber-700 mt-2">Welcome back, food lover</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-amber-900">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-600">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name='email'
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-600">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    name='password'
                    className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-amber-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out">
                Login
              </button>

              <div className="text-center mt-4">
                <p className="text-amber-700 text-sm">
                  Don't have an account?{" "}
                  <a href="/signUp" className="text-amber-600 hover:text-amber-500 font-medium">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Decorative Footer */}
          <div className="bg-amber-100 p-4 text-center text-amber-800">
            <p className="text-sm font-medium">Taste the extraordinary</p>
          </div>
        </div>
      </div>
    </div>
  )
}
