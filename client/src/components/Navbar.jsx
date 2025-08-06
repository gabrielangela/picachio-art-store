import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Navbar() {
  const { user, userRole } = useAuth();
  const { totalQuantity } = useSelector((state) => state.cart);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  return (
    <header className="bg-white shadow-md py-3 sm:py-4 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        {/* Logo and Role Indicator Row */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#354f52]">Picachio.</h1>
          
          {/* Role indicator - Mobile position */}
          {userRole && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 sm:hidden">
              {userRole.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
          <Link to="/" className="text-[#52796f] hover:text-[#354f52] font-medium transition text-sm sm:text-base">Home</Link>
          <Link to="/about" className="text-[#52796f] hover:text-[#354f52] font-medium transition text-sm sm:text-base">About</Link>
          <Link to="/contact" className="text-[#52796f] hover:text-[#354f52] font-medium transition text-sm sm:text-base">Contact</Link>
          
          {/* Admin-only navigation */}
          {userRole === 'admin' && (
            <>
              {/* Admin Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                  className="bg-[#4a5759] hover:bg-[#3c4748] text-white px-2 sm:px-3 py-1 rounded font-medium transition flex items-center gap-1 text-sm"
                >
                  Admin
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showAdminDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <Link
                      to="/admin-setup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                      onClick={() => setShowAdminDropdown(false)}
                    >
                      👥 Manage Users
                    </Link>
                    <Link
                      to="/admin-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAdminDropdown(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <hr className="border-gray-200" />
                    <div className="px-4 py-2 text-xs text-gray-500">
                      Admin Tools
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Client-only navigation */}
          {userRole === 'client' && (
            <Link 
              to="/cart" 
              className="relative bg-[#52796f] hover:bg-[#354f52] text-white px-2 sm:px-3 py-1 rounded font-medium transition flex items-center gap-1 text-sm"
            >
              Cart
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {totalQuantity}
                </span>
              )}
            </Link>
          )}
          
          {/* Role indicator - Desktop position */}
          {userRole && (
            <span className="hidden sm:inline-block text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              {userRole.toUpperCase()}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}