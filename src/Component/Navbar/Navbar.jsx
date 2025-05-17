import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IoRestaurantOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { PiShoppingCartThin } from 'react-icons/pi';
import { MdMenu, MdClose } from 'react-icons/md';
import { AuthContext } from '../../Provider/AuthProvider';
import { navBarMenu } from '../../../public/MocData/navdata.js';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logOut().catch(console.error);
  };

  const renderNavLinks = () =>
    navBarMenu.map((menu) => (
      <li key={menu.id}>
        <NavLink
          to={menu.link}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) =>
            `relative font-semibold transition-all duration-300 ${
              isActive ? 'text-primary' : 'hover:text-primary'
            }`
          }
        >
          {menu.title}
          <span
            className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-opacity duration-300 ${
              location.pathname === menu.link ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </NavLink>
      </li>
    ));

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center py-4 relative">
        {/* Logo */}
        <Link to="/" className="flex gap-1 items-center text-2xl font-bold">
          <IoRestaurantOutline />
          <span>Khanar</span>
          <span className="text-secondary">Dokan</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center text-gray-600">{renderNavLinks()}</ul>

        {/* Right Icons / Auth */}
        <div className="flex items-center gap-2">
          <IconBtn icon={<CiSearch />} />
          <IconBtn icon={<PiShoppingCartThin />} />

          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={user?.photoURL || 'https://i.ibb.co/ZVFsg37/default-avatar.png'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border"
              />
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-primary">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="border border-primary text-primary px-4 py-1 rounded hover:bg-primary hover:text-white">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden transition-transform duration-300"
        >
          {isMobileMenuOpen ? <MdClose className="text-4xl" /> : <MdMenu className="text-4xl" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 z-50 md:hidden">
            <ul className="flex flex-col gap-4 text-gray-600">{renderNavLinks()}</ul>

            {!user && (
              <Link to="/login">
                <button className="w-full mt-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white duration-200">
                  Login
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 Reusable icon button
const IconBtn = ({ icon }) => (
  <button className="text-2xl p-2 rounded-full hover:bg-primary hover:text-white transition">
    {icon}
  </button>
);

export default Navbar;
