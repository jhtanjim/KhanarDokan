import {
  BookOpen,
  Calendar,
  ClipboardList,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  ShoppingCart,
  Table,
  User,
  Users,
} from "lucide-react";
import { useContext } from "react";
import { MdReviews } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAdmin from "../../../hooks/useAdmin";
import useSuperAdmin from "../../../hooks/useSuperAdmin";
const DashBoardSidebar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);
  console.log(user);
  // Get actual admin status from hooks
  const [isAdmin, isAdminLoading] = useAdmin();
  const [isSuperAdmin, isSuperAdminLoading] = useSuperAdmin();

  // Show loading if still checking permissions
  if (isAdminLoading || isSuperAdminLoading) {
    return (
      <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white shadow-lg z-50">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  // 🚪 Logout handler
  const handleLogout = () => {
    logOut().catch(console.error);
  };

  // 🟧 Shared menu (everyone sees)
  const sharedMenuItems = [
    {
      path: "/",
      icon: <Home className="w-5 h-5" />,
      label: "Home",
    },
    {
      path: "/menu",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Our Menu",
    },
  ];

  // 🛠️ Admin-only menu (both admin and super admin can see)
  const adminOnlyMenuItems = [
    {
      path: "/dashboard/allUsers",
      icon: <Users className="w-5 h-5" />,
      label: "All Users",
    },
    {
      path: "/dashboard/allReviews",
      icon: <MdReviews className="w-5 h-5" />,
      label: "All Reviews",
    },
    {
      path: "/dashboard/allReservations",
      icon: <Calendar className="w-5 h-5" />,
      label: "All Reservations",
    },
    {
      path: "/dashboard/allOrders",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "All Orders",
    },
    {
      path: "/dashboard/menuForm",
      icon: <Menu className="w-5 h-5" />,
      label: "Add Menu",
    },
    {
      path: "/dashboard/supportList",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Support List",
    },
  ];

  // 🔒 Super Admin only menu
  const superAdminOnlyMenuItems = [
    {
      path: "/dashboard/adminManagement",
      icon: <Shield className="w-5 h-5" />,
      label: "Admin Management",
    },
    {
      path: "/dashboard/systemSettings",
      icon: <Settings className="w-5 h-5" />,
      label: "System Settings",
    },
  ];

  // 🧾 Regular user menu
  const userOnlyMenuItems = [
    {
      path: "/dashboard/profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
    },
    {
      path: "/dashboard/cart",
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Cart",
    },
    {
      path: "/dashboard/orders",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "Order History",
    },
    {
      path: "/dashboard/reservations",
      icon: <Table className="w-5 h-5" />,
      label: "Reservations",
    },
    {
      path: "/dashboard/favorites",
      icon: <Heart className="w-5 h-5" />,
      label: "Favorites",
    },

    // {
    //   path: "/dashboard/payment-methods",
    //   icon: <CreditCard className="w-5 h-5" />,
    //   label: "Payment Methods",
    // },
    // {
    //   path: "/dashboard/notifications",
    //   icon: <Bell className="w-5 h-5" />,
    //   label: "Notifications",
    // },
    // {
    //   path: "/dashboard/settings",
    //   icon: <Settings className="w-5 h-5" />,
    //   label: "Settings",
    // },
    {
      path: "/dashboard/support",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Support",
    },
  ];

  // 🔄 Combined visible items based on role
  const menuItems = [
    ...sharedMenuItems,
    // Super admins see everything
    ...(isSuperAdmin
      ? [...adminOnlyMenuItems, ...superAdminOnlyMenuItems]
      : []),
    // Regular admins see admin items but not super admin items
    ...(isAdmin && !isSuperAdmin ? adminOnlyMenuItems : []),
    // All users see user items (admins are also users)
    ...userOnlyMenuItems,
  ];

  // Get role display text
  const getRoleDisplay = () => {
    if (isSuperAdmin) return "Super Admin";
    if (isAdmin) return "Admin";
    return "User";
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (isSuperAdmin) return "bg-purple-100 text-purple-800";
    if (isAdmin) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white shadow-lg z-50">
      {/* Logo/Brand */}
      <Link to={"/dashboard"}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-orange-600">
            Restaurant Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
        </div>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group ${
                    isActive
                      ? "bg-orange-100 text-orange-700 border-r-4 border-orange-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {/* User Profile Section */}
        <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            {/* Role Badge */}
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getRoleBadgeColor()}`}
            >
              {getRoleDisplay()}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashBoardSidebar;
