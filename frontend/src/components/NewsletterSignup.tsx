import { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('🎉 You\'re subscribed! Watch for exclusive deals.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong. Try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Unable to connect. Please try again later.');
        }

        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 5000);
    };

    return (
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✉️</span>
                <h4 className="text-lg font-bold text-white">Stay Updated</h4>
            </div>
            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                Get exclusive deals, travel tips & new destination alerts straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={status === 'loading'}
                    className="flex-1 px-4 py-3 bg-neutral-900/80 border border-neutral-600/50 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-200 disabled:opacity-50"
                />
                <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
                >
                    {status === 'loading' ? '...' : 'Subscribe'}
                </motion.button>
            </form>

            {message && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 text-sm font-medium ${status === 'success' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
};

export default NewsletterSignup;
