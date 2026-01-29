/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Aurora Theme - Creative, warm, inviting
                aurora: {
                    bg: "#0F0F12",           // Deep charcoal
                    surface: "#18181B",       // Card backgrounds
                    surfaceHover: "#27272A",  // Hover states
                    primary: "#8B5CF6",       // Violet (actions)
                    primaryHover: "#7C3AED",  // Violet darker
                    secondary: "#F59E0B",     // Amber (highlights)
                    accent: "#06B6D4",        // Cyan (info)
                    success: "#10B981",       // Emerald
                    warning: "#F97316",       // Orange
                    error: "#EF4444",         // Red
                    text: "#FAFAFA",          // Primary text
                    muted: "#A1A1AA",         // Secondary text
                    border: "#27272A",        // Subtle borders
                    glow: "rgba(139, 92, 246, 0.15)", // Primary glow
                },
                // Keep cosmos for backward compat during transition
                cosmos: {
                    bg: "#0B1120",
                    card: "rgba(15, 23, 42, 0.6)",
                    border: "rgba(56, 189, 248, 0.2)",
                    primary: "#7C3AED",
                    secondary: "#38BDF8",
                    text: "#F8FAFC",
                    muted: "#94A3B8",
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'aurora-gradient': "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent)",
                'aurora-glow': "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent 50%)",
                'grain': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\" opacity=\"0.04\"/%3E%3C/svg%3E')",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
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
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
                'soft': '0 4px 20px rgba(0, 0, 0, 0.3)',
                'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
        },
    },
    plugins: [],
}
