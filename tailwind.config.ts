import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-black',
    'text-white',
    'min-h-screen',
    'flex',
    'flex-col',
    'space-x-4',
    'overflow-x-auto',
    'pb-4',
    'px-6',
    'py-6',
    'mb-6',
    'container',
    'mx-auto',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        foreground: '#ffffff',
        primary: '#e50914',
        'card-bg': '#181818',
        'card-hover': '#232323',
      },
    },
  },
  plugins: [],
};

export default config; 