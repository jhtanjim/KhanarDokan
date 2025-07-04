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
            `relative font-semibold transition-all duration-300 ${
              isActive ? "text-primary" : "hover:text-primary"
            }`
          }
        >
          {menu.title}
          <span
            className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-opacity duration-300 ${
              location.pathname === menu.link ? "opacity-100" : "opacity-0"
            }`}
          />
        </NavLink>
      </li>
    ));

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex gap-1 items-center text-2xl font-bold">
          <IoRestaurantOutline />
          <span>Khanar</span>
          <span className="text-secondary">Dokan</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="list-none hidden md:flex gap-8 items-center text-gray-600">
          {renderNavLinks()}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Favorites */}
          <Link
            to="/favourites"
            className="relative text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition duration-300"
          >
            <Heart className="h-6 w-6" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/dashBoard/cart" className="relative">
            <IconBtn icon={<PiShoppingCartThin />} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* User/Login */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <img
                src={
                  user?.photoURL ||
                  "https://i.ibb.co/ZVFsg37/default-avatar.png"
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full border"
              />
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-primary"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-block">
              <button className="border border-primary text-primary px-4 py-1 rounded hover:bg-primary hover:text-white">
                Login
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-3xl"
          >
            {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t">
          <ul className="flex flex-col gap-4 text-gray-700">
            {renderNavLinks()}
          </ul>

          {user ? (
            <div className="mt-4 flex items-center gap-3">
              <img
                src={
                  user?.photoURL ||
                  "https://i.ibb.co/ZVFsg37/default-avatar.png"
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full border"
              />
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-primary w-full"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white duration-200"
              >
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

// Reusable Icon Button
const IconBtn = ({ icon }) => (
  <button className="text-2xl p-2 rounded-full hover:bg-primary hover:text-white transition">
    {icon}
  </button>
);

export default Navbar;
