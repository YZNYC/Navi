import React from 'react';

export default function Sidebar({ menuItems, activeKey, setActiveKey }) {
    return (
        <aside className="w-64 bg-white text-gray-800 flex-shrink-0 shadow-xl border-r border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-extrabold text-yellow-500">Navi</h2>
            </div>
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveKey(item.key)}
                        className={` w-full text-left p-3 rounded-lg transition duration-150 ease-in-out flex items-center cursor-pointer
                            ${activeKey === item.key
                                ? 'bg-yellow-400 text-white font-semibold shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                            }
            `}
                    >
                        <span className="ml-2">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}