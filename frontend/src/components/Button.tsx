import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  bgColor?: string;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  bgColor,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variantStyles = {
    primary:
      'text-white shadow-soft hover:shadow-medium focus:ring-orange-500',
    secondary:
      'border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-600 hover:text-white hover:shadow-soft focus:ring-primary-500',
    outline:
      'border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-600 hover:text-white hover:shadow-soft focus:ring-primary-500',
    ghost:
      'text-primary-600 bg-transparent hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500',
    danger: 
      'bg-gradient-to-r from-error-600 to-error-500 text-white shadow-soft hover:shadow-medium focus:ring-error-500',
  };

  const sizeStyles = {
    sm: 'px-4 py-3 text-sm font-medium min-h-[44px]', // Ensure 44px minimum touch target
    md: 'px-6 py-4 text-base font-medium min-h-[48px]', // Increased padding for better mobile touch
    lg: 'px-8 py-5 text-lg font-semibold min-h-[52px]', // Larger touch targets for primary actions
  };

  // Animation variants for micro-interactions
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.98,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 600, 
        damping: 15 
      }
    }
  };

  // Ripple effect animation
  const rippleVariants = {
    initial: { scale: 0, opacity: 0.6 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={bgColor ? { backgroundColor: bgColor, backgroundImage: 'none' } : (variant === 'primary' ? { backgroundColor: '#FFA726', backgroundImage: 'none' } : undefined)}
      disabled={disabled || isLoading}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !isLoading ? "hover" : "initial"}
      whileTap={!disabled && !isLoading ? "tap" : "initial"}
      {...(props as any)}
    >
      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg pointer-events-none"
        variants={rippleVariants}
        initial="initial"
        animate={isLoading ? "animate" : "initial"}
      />
      
      {isLoading ? (
        <>
          <motion.svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
          <motion.span 
            className="opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Loading...
          </motion.span>
        </>
      ) : (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      )}
    </motion.button>
  );
};

export default Button;
