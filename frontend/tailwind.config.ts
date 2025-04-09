import type { Config } from 'tailwindcss';

export default {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'hair-line': '#dadce0',
  			brand: '#b591ef',
  			'gray-250': '#c5c5c5',
  			'brand-0.4': 'rgba(181, 145, 239, 0.4)',
  			'white-0.2': 'rgba(255, 255, 255, 0.2)',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'1': '0 0 0 2px rgba(181, 145, 239, 0.4)',
  			'2': '4px 5px 17px -4px #088178',
  			'3': '0 0 0 4px rgb(181 145 239 / 10%)',
  			'4': 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
  			'5': '0 0 0 0.25rem rgba(181, 145, 239, 0.25)',
  			'6': '0px 0px 0px 2px #fff',
  			'7': '0 0 0 0.25rem #191919',
  			'8': 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'
  		},
  		fontFamily: {
  			lexend: [
  				'Lexend',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			'1.5xl': '1.4rem'
  		},
  		spacing: {
  			'13': '3.25rem',
  			'15': '3.75rem',
  			'18': '4.375rem',
  			'19': '4.525rem',
  			'30': '7.5rem',
  			'50': '12.5rem',
  			'68': '272px',
  			'75': '18.75rem',
  			'100': '25rem',
  			'175': '43.75rem',
  			'409': '409px',
  			'12/25': '48%',
  			'1.2px': '1.2px',
  			'5.5': '1.375rem',
  			'4.5': '1.125rem',
  			'3.25': '0.8125rem'
  		},
  		gridTemplateRows: {
  			calendar: 'repeat(6, calc((100vh - 50px) / 6))'
  		},
  		gridTemplateColumns: {
  			calendar: 'repeat(7, calc((100vw - 256px) / 7))'
  		},
  		borderWidth: {
  			'0.16': '0.16px'
  		},
  		flex: {
  			'3': '3 3 0%'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
