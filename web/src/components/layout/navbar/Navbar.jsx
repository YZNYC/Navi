// src/components/Layout/Navbar/Navbar.jsx
"use client";

import React from 'react';

// Ícones SVG
const IconHamburger = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-200">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const IconSun = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m-.386-6.364l1.591 1.591" />
    </svg>
);

const IconBell = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.043 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const IconChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


export default function Navbar({ onToggleSidebar }) {
    return (
        <nav className="bg-yellow-500 text-white p-4 shadow-md flex items-center justify-between h-[88px] w-full">
            {/* Left section: Hamburger (Sidebar Toggle), Search Input */}
            <div className="flex items-center space-x-4">
                {/* Botão para alternar a sidebar (agora visível também em md screens) */}
                <button
                    onClick={onToggleSidebar} // Chama a função passada pelo layout pai
                    className="p-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                    aria-label="Toggle sidebar"
                >
                    <IconHamburger />
                </button>

                {/* Search Input */}
                <div className="relative flex items-center bg-yellow-600/40 rounded-lg p-2 pl-3 group focus-within:ring-1 focus-within:ring-yellow-300 transition-all duration-200">
                    <IconSearch />
                    <input
                        type="text"
                        placeholder="Search or type command..."
                        className="bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-300 ml-2 w-64 md:w-80"
                    />
                    {/* Command K hint */}
                    <div className="hidden sm:flex items-center justify-center h-6 w-10 text-xs font-semibold bg-yellow-600/50 text-gray-200 rounded-md ml-2 group-focus-within:hidden">
                        ⌘K
                    </div>
                </div>
            </div>

            {/* Right section: Theme Toggle, Notifications, User Profile */}
            <div className="flex items-center space-x-6">
                {/* Theme Toggle */}
                <button className="p-2 rounded-full hover:bg-yellow-600/20 transition-colors duration-200" aria-label="Toggle theme">
                    <IconSun />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-yellow-600/20 transition-colors duration-200" aria-label="Notifications">
                    <IconBell />
                    <span className="absolute top-1 right-1 block w-2 h-2 bg-orange-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-yellow-600/20 transition-colors duration-200">
                    <img
                        src="https://via.placeholder.com/32" // Placeholder para imagem do usuário
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border-2 border-yellow-400"
                    />
                    <span className="text-sm font-medium hidden sm:block">Musharof</span>
                    <IconChevronDown />
                </div>
            </div>
        </nav>
    );
}