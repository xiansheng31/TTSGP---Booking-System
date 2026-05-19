import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#0f1623',
          hover: '#1a2333',
          active: '#1e2d45',
          border: '#1e2d3d',
        },
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        status: {
          available:   '#22c55e',
          booked:      '#ef4444',
          unavailable: '#94a3b8',
          pending:     '#f59e0b',
          approved:    '#22c55e',
          cancelled:   '#ef4444',
          completed:   '#64748b',
        },
      },
      width: {
        sidebar: '240px',
      },
    },
  },
  plugins: [],
}

export default config
