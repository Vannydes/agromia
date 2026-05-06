import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: '#245e3e',
        beige: '#f5eedc',
        soft: '#8b8b8b'
      }
    }
  },
  plugins: []
};

export default config;
