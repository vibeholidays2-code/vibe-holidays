import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import SEO from '../components/SEO';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const contactInfo = [
  {
    icon: '📞',
    title: 'Phone',
    lines: ['+91 7048505128'],
    sub: 'Mon–Sat: 9:00 AM – 8:00 PM',
    color: 'from-teal-500/15 to-teal-600/5',
    border: 'border-teal-500/20',
    href: 'tel:+917048505128',
  },
  {
    icon: '✉️',
    title: 'Email',
    lines: ['vibesholidays.9@gmail.com'],
    sub: 'We reply within 24 hours',
    color: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/20',
    href: 'mailto:vibesholidays.9@gmail.com',
  },
  {
    icon: '📍',
    title: 'Address',
    lines: ['E-block, 510, PNTC, 5', 'Times Of India Press Rd', 'Ahmedabad, Gujarat 380015'],
    sub: 'Visit us anytime during hours',
    color: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/20',
    href: 'https://maps.google.com/?q=Ahmedabad+Gujarat+380015',
  },
  {
    icon: '🕐',
    title: 'Business Hours',
    lines: ['Mon–Sat: 9:00 AM – 8:00 PM', 'Sunday: 10:00 AM – 6:00 PM'],
    sub: 'WhatsApp available 24/7',
    color: 'from-emerald-500/15 to-emerald-600/5',
    border: 'border-emerald-500/20',
    href: null,
  },
];

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/1J9VSNkHcn/', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: 'hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400' },
  { label: 'Instagram', href: 'https://www.instagram.com/vibes_holidays_?igsh=MXFvZDQzd25hd2wxcQ==', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: 'hover:bg-pink-600/20 hover:border-pink-500/40 hover:text-pink-400' },
  { label: 'WhatsApp', href: 'https://wa.me/917048505128?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20travel%20packages', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z', color: 'hover:bg-green-600/20 hover:border-green-500/40 hover:text-green-400' },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <SEO
        title="Contact Us"
        description="Get in touch with Vibe Holidays. Contact us for inquiries, custom packages, or any questions about your travel plans."
        keywords="contact travel agency, travel inquiries, holiday booking contact, travel support"
        url="/contact"
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <motion.div className="absolute inset-0"
          animate={{ background: ['linear-gradient(135deg,#0d1117 0%,#0d4a45 50%,#1a1a2e 100%)', 'linear-gradient(135deg,#1a1a2e 0%,#0d9488 50%,#0d1117 100%)', 'linear-gradient(135deg,#0d4a45 0%,#1a1a2e 50%,#0d9488 100%)'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,0.8) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {[{ s: 280, x: 5, y: 5, c: 'rgba(20,184,166,1)', o: 0.07, d: 12 }, { s: 200, x: 80, y: 10, c: 'rgba(255,167,38,1)', o: 0.05, d: 15 }, { s: 160, x: 50, y: 65, c: 'rgba(99,102,241,1)', o: 0.05, d: 10 }].map((p, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, background: `radial-gradient(circle,${p.c} 0%,transparent 70%)`, opacity: p.o }}
            animate={{ y: [0, -25, 0], x: [0, 12, 0] }} transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 sm:py-24 lg:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" /> Get In Touch
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-[0.95]">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">Us</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have a question or ready to plan your dream trip? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {contactInfo.map((info, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}>
                {info.href ? (
                  <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className={`block bg-gradient-to-br ${info.color} border ${info.border} rounded-2xl p-6 hover:scale-105 transition-all duration-300 group h-full`}>
                    <div className="text-3xl mb-4">{info.icon}</div>
                    <h3 className="font-bold text-white text-base mb-2">{info.title}</h3>
                    {info.lines.map((l, j) => <p key={j} className="text-slate-300 text-sm">{l}</p>)}
                    <p className="text-slate-500 text-xs mt-2">{info.sub}</p>
                  </a>
                ) : (
                  <div className={`bg-gradient-to-br ${info.color} border ${info.border} rounded-2xl p-6 h-full`}>
                    <div className="text-3xl mb-4">{info.icon}</div>
                    <h3 className="font-bold text-white text-base mb-2">{info.title}</h3>
                    {info.lines.map((l, j) => <p key={j} className="text-slate-300 text-sm">{l}</p>)}
                    <p className="text-slate-500 text-xs mt-2">{info.sub}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Contact Form */}
            <motion.div {...fadeUp(0)} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Send Us a Message</h2>
              <p className="text-slate-400 mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-emerald-300 font-medium text-sm">Thank you! We'll get back to you soon. 🎉</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <p className="text-red-300 font-medium text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                  <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
                </div>
                <Input label="Phone (Optional)" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                <Textarea label="Message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us how we can help you plan your perfect trip..." />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" variant="primary" disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-base rounded-xl shadow-xl shadow-teal-500/20 transition-all duration-300">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Sending...
                      </span>
                    ) : '✉️ Send Message'}
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-slate-500 text-xs font-medium">or chat directly</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* WhatsApp */}
                <a href="https://wa.me/917048505128?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20travel%20packages" target="_blank" rel="noopener noreferrer">
                  <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chat on WhatsApp
                  </motion.button>
                </a>
              </form>
            </motion.div>

            {/* Right column: Social + Map */}
            <div className="space-y-6">
              {/* Social Media */}
              <motion.div {...fadeUp(0.15)} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Follow Us</h2>
                <p className="text-slate-400 text-sm mb-6">Stay connected for travel inspiration and exclusive deals.</p>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <motion.div
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 transition-all duration-300 ${s.color}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                      </motion.div>
                    </a>
                  ))}
                </div>

                {/* Quick contact strip */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3">
                  <a href="tel:+917048505128" className="flex items-center gap-2 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl hover:bg-teal-500/20 transition-all duration-200 group">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="text-teal-400 text-xs font-semibold">Call Now</p>
                      <p className="text-white text-xs font-bold">+91 70485 05128</p>
                    </div>
                  </a>
                  <a href="mailto:vibesholidays.9@gmail.com" className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl hover:bg-orange-500/20 transition-all duration-200 group">
                    <span className="text-xl">✉️</span>
                    <div>
                      <p className="text-orange-400 text-xs font-semibold">Email Us</p>
                      <p className="text-white text-xs font-bold truncate">vibesholidays.9@</p>
                    </div>
                  </a>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div {...fadeUp(0.25)} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    Find Us Here
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">E-block, 510, PNTC, 5 Times Of India Press Rd, Ahmedabad, Gujarat 380015</p>
                </div>
                <div className="h-64 sm:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9876543210123!2d72.5123456789!3d23.0123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzQ0LjQiTiA3MsKwMzAnNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%" height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vibes Holidays Location - Ahmedabad"
                  />
                </div>
              </motion.div>

              {/* FAQ teaser */}
              <motion.div {...fadeUp(0.3)} className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-3xl p-7">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">💡 Quick Answers</h3>
                <div className="space-y-3">
                  {[
                    { q: 'How quickly do you respond?', a: 'Within 24 hours on weekdays, 48 hours on weekends.' },
                    { q: 'Can I customize a package?', a: 'Absolutely! All our packages can be fully customized.' },
                    { q: 'Do you offer group discounts?', a: 'Yes! Groups of 10+ get special pricing.' },
                  ].map((faq, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-white font-semibold text-sm mb-1">{faq.q}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
