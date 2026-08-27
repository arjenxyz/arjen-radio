import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'arjen-accent': '#6B8FD9',
        'arjen-accent-light': '#9BB4E8',
        'arjen-accent-dark': '#4A6BB5',
        'arjen-violet': '#8B7CC8',
        'arjen-dark': '#0a0b14',
      },
      
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite',
        'equalizer-2': 'equalizer 1.1s ease-in-out infinite 0.1s',
        'equalizer-3': 'equalizer 0.9s ease-in-out infinite 0.2s',
        'equalizer-4': 'equalizer 1.2s ease-in-out infinite 0.3s',
        'equalizer-5': 'equalizer 0.7s ease-in-out infinite 0.4s',
      },
      
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        equalizer: {
          '0%, 100%': { height: '10%' },
          '50%': { height: '100%' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
