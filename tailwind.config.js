/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        cmi: {
          yellow: '#FFD400',
          yellowHover: '#E6BF00',
          yellowDark: '#CCAA00',
          yellowLight: '#FFF8D6',
          blue: '#0066FF',
          blueDark: '#0052CC',
          blueAccent: '#0A84FF',
          blueLight: '#EAF3FF',
          cyan: '#00BCD4',
          cyanDark: '#00ACC1',
          cyanAccent: '#00E5FF',
          cyanLight: '#E8FCFF',
          dark: '#111827',
          darkSurface: '#1F2937',
          grayBg: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
}
