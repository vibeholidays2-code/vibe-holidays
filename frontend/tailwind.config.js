/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // Light Mint - Primary Color (replacing yellow)
        primary: {
          50: '#e0f2f1',
          100: '#b2dfdb', // Light Mint - main color
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
        // Light Mint - Secondary Color (same as primary for consistency)
        secondary: {
          50: '#e0f2f1',
          100: '#b2dfdb', // Light Mint - main color
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
        // Light Mint - Accent Color (same as primary for consistency)
        accent: {
          50: '#e0f2f1',
          100: '#b2dfdb', // Light Mint - main color
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
        // Sophisticated Neutral Palette - Warm Beige/Cream (No Blue)
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Success States
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // Main success color
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Error States
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Main error color
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      // Professional Typography Scale
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }],        // 48px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // Enhanced Spacing System (4px base unit)
      spacing: {
        '0.5': '0.125rem', // 2px
        '1': '0.25rem',    // 4px
        '1.5': '0.375rem', // 6px
        '2': '0.5rem',     // 8px
        '2.5': '0.625rem', // 10px
        '3': '0.75rem',    // 12px
        '3.5': '0.875rem', // 14px
        '4': '1rem',       // 16px
        '5': '1.25rem',    // 20px
        '6': '1.5rem',     // 24px
        '7': '1.75rem',    // 28px
        '8': '2rem',       // 32px
        '10': '2.5rem',    // 40px
        '12': '3rem',      // 48px
        '16': '4rem',      // 64px
        '20': '5rem',      // 80px
        '24': '6rem',      // 96px
      },
      // Professional Shadow and Elevation System
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-subtle': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      // Border Radius System
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      // Animation and Transition System - 120fps Ultra Smooth
      transitionDuration: {
        '25': '25ms',
        '50': '50ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'ease-in-out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-smooth': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-smooth': 'cubic-bezier(0.4, 0, 1, 1)',
        'bounce-smooth': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        'ultra-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      // Custom Animations
      keyframes: {
        'slide-in-from-right': {
          'from': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        'fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          'from': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-2px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'pulse-soft': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
        'wiggle': {
          '0%, 100%': {
            transform: 'rotate(-1deg)',
          },
          '50%': {
            transform: 'rotate(1deg)',
          },
        },
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-down': {
          'from': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'zoom-in': {
          'from': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-4px)',
          },
        },
        'ken-burns': {
          '0%': {
            transform: 'scale(1) translate(0%, 0%)',
          },
          '50%': {
            transform: 'scale(1.08) translate(-1%, -1%)',
          },
          '100%': {
            transform: 'scale(1) translate(0%, 0%)',
          },
        },
      },
      animation: {
        'slide-in-from-right': 'slide-in-from-right 300ms ease-out forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 300ms ease-out forwards',
        'scale-in': 'scale-in 200ms ease-out forwards',
        'bounce-subtle': 'bounce-subtle 1s infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-up': 'slide-up 300ms ease-out forwards',
        'slide-down': 'slide-down 300ms ease-out forwards',
        'zoom-in': 'zoom-in 200ms ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'ken-burns': 'ken-burns 18s ease-in-out infinite',
      },
      // Gradient System - White and Light Mint Only
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #80cbc4 0%, #b2dfdb 100%)', // Mint gradient
        'gradient-secondary': 'linear-gradient(135deg, #b2dfdb 0%, #e0f2f1 100%)', // Light mint gradient
        'gradient-accent': 'linear-gradient(135deg, #e0f2f1 0%, #f1f8f7 100%)', // Very light mint gradient
        'gradient-hero': 'linear-gradient(135deg, #ffffff 0%, #e0f2f1 50%, #b2dfdb 100%)', // White to mint
        'gradient-subtle': 'linear-gradient(135deg, #ffffff 0%, #fafffe 100%)', // Subtle white background
      },
    },
  },
  plugins: [],
};
