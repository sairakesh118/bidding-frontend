import { use, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Auctions', path: '/bidding-items' },
    { name: 'Categories', path: '/bidding-items', hasDropdown: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Art & Collectibles', 'Sports'];

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              EliteAuctions
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2">
                        {categories.map((category) => (
                          <a
                            key={category}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/category/${category.toLowerCase()}`);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {category}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 font-medium px-2 py-1 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {isDropdownOpen && (
                        <div className="mt-2 ml-4 space-y-2">
                          {categories.map((category) => (
                            <a
                              key={category}
                              href="#"
                              className="block text-sm text-gray-600 hover:text-blue-600 py-1 transition-colors duration-200"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/category/${category.toLowerCase()}`);
                                setIsMenuOpen(false);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {category}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href="#"
                      className="block text-gray-700 hover:text-blue-600 font-medium px-2 py-1 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
              
              {/* Mobile Login Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}