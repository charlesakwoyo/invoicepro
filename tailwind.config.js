/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#818CF8',
        },
        secondary: '#10B981',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
