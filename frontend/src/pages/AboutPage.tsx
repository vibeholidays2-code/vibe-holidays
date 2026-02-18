import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

// ─── Animated counter ────────────────────────────────────────────────────────
const useCounter = (target: number, duration = 2000, active = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
};

const AnimatedStat = ({ number, suffix, label, icon, color, border }: {
  number: number; suffix: string; label: string; icon: string; color: string; border: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(number, 1800, inView);
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300 group`}
    >
      <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="text-4xl sm:text-5xl font-extrabold text-white mb-1 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </motion.div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { number: 5000, suffix: '+', label: 'Happy Travelers', icon: '😊', color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/20' },
  { number: 50, suffix: '+', label: 'Destinations', icon: '🌍', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20' },
  { number: 10, suffix: '+', label: 'Years Experience', icon: '🏆', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
  { number: 98, suffix: '%', label: 'Satisfaction Rate', icon: '⭐', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
];

const milestones = [
  { year: '2014', title: 'Founded', desc: 'Vibe Holidays was born with a dream to make travel accessible to all.' },
  { year: '2016', title: '500 Travelers', desc: 'Reached our first major milestone of 500 happy customers.' },
  { year: '2019', title: 'Expanded to 30+ Destinations', desc: 'Grew our portfolio to cover Southeast Asia, Europe, and the Middle East.' },
  { year: '2022', title: '5000+ Travelers', desc: 'Became one of Gujarat\'s most trusted travel agencies.' },
  { year: '2024', title: 'Award Winning', desc: 'Recognized as Best Travel Agency in Ahmedabad.' },
];

const values = [
  { icon: '🛡️', title: 'Trust & Transparency', description: 'Honest pricing and clear communication. No hidden costs, no surprises — ever.', color: 'from-teal-500/15 to-teal-600/5', border: 'border-teal-500/20', glow: 'shadow-teal-500/10' },
  { icon: '📞', title: '24/7 Support', description: 'Our team is always available to assist you before, during, and after your journey.', color: 'from-orange-500/15 to-orange-600/5', border: 'border-orange-500/20', glow: 'shadow-orange-500/10' },
  { icon: '✨', title: 'Personalized Experience', description: 'Every traveler is unique. We customize packages to match your preferences and budget.', color: 'from-purple-500/15 to-purple-600/5', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' },
  { icon: '🌏', title: 'Best Destinations', description: 'From exotic beaches to mountain adventures, we curate the best travel experiences worldwide.', color: 'from-emerald-500/15 to-emerald-600/5', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
];

const team = [
  {
    name: 'Ashish Patel', role: 'Founder & CEO',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    desc: 'Passionate traveler with 10+ years in the travel industry. Believes every journey should be transformative.',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    name: 'Priya Sharma', role: 'Head of Operations',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    desc: 'Ensures every trip runs smoothly from start to finish. Expert in logistics and customer satisfaction.',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    name: 'Rahul Mehta', role: 'Senior Travel Expert',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    desc: 'Specialist in Southeast Asia and Europe destinations. Has personally visited 40+ countries.',
    social: { linkedin: '#', instagram: '#' },
  },
];

const testimonials = [
  { name: 'Sneha Patel', location: 'Ahmedabad', rating: 5, text: 'Vibe Holidays made our Bali trip absolutely magical! Every detail was perfectly planned. Will definitely book again!', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', trip: 'Bali, Indonesia' },
  { name: 'Arjun Sharma', location: 'Surat', rating: 5, text: 'Best travel agency in Gujarat! Our Kashmir trip was beyond expectations. The team was responsive and professional throughout.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', trip: 'Kashmir, India' },
  { name: 'Meera Joshi', location: 'Vadodara', rating: 5, text: 'Booked a Europe package for our honeymoon. Everything was seamless — flights, hotels, tours. Highly recommend Vibe Holidays!', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', trip: 'Europe Tour' },
];

const whyUs = [
  { icon: '🎯', title: 'Expert Planning', desc: 'Our travel experts have years of experience crafting perfect itineraries for every type of traveler.' },
  { icon: '💰', title: 'Best Prices', desc: 'We negotiate the best deals to give you maximum value for your money — always.' },
  { icon: '⚡', title: 'Hassle-Free Booking', desc: 'Simple booking process with instant confirmation and easy payment options.' },
  { icon: '🛡️', title: 'Safety First', desc: 'Your safety is our priority. We partner only with trusted hotels and transport services.' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

// ─── Component ───────────────────────────────────────────────────────────────
const AboutPage = () => (
  <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
    <SEO
      title="About Us - Vibe Holidays"
      description="Learn about Vibe Holidays - your trusted travel partner since 2014. Discover our mission, values, team, and commitment to creating unforgettable travel experiences."
      keywords="about vibe holidays, travel agency ahmedabad, our story, travel company india, holiday experts gujarat"
      url="/about"
    />

    {/* ── HERO with real background image ── */}
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=85"
          alt="Travel background"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
      </div>

      {/* Animated teal orb */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,1) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-20 lg:pb-28 pt-40">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" /> Est. 2014 · Ahmedabad, India
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[0.92] max-w-4xl">
            We Live &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">
              Breathe Travel
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8 sm:mb-10">
            For over a decade, Vibe Holidays has been turning travel dreams into reality — crafting journeys that inspire, connect, and transform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/packages" className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-xl shadow-teal-500/25 transition-all duration-300">
                🌍 Explore Packages
              </motion.button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold rounded-xl backdrop-blur-sm transition-all duration-300">
                📞 Get In Touch
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── ANIMATED STATS ── */}
    <section className="py-16 lg:py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((s, i) => (
            <AnimatedStat key={i} {...s} />
          ))}
        </div>
      </div>
    </section>

    {/* ── OUR STORY ── */}
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Who We Are
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Born from a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Love of Travel
              </span>
            </h2>
            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>Vibe Holidays was born from a simple belief: travel should be accessible, affordable, and absolutely unforgettable. What started as a small team of passionate travelers has grown into a trusted name in the travel industry.</p>
              <p>We've helped thousands of travelers explore the world, from the pristine beaches of Bali to the majestic deserts of Jaisalmer. Every journey we plan is crafted with care, attention to detail, and a deep understanding of what makes travel truly special.</p>
              <p>Today, we continue to innovate and expand our offerings, always keeping our core mission at heart: to make your travel dreams a reality.</p>
            </div>

            {/* Key highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: '🏅', label: 'Award-winning agency' },
                { icon: '🤝', label: 'Trusted by 5000+ families' },
                { icon: '🌐', label: '50+ global destinations' },
                { icon: '💬', label: '24/7 customer support' },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-xl">{h.icon}</span>
                  <span className="text-slate-300 text-sm font-medium">{h.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image collage */}
          <motion.div {...fadeUp(0.2)} className="relative h-72 sm:h-[420px] lg:h-[560px]">
            {/* Main image */}
            <div className="absolute inset-0 sm:top-0 sm:left-0 sm:right-10 sm:bottom-10 rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80" alt="Travel planning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>
            {/* Secondary image — hidden on mobile */}
            <div className="hidden sm:block absolute bottom-0 right-0 w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-950">
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" alt="Travel adventure" className="w-full h-full object-cover" />
            </div>
            {/* Floating badge — years */}
            <motion.div
              className="absolute -bottom-4 left-4 sm:left-8 bg-gradient-to-br from-teal-500 to-teal-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-xl shadow-teal-500/30"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold leading-none">10+</p>
              <p className="text-teal-200 text-xs sm:text-sm font-medium mt-1">Years of Excellence</p>
            </motion.div>
            {/* Floating badge — travelers — hidden on mobile */}
            <motion.div
              className="hidden sm:block absolute top-6 -right-3 lg:-right-4 bg-gradient-to-br from-[#FFA726] to-[#FB8C00] text-white px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-xl shadow-orange-500/30"
              animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <p className="text-2xl sm:text-3xl font-extrabold leading-none">5K+</p>
              <p className="text-orange-100 text-xs font-medium mt-1">Happy Travelers</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── MILESTONE TIMELINE ── */}
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-semibold uppercase tracking-wider mb-5">
            Our Journey
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            A Decade of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Milestones</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line — left on mobile, center on sm+ */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/0 via-teal-500/40 to-teal-500/0" />

          {milestones.map((m, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.12)}
              className={`relative flex items-start gap-6 mb-8 sm:mb-10 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
            >
              {/* Dot */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-teal-500 rounded-full border-4 border-slate-950 shadow-lg shadow-teal-500/50 z-10 mt-1" />

              {/* Card — always left-aligned on mobile */}
              <div className={`ml-10 sm:ml-0 w-full sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'sm:mr-auto sm:pr-8' : 'sm:ml-auto sm:pl-8'}`}>
                <div className="bg-white/5 border border-white/10 hover:border-teal-500/30 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:bg-white/8">
                  <span className="inline-block px-3 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-bold rounded-full mb-3">
                    {m.year}
                  </span>
                  <h3 className="text-white font-bold text-sm sm:text-base mb-1">{m.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── VALUES ── */}
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
            What We Stand For
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Our Core{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA726] to-[#FB8C00]">Values</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">These principles guide everything we do and shape every experience we create.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {values.map((v, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}
              className={`group bg-gradient-to-br ${v.color} border ${v.border} rounded-2xl p-6 backdrop-blur-sm hover:scale-105 hover:shadow-xl hover:${v.glow} transition-all duration-300 cursor-default`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── MISSION & VISION ── */}
    <section className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Mission &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Vision</span>
          </h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div {...fadeUp(0)} className="relative bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-3xl p-8 lg:p-10 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/5 rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed text-base sm:text-lg">To make travel accessible and enjoyable for everyone by providing exceptional service, competitive prices, and unforgettable experiences that create lasting memories.</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="relative bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-3xl p-8 lg:p-10 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed text-base sm:text-lg">To become India's most trusted travel partner, known for innovation, reliability, and creating journeys that inspire and transform lives.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── WHY CHOOSE US ── */}
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Vibe Holidays?</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">We're not just another travel agency. Here's what makes us different.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
          {whyUs.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}
              className="flex items-start gap-5 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-teal-500/20 rounded-2xl p-6 transition-all duration-300 group"
            >
              <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TEAM ── */}
    <section className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-semibold uppercase tracking-wider mb-5">
            The People Behind
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Team</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Passionate travel experts dedicated to making your journey unforgettable.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {team.map((m, i) => (
            <motion.div key={i} {...fadeUp(i * 0.12)}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-400"
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                {/* Role badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-full backdrop-blur-sm">
                    {m.role}
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TESTIMONIALS ── */}
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-wider mb-5">
            Happy Travelers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            What Our Clients{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA726] to-[#FB8C00]">Say</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Real stories from real travelers who trusted Vibe Holidays.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} {...fadeUp(i * 0.12)}
              className="bg-white/5 border border-white/10 hover:border-orange-500/20 rounded-3xl p-7 hover:bg-white/8 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-[#FFA726]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/30" />
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.location} · {t.trip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80" alt="Beach" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/50 to-transparent" />
      </div>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,1) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
      />
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
            Ready to Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Journey?</span>
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Let us help you create memories that will last a lifetime. Your dream trip is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-teal-500/25 transition-all duration-300">
                🌍 Explore Packages
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-lg rounded-xl backdrop-blur-sm transition-all duration-300">
                📞 Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default AboutPage;
