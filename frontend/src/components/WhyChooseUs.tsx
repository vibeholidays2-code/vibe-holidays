import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

const features = [
  {
    icon: '🎯',
    title: 'Tailored Experiences',
    description: 'Customized itineraries designed around your preferences, budget, and travel style.',
    gradient: 'from-orange-400 to-pink-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    icon: '💎',
    title: 'Premium Quality',
    description: 'Handpicked hotels, verified guides, and exclusive experiences at every destination.',
    gradient: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    icon: '🛡️',
    title: 'Trusted & Secure',
    description: '24/7 support, transparent pricing, and hassle-free booking with complete peace of mind.',
    gradient: 'from-teal-500 to-cyan-400',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    icon: '⚡',
    title: 'Instant Booking',
    description: 'Quick confirmations, flexible payment options, and real-time updates on your journey.',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, type: 'spring', stiffness: 90 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative group cursor-default"
    >
      <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-gray-100 overflow-hidden h-full">

        {/* Animated gradient border on hover */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          style={{ padding: '2px' }}
        />
        <div className="absolute inset-[2px] bg-white rounded-[22px] group-hover:bg-white/98 transition-colors duration-300" />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon with gradient background circle */}
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
            animate={isHovered ? { scale: 1.12, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.45 }}
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="text-2xl">{feature.icon}</span>
          </motion.div>

          <h3
            className="text-xl font-bold text-gray-900 mb-3"
            style={{ transform: 'translateZ(25px)' }}
          >
            {feature.title}
          </h3>

          <p
            className="text-gray-500 leading-relaxed text-sm"
            style={{ transform: 'translateZ(15px)' }}
          >
            {feature.description}
          </p>

          {/* Bottom accent line */}
          <motion.div
            className={`mt-6 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-full`}
            initial={{ scaleX: 0, originX: 0 }}
            animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.55 }}
        />
      </div>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Subtle diagonal stripe background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-slate-50" style={{ zIndex: -1 }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block px-5 py-2 bg-gradient-to-r from-[#FFA726] to-orange-500 text-white rounded-full text-sm font-semibold mb-5 shadow-lg"
          >
            Why Choose Us
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            Your Journey,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA726] to-orange-600">
              Our Passion
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We don't just plan trips — we craft unforgettable experiences tailored to your dreams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" style={{ perspective: '1200px' }}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
