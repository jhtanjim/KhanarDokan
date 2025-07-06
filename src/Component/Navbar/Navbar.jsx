import { Heart } from "lucide-react";
import { useContext, useState } from "react";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdClose, MdMenu } from "react-icons/md";
import { PiShoppingCartThin } from "react-icons/pi";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navBarMenu } from "../../../public/MocData/navdata.js";
import useCart from "../../hooks/useCart.jsx";
import { AuthContext } from "../../Provider/AuthProvider";
import { useShop } from "../../Provider/ShopProvider";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const [cart] = useCart();
  const { favoriteCount } = useShop();

  const handleLogout = () => {
    logOut().catch(console.error);
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = () =>
    navBarMenu.map((menu) => (
      <li key={menu.id}>
        <NavLink
          to={menu.link}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) =>
            `relative font-medium text-sm sm:text-base transition-all duration-300 block py-2 sm:py-0 ${
              isActive
                ? "text-primary font-semibold"
                : "text-gray-600 hover:text-primary"
            }`
          }
        >
          {menu.title}
          <span
            className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-all duration-300 ${
              location.pathname === menu.link
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
          />
        </NavLink>
      </li>
    ));

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo - Responsive */}
          <Link
            to="/"
            className="flex gap-1 items-center text-xl sm:text-2xl font-bold transition-transform hover:scale-105"
          >
            <IoRestaurantOutline className="text-primary" />
            <span className="text-gray-800">Khanar</span>
            <span className="text-secondary">Dokan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex">
            <ul className="flex list-none gap-6 xl:gap-8 items-center">
              {renderNavLinks()}
            </ul>
          </nav>

          {/* Right Side Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites - Responsive */}
            <Link
              to="/favourites"
              className="relative group text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-semibold animate-pulse">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </Link>

            {/* Cart - Responsive */}
            <Link to="/dashBoard/cart" className="relative group">
              <IconBtn
                icon={<PiShoppingCartThin className="h-5 w-5 sm:h-6 sm:w-6" />}
                className="text-gray-600 hover:text-primary"
              />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-bounce">
                  {cart.length > 99 ? "99+" : cart.length}
                </span>
              )}
            </Link>

            {/* Desktop User/Login */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="relative group">
                    <img
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/ZVFsg37/default-avatar.png"
                      }
                      alt="User Avatar"
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-200 hover:border-primary transition-all duration-300 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium hover:shadow-md">
                    Login
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-2xl sm:text-3xl p-1 rounded-lg hover:bg-gray-100 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <div className="relative">
                <MdMenu
                  className={`transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "rotate-90 opacity-0"
                      : "rotate-0 opacity-100"
                  }`}
                />
                <MdClose
                  className={`absolute top-0 left-0 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "rotate-0 opacity-100"
                      : "rotate-90 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      <div
        className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Mobile Navigation Links */}
          <nav>
            <ul className="flex flex-col gap-2 text-gray-700">
              {renderNavLinks()}
            </ul>
          </nav>

          {/* Mobile User Section */}
          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/ZVFsg37/default-avatar.png"
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-lg font-medium"
                >
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const IconBtn = ({ icon, className = "" }) => (
  <button
    className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-300 ${className}`}
  >
    {icon}
  </button>
);

export default Navbar;
