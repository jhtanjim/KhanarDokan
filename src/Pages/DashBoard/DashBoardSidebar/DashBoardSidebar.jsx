import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    Home, 
    BookOpen, 
    User, 
    ShoppingCart, 
    ClipboardList, 
    Calendar, 
    Heart, 
    MapPin, 
    CreditCard, 
    Bell, 
    Settings, 
    HelpCircle, 
    LogOut 
} from 'lucide-react';
import { AuthContext } from '../../../Provider/AuthProvider';

const DashBoardSidebar = () => {
    const navigate = useNavigate();
const {user,logOut}=useContext(AuthContext)
console.log(user)
      const handleLogout = () => {
    logOut().catch(console.error);
  };


    const menuItems = [
        {
            path: '/',
            icon: <Home className="w-5 h-5" />,
            label: 'Home',
        },
        {
            path: '/menu',
            icon: <BookOpen className="w-5 h-5" />,
            label: 'Our Menu',
        },
        {
            path: '/dashboard/profile',
            icon: <User className="w-5 h-5" />,
            label: 'Profile',
        },
        {
            path: '/dashboard/cart',
            icon: <ShoppingCart className="w-5 h-5" />,
            label: 'Cart',
        },
        {
            path: '/dashboard/orders',
            icon: <ClipboardList className="w-5 h-5" />,
            label: 'Order History',
        },
        {
            path: '/dashboard/reservations',
            icon: <Calendar className="w-5 h-5" />,
            label: 'Reservations',
        },
        {
            path: '/dashboard/favorites',
            icon: <Heart className="w-5 h-5" />,
            label: 'Favorites',
        },
        {
            path: '/dashboard/addresses',
            icon: <MapPin className="w-5 h-5" />,
            label: 'Addresses',
        },
        {
            path: '/dashboard/payment-methods',
            icon: <CreditCard className="w-5 h-5" />,
            label: 'Payment Methods',
        },
        {
            path: '/dashboard/notifications',
            icon: <Bell className="w-5 h-5" />,
            label: 'Notifications',
        },
        {
            path: '/dashboard/settings',
            icon: <Settings className="w-5 h-5" />,
            label: 'Settings',
        },
        {
            path: '/dashboard/support',
            icon: <HelpCircle className="w-5 h-5" />,
            label: 'Support',
            
        }
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white shadow-lg z-50">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-orange-600">Restaurant Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
            </div>
            
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
                                            ? 'bg-orange-100 text-orange-700 border-r-4 border-orange-500'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                                    }`
                                }
                            >
                                <span className="mr-3">{item.icon}</span>
                                <div className="flex-1">
                                    <span className="font-medium">{item.label}</span>
                                    <p className="text-xs text-gray-500 group-hover:text-gray-600">
                                        {item.description}
                                    </p>
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
                        <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
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