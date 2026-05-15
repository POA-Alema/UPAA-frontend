/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#E9C46A',
        primary: '#FFFFFF',
        secondary: '#9CA3AF',
      },
    },
  },
  plugins: [],
};
