import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Bodoni Moda'],
        secondary: ['Smooch Sans'],
      },
      colors: {
        primary: '#2e2c2c',
        secondary: '#B89D4F',
      },
      backgroundColor: {
        backdrop: '#0000003f',
      },
      animation: {
        fade_third: 'fade 0.3s ease-in-out',
        fade_third_delay: 'fade 0.3s ease-in-out 0.5s',
        fade_half: 'fade 0.5s ease-in-out',
        fade_1: 'fade 1s ease-in-out',
        fade_2: 'fade 2s ease-in-out',
        shrink: 'shrink 0.1s ease-in-out 0.4s forwards',
      },
      keyframes: {
        shrink: {
          '0%': { scale: '100%' },
          '100%': { scale: '0%' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
