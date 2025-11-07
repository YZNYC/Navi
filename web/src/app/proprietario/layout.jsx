"use client";

import { useState } from "react";
import Navbar from "../../../src/components/layout/navbar/Navbar";
import Sidebar from "../../../src/components/layout/sidebar/Sidebar";

export default function DashboardLayout({ children }) {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-screen bg-white dark:bg-slate-900">
            <Navbar onToggleSidebar={handleToggleSidebar} />
            
            <div className="flex h-[calc(100vh-5rem)]">
                <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />

                <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 md:p-6 lg:p-8
                    ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} 
                `}>
                    {children}
                </main>
            </div>
        </div>
    );
}