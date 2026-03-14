/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#05050f',
        card: '#13131a',
        primary: '#7c3aed',
        secondary: '#3b82f6',
        accent: '#ec4899',
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        textPrimary: '#f1f5f9',
        textMuted: '#64748b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px -5px rgba(124, 58, 237, 0.4)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
        'glow-green': '0 0 20px -5px rgba(34, 197, 94, 0.4)',
        'glow-yellow': '0 0 20px -5px rgba(234, 179, 8, 0.4)',
        'panel': '0 22px 60px -28px rgba(0, 0, 0, 0.65)',
      }
    }
  },
  plugins: [],
};
