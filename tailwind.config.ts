import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'hair-line': '#dadce0',
        brand: '#b591ef',
        'gray-250': '#c5c5c5',
        'brand-0.4': 'rgba(181, 145, 239, 0.4)',
        'white-0.2': 'rgba(255, 255, 255, 0.2)',
      },
      boxShadow: {
        '1': '0 0 0 2px rgba(181, 145, 239, 0.4)',
        '2': '4px 5px 17px -4px #088178',
        '3': '0 0 0 4px rgb(181 145 239 / 10%)',
        '4': 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
        '5': '0 0 0 0.25rem rgba(181, 145, 239, 0.25)',
        '6': '0px 0px 0px 2px #fff',
        '7': '0 0 0 0.25rem #191919',
        '8': 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
      },
      fontSize: {
        '1.5xl': '1.4rem',
      },
      spacing: {
        '50': '12.5rem',
        '12/25': '48%',
        '18': '4.375rem',
        '1.2px': '1.2px',
        '5.5': '1.375rem',
        '68': '272px',
        '409': '409px',
        '15': '3.75rem',
        '13': '3.25rem',
        '75': '18.75rem',
        '175': '43.75rem',
        '30': '7.5rem',
        '4.5': '1.125rem',
        '3.25': '0.8125rem',
        '100': '25rem',
      },
      gridTemplateRows: {
        calendar: 'repeat(6, calc((100vh - 50px) / 6))',
      },
      gridTemplateColumns: {
        calendar: 'repeat(7, calc((100vw - 256px) / 7))',
      },
      borderWidth: {
        '0.16': '0.16px',
      },
      flex: {
        '3': '3 3 0%',
      },
    },
  },
  plugins: [],
} satisfies Config;
