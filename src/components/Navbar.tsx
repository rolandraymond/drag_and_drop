import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#142F32] shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="20" width="8" height="8" fill="#E3FFCC" />
                <rect x="12" y="16" width="8" height="12" fill="#E3FFCC" />
                <rect x="20" y="12" width="8" height="16" fill="#E3FFCC" />
                <text x="16" y="8" textAnchor="middle" fill="#E3FFCC" fontSize="10" fontFamily="monospace">Luild</text>
              </svg>
              <span className="text-xl font-bold font-mono text-[#E3FFCC]">Luild</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-10">
            <Link to="/" className="text-[#E3FFCC] hover:text-white transition-colors duration-300">Home</Link>
            <Link to="/how-it-works" className="text-[#E3FFCC] hover:text-white transition-colors duration-300">How It Works</Link>
            <Link to="/about" className="text-[#E3FFCC] hover:text-white transition-colors duration-300">About Us</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-[#E3FFCC] hover:text-white transition-colors duration-300 flex items-center space-x-2"
                >
                  <span className="font-mono">{user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#282930] rounded-md shadow-lg py-1 z-10 border border-[rgba(247,247,247,0.10)]">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-[#E3FFCC] hover:bg-[rgba(247,247,247,0.10)]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#E3FFCC] hover:bg-[rgba(247,247,247,0.10)]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[#E3FFCC] hover:text-white transition-colors duration-300">Login</Link>
                <Link to="/register" className="bg-[#E3FFCC] text-[#142F32] px-4 py-2 rounded-md font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;