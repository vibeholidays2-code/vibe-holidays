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
    <nav className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      {/* Top Section: Logo and Contact Info */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo with Contact Info */}
            <Link 
              to="/" 
              className="flex items-center group transition-all duration-200 ease-in-out-smooth hover:-translate-y-0.5 min-h-[44px] py-2"
              aria-label="Vibes Holidays - Go to homepage"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-subtle group-hover:shadow-soft transition-all duration-200 flex-shrink-0">
                  <span className="text-white font-bold text-lg sm:text-xl">V</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200 leading-tight">
                    Vibes Holidays
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-600 mt-0.5">
                    <a 
                      href="tel:+917048505128" 
                      className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="hidden sm:inline">+91 7048505128</span>
                      <span className="sm:hidden">7048505128</span>
                    </a>
                    <span className="text-neutral-300">|</span>
                    <a 
                      href="mailto:vibesholidays.9@gmail.com" 
                      className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden md:inline">vibesholidays.9@gmail.com</span>
                      <span className="md:hidden">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
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
      </div>

      {/* Bottom Section: Navigation Links */}
      <div className="hidden md:block bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-1" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                role="menuitem"
                className={`${
                  isActive(link.path)
                    ? 'text-primary-600 bg-white border-b-2 border-primary-600'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-white/50 border-b-2 border-transparent hover:border-primary-200'
                } px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out-smooth relative group`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.label}
                <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary transform transition-transform duration-200 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>
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
