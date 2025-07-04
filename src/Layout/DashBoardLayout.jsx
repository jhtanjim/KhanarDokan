// DashBoardLayout.js
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashBoardSidebar from "../Pages/DashBoard/DashBoardSidebar/DashBoardSidebar";

const DashBoardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <DashBoardSidebar onClose={closeSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-orange-600 cursor-pointer transition-colors duration-200" />
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 cursor-pointer transition-colors duration-200">
                <span className="text-white font-medium text-sm">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
