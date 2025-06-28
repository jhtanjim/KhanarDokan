import React from 'react';
import { Outlet } from 'react-router-dom';
import DashBoardSidebar from '../Pages/DashBoard/DashBoardSidebar/DashBoardSidebar';
import { ShoppingBag } from 'lucide-react';

const DashBoardLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <DashBoardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                          <ShoppingBag/>
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">U</span>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashBoardLayout;