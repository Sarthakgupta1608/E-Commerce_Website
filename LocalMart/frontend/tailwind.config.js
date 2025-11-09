/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
        },
        background: '#f8fafc',
        foreground: '#111827',
        card: '#ffffff',
        'card-foreground': '#111827',
        muted: '#f3f4f6',
        'muted-foreground': '#4b5563',
        border: '#d1d5db',
        input: '#e5e7eb',
        ring: '#4f46e5',
      },
    },
  },
  plugins: [],
}
