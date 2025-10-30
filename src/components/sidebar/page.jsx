import Link from 'next/link';
import { useState } from 'react';

const Sidebar = ({ menuItems = [], children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-40 bg-gray-800 text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar Menu' : 'Abrir Menu'}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative md:h-auto z-30
        `}
      >
        
        <div className="p-6 border-b border-gray-700">
          {children ? children : (
             <h1 className="text-xl font-bold">App Dashboard</h1>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul>
            {menuItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link 
                  href={item.href}
                  className="block p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  onClick={handleLinkClick}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <p className="text-sm text-gray-400">© 2024 Project</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;