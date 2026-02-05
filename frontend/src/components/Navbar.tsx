import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/packages', label: 'Packages' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-neutral-100" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Enhanced Logo */}
          <Link 
            to="/" 
            className="flex items-center group transition-all duration-200 ease-in-out-smooth hover:-translate-y-0.5 min-h-[44px] py-2"
            aria-label="Vibes Holidays - Go to homepage"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-subtle group-hover:shadow-soft transition-all duration-200">
                <span className="text-white font-bold text-lg sm:text-xl">V</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                Vibes Holidays
              </span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                role="menuitem"
                className={`${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50/50 border-b-2 border-transparent hover:border-primary-200'
                } px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out-smooth rounded-t-lg relative group`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.label}
                <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary transform transition-transform duration-200 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-3 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ease-in-out-smooth min-h-[48px] min-w-[48px]"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
          >
            <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
            <div className="relative w-6 h-6">
              <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out-smooth ${
                isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
              }`} />
              <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out-smooth ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out-smooth ${
                isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out-smooth ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white/95 backdrop-blur-sm border-t border-neutral-100 shadow-soft">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
              className={`${
                isActive(link.path)
                  ? 'bg-gradient-primary text-white shadow-soft'
                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
              } block px-6 py-4 rounded-xl text-lg font-medium transition-all duration-200 ease-in-out-smooth transform hover:translate-x-1 min-h-[56px] ${
                isMenuOpen ? 'animate-slide-in-from-right' : ''
              }`}
              style={{ 
                animationDelay: `${index * 50}ms`,
              }}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  isActive(link.path) ? 'bg-white' : 'bg-primary-400'
                }`} />
                <span>{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
