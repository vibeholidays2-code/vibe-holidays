import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎯',
    title: 'Tailored Experiences',
    description: 'Customized itineraries designed around your preferences, budget, and travel style.',
    gradient: 'from-orange-400 to-pink-500',
    glow: 'rgba(251,146,60,0.25)',
  },
  {
    icon: '💎',
    title: 'Premium Quality',
    description: 'Handpicked hotels, verified guides, and exclusive experiences at every destination.',
    gradient: 'from-purple-500 to-indigo-500',
    glow: 'rgba(168,85,247,0.25)',
  },
  {
    icon: '🛡️',
    title: 'Trusted & Secure',
    description: '24/7 support, transparent pricing, and hassle-free booking with complete peace of mind.',
    gradient: 'from-teal-500 to-cyan-400',
    glow: 'rgba(20,184,166,0.25)',
  },
  {
    icon: '⚡',
    title: 'Instant Booking',
    description: 'Quick confirmations, flexible payment options, and real-time updates on your journey.',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,191,36,0.25)',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-slate-950">
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(20,184,166,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,0.8) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#FFA726]/10 border border-[#FFA726]/30 rounded-full text-[#FFA726] text-sm font-semibold mb-5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-[#FFA726] rounded-full animate-pulse" />
            Why Choose Us
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Your Journey,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA726] to-orange-400">
              Our Passion
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            We don't just plan trips — we craft unforgettable experiences tailored to your dreams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-7 h-full overflow-hidden hover:bg-white/8 hover:border-white/20 transition-all duration-400">
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)` }}
                />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`mt-5 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
