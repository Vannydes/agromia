import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: 'var(--accent-olive)',
        beige: 'var(--bg-primary)',
        soft: 'var(--text-muted)',
        card: 'var(--bg-card)',
        surface: 'var(--bg-surface)',
        primary: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        border: 'var(--border-color)',
        accent: {
          green: 'var(--accent-green)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
