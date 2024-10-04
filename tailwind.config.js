const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./templates/**/*.html', './static/**/*.js'],
  darkMode: 'class', // Enable dark mode via class strategy
  theme: {
    extend: {
      // Define custom color palettes for each personality
      colors: {
        primary: colors.blue,
        secondary: colors.purple,
        evelyn: {
          light: '#6D28D9', // Purple-700
          DEFAULT: '#7C3AED', // Purple-600
          dark: '#A78BFA', // Purple-400
        },
        max: {
          light: '#3B82F6', // Blue-500
          DEFAULT: '#2563EB', // Blue-600
          dark: '#93C5FD', // Blue-300
        },
        luna: {
          light: '#10B981', // Emerald-500
          DEFAULT: '#059669', // Emerald-600
          dark: '#6EE7B7', // Emerald-400
        },
        oscar: {
          light: '#F59E0B', // Amber-500
          DEFAULT: '#D97706', // Amber-600
          dark: '#FCD34D', // Amber-300
        },
      },
      // Extend font families
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
        display: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      // Define additional animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s infinite',
        'zoom-in': 'zoomIn 0.5s ease-out forwards',
      },
      // Define keyframes for custom animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      // Custom spacing scales
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Custom box shadows
      boxShadow: {
        'xl-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      // Background images or gradients per personality
      backgroundImage: theme => ({
        'evelyn-gradient': 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
        'max-gradient': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        'luna-gradient': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'oscar-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      }),
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active'],
      textColor: ['active'],
      scale: ['active', 'group-hover'],
      translate: ['group-hover'],
      rotate: ['group-hover'],
      // Add more variants as needed
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'), // For better text styling
    require('@tailwindcss/aspect-ratio'), // For responsive media
  ],
};