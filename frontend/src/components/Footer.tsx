import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Vibes Holidays
              </h3>
            </div>
            
            <p className="text-neutral-300 text-lg leading-relaxed max-w-md">
              Your gateway to unforgettable travel experiences. We create
              memories that last a lifetime with personalized service and attention to detail.
            </p>

            {/* Enhanced Social Media Icons */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Follow Our Journey</h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-neutral-800 hover:bg-gradient-primary rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out-smooth hover:shadow-soft hover:-translate-y-1"
                  aria-label="Follow us on Facebook"
                >
                  <svg
                    className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/vibes_holidays_?igsh=MXFvZDQzd25hd2wxcQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-neutral-800 hover:bg-gradient-secondary rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out-smooth hover:shadow-soft hover:-translate-y-1"
                  aria-label="Follow us on Instagram"
                >
                  <svg
                    className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-neutral-800 hover:bg-gradient-primary rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out-smooth hover:shadow-soft hover:-translate-y-1"
                  aria-label="Follow us on Twitter"
                >
                  <svg
                    className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@vibesholidays?si=74cMT3WXqv8pFygP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-neutral-800 hover:bg-gradient-secondary rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out-smooth hover:shadow-soft hover:-translate-y-1"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <svg
                    className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-primary rounded-full"></div>
              <h4 className="text-xl font-semibold text-white">Quick Links</h4>
            </div>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/packages', label: 'Travel Packages' },
                { to: '/gallery', label: 'Photo Gallery' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center space-x-2 text-neutral-300 hover:text-white transition-all duration-200 ease-in-out-smooth"
                  >
                    <div className="w-2 h-2 bg-primary-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-200"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-secondary rounded-full"></div>
              <h4 className="text-xl font-semibold text-white">Get In Touch</h4>
            </div>
            <ul className="space-y-4">
              <li className="group">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-200 ease-in-out-smooth">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/30 transition-colors duration-200">
                    <svg
                      className="h-5 w-5 text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Call us</p>
                    <a href="tel:+917048505128" className="text-white font-medium hover:text-primary-400 transition-colors duration-200">
                      +91 7048505128
                    </a>
                  </div>
                </div>
              </li>
              <li className="group">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-200 ease-in-out-smooth">
                  <div className="w-10 h-10 bg-secondary-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-600/30 transition-colors duration-200">
                    <svg
                      className="h-5 w-5 text-secondary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Email us</p>
                    <a href="mailto:vibesholidays.9@gmail.com" className="text-white font-medium hover:text-secondary-400 transition-colors duration-200 break-all">
                      vibesholidays.9@gmail.com
                    </a>
                  </div>
                </div>
              </li>
              <li className="group">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-200 ease-in-out-smooth">
                  <div className="w-10 h-10 bg-success-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-success-600/30 transition-colors duration-200">
                    <svg
                      className="h-5 w-5 text-success-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Visit us</p>
                    <address className="text-white font-medium not-italic leading-relaxed">
                      Vejalpur, Ahmedabad,<br />
                      Gujarat 380015
                    </address>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Bar with Subtle Dividers */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-neutral-700 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-neutral-400 text-sm">
                &copy; {currentYear} Vibes Holidays. All rights reserved.
              </p>
              <div className="hidden md:block w-px h-4 bg-neutral-700"></div>
              <p className="text-neutral-500 text-xs">
                Crafted with ❤️ for unforgettable journeys
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <div className="w-px h-4 bg-neutral-700"></div>
              <Link to="/terms" className="text-neutral-400 hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
