/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                primary: "#ffffff",
                secondary: "#f8fafc",
                accent: "#10b981", // Emerald-500
                danger: "#ef4444",
                warning: "#f59e0b",
                info: "#3b82f6",
            },
            boxShadow: {
                'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 4px 10px -5px rgba(0, 0, 0, 0.03)',
                'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [],
}
