import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService } from '../services/reviewService';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const destinations = [
    'Bali', 'Kashmir', 'Goa', 'Dubai', 'Maldives',
    'Thailand', 'Singapore', 'Vietnam', 'Jaisalmer', 'Spiti Valley', 'Other',
];

const ReviewForm = ({ isOpen, onClose, onSuccess }: ReviewFormProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [destination, setDestination] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim() || !comment.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.createReview({
                name: name.trim(),
                email: email.trim(),
                rating,
                comment: comment.trim(),
                destination: destination || undefined,
            });
            setSuccess(true);
            onSuccess?.();
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setName('');
                setEmail('');
                setRating(5);
                setComment('');
                setDestination('');
            }, 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {success ? (
                            <motion.div
                                className="text-center py-8"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="text-5xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                                <p className="text-slate-400">Your review has been submitted and will be visible after approval.</p>
                            </motion.div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-1">Share Your Experience</h2>
                                <p className="text-slate-400 text-sm mb-6">Your feedback helps other travelers plan their dream vacation!</p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 outline-none transition-all"
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Your email won't be displayed publicly</p>
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Rating *
                                        </label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                                                >
                                                    <span className={
                                                        star <= (hoverRating || rating)
                                                            ? 'text-amber-400'
                                                            : 'text-slate-600'
                                                    }>
                                                        ★
                                                    </span>
                                                </button>
                                            ))}
                                            <span className="ml-2 text-slate-400 text-sm self-center">
                                                {rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    {/* Destination */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Destination Visited
                                        </label>
                                        <select
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 outline-none transition-all appearance-none"
                                        >
                                            <option value="" className="bg-slate-900">Select destination (optional)</option>
                                            {destinations.map((dest) => (
                                                <option key={dest} value={dest} className="bg-slate-900">{dest}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Your Review *
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Tell us about your experience..."
                                            rows={4}
                                            maxLength={1000}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 outline-none transition-all resize-none"
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1 text-right">{comment.length}/1000</p>
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : (
                                            'Submit Review ✨'
                                        )}
                                    </motion.button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReviewForm;
