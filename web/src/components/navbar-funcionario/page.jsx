// components/Navbar.js
import React from 'react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md z-10">
            <div className="flex items-center justify-between h-full px-6">

                <div className="text-gray-700 text-lg font-medium">
                    Dashboard Principal
                </div>

                <div className="flex items-center space-x-4">

                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <div className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                            [Nome do Usuário]
                        </span>
                        <img
                            className="h-9 w-9 rounded-full object-cover border-2 border-indigo-500"
                            src="https://via.placeholder.com/150/5B6CB7/FFFFFF?text=FN"
                            alt="Avatar do Usuário"
                        />
                    </div>
                </div>

            </div>
        </nav>
    );
}