import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Button from './Button';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string;
  packageName?: string;
}

const InquiryModal = ({
  isOpen,
  onClose,
  packageId,
  packageName,
}: InquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '',
    tourType: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = packageId
        ? { ...formData, packageId }
        : formData;

      await api.post(packageId ? '/inquiries' : '/contact', payload);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', travelers: '', tourType: '', message: '' });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to send inquiry. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col lg:flex-row">
              {/* Left Side - Branding */}
              <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-10 flex-col justify-between relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute bottom-20 left-5 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-6xl mb-6">✈️</div>
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Plan Your Perfect Trip</h2>
                  <p className="text-primary-100 text-lg leading-relaxed">
                    Get a <span className="font-bold text-white">FREE</span> personalized itinerary with the best prices from our travel experts
                  </p>
                </div>

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl text-white">✓</span>
                    </div>
                    <span className="text-white font-semibold text-lg">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl text-white">✓</span>
                    </div>
                    <span className="text-white font-semibold text-lg">Data Privacy Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl text-white">✓</span>
                    </div>
                    <span className="text-white font-semibold text-lg">Travel with Confidence</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-full lg:w-3/5 p-4 sm:p-6 lg:p-10 overflow-y-auto max-h-[98vh] sm:max-h-[95vh] lg:max-h-none flex flex-col">
                {/* Close button */}
                <div className="flex justify-end mb-3 sm:mb-6 -mt-1 sm:-mt-0">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 w-10 h-10 flex items-center justify-center touch-manipulation"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden mb-4 sm:mb-6">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✈️</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Plan Your Perfect Trip</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Get a FREE personalized itinerary with the best prices</p>
                </div>

                {/* Messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">✓</span>
                      <div>
                        <p className="font-bold text-lg">Thank you for your inquiry!</p>
                        <p className="text-sm text-green-600 mt-1">We'll get back to you soon with your personalized itinerary.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">!</span>
                      <div>
                        <p className="font-bold text-lg">Error</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Full Name <span className="text-error-600">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter Your Name"
                      className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-gray-900 placeholder-gray-400 font-medium text-base touch-manipulation"
                    />
                  </div>

                  {/* Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number <span className="text-error-600">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter Phone Number"
                        className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-gray-900 placeholder-gray-400 font-medium text-base touch-manipulation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Email <span className="text-error-600">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-gray-900 placeholder-gray-400 font-medium text-base touch-manipulation"
                      />
                    </div>
                  </div>

                  {/* Number of Travellers */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Number of Travellers <span className="text-error-600">*</span></label>
                    <select
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-gray-900 font-medium appearance-none cursor-pointer text-base touch-manipulation"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e40af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Select number of travellers</option>
                      <option value="1">1 Traveller</option>
                      <option value="2">2 Travellers</option>
                      <option value="3">3 Travellers</option>
                      <option value="4">4 Travellers</option>
                      <option value="5+">5+ Travellers</option>
                    </select>
                  </div>

                  {/* Tour Type */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Tour Type <span className="text-error-600">*</span></label>
                    <select
                      name="tourType"
                      value={formData.tourType}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-gray-900 font-medium appearance-none cursor-pointer text-base touch-manipulation"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e40af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Select tour type</option>
                      <option value="adventure">Adventure</option>
                      <option value="beach">Beach Holiday</option>
                      <option value="cultural">Cultural Tour</option>
                      <option value="honeymoon">Honeymoon</option>
                      <option value="family">Family Trip</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Tell us about your trip <span className="text-error-600">*</span></label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-gray-900 placeholder-gray-400 font-medium resize-none text-base touch-manipulation"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
                    <input
                      type="checkbox"
                      id="office-visit"
                      className="w-5 h-5 rounded border-primary-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-primary-600 touch-manipulation"
                      defaultChecked
                    />
                    <label htmlFor="office-visit" className="text-xs sm:text-sm text-gray-700 cursor-pointer font-medium">
                      I would like to visit your office
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base sm:text-lg mt-4 sm:mt-6 touch-manipulation"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Sending...
                      </span>
                    ) : (
                      'Contact Our Travel Expert'
                    )}
                  </Button>

                  {/* Footer */}
                  <p className="text-xs text-center text-neutral-500 mt-3 sm:mt-4 pb-2">
                    By submitting, you agree to our <a href="#" className="text-primary-600 hover:underline font-semibold">Privacy Policy</a> and <a href="#" className="text-primary-600 hover:underline font-semibold">Terms of Service</a>
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
