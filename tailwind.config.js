/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: '#0F172A',
        foreground: '#F8FAFC',
        card: '#1E293B',
        'card-foreground': '#F8FAFC',
        primary: '#3B82F6',
        'primary-foreground': '#FFFFFF',
        accent: '#F97316',
        muted: '#334155',
        'muted-foreground': '#94A3B8',
        border: '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
