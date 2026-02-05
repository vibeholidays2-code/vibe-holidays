import { SelectHTMLAttributes, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    // Animation variants for the select container
    const containerVariants = {
      initial: { scale: 1 },
      focused: { 
        scale: 1.01,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }
      }
    };

    // Animation variants for the label
    const labelVariants = {
      initial: { 
        y: 0, 
        scale: 1, 
        color: '#6b7280' 
      },
      focused: { 
        y: -8, 
        scale: 0.85, 
        color: error ? '#dc2626' : '#1e40af',
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }
      }
    };

    // Animation variants for error messages
    const errorVariants = {
      initial: { opacity: 0, y: -10, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      },
      exit: { 
        opacity: 0, 
        y: -10, 
        scale: 0.95,
        transition: { 
          duration: 0.2 
        }
      }
    };

    // Animation variants for the dropdown arrow
    const arrowVariants = {
      initial: { rotate: 0 },
      focused: { 
        rotate: 180,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }
      }
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label 
            className="block text-sm font-medium mb-1 transition-colors duration-200"
            variants={labelVariants}
            initial="initial"
            animate={isFocused || hasValue ? "focused" : "initial"}
          >
            {label}
            {props.required && (
              <motion.span 
                className="text-red-500 ml-1"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: error ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                *
              </motion.span>
            )}
          </motion.label>
        )}
        
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate={isFocused ? "focused" : "initial"}
          className="relative"
        >
          <motion.select
            ref={ref}
            className={`w-full px-4 py-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 min-h-[48px] text-base appearance-none bg-white ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : isFocused
                ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500 shadow-soft'
                : 'border-neutral-300 hover:border-neutral-400'
            } ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            whileFocus={{ 
              boxShadow: error 
                ? "0 0 0 3px rgba(220, 38, 38, 0.1)" 
                : "0 0 0 3px rgba(30, 64, 175, 0.1)"
            }}
            {...(props as any)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
          
          {/* Custom dropdown arrow */}
          <motion.div
            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            variants={arrowVariants}
            initial="initial"
            animate={isFocused ? "focused" : "initial"}
          >
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                error ? 'text-red-500' : isFocused ? 'text-primary-500' : 'text-neutral-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
          
          {/* Focus indicator line */}
          <motion.div
            className={`absolute bottom-0 left-0 h-0.5 ${
              error ? 'bg-red-500' : 'bg-primary-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: isFocused ? '100%' : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p 
              className="mt-2 text-sm text-red-600 flex items-center"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key="error"
            >
              <motion.svg
                className="w-4 h-4 mr-1 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </motion.svg>
              {error}
            </motion.p>
          )}
          
          {helperText && !error && (
            <motion.p 
              className="mt-2 text-sm text-neutral-500"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              key="helper"
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
