import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Coinbase/Base brand colors
                'base-blue': '#0052FF',
                'base-blue-light': '#1E6FFF',
                'base-blue-dark': '#0039B3',
                'base-white': '#FFFFFF',
                'base-gray': {
                    50: '#F7F7F8',
                    100: '#ECECEE',
                    200: '#D1D1D6',
                    300: '#A1A1AA',
                    400: '#71717A',
                    500: '#52525B',
                    600: '#3F3F46',
                    700: '#27272A',
                    800: '#18181B',
                    900: '#09090B',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
