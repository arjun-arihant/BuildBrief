/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmos: {
                    bg: "#0B1120", // Deep Slate
                    card: "rgba(15, 23, 42, 0.6)", // Glass
                    border: "rgba(56, 189, 248, 0.2)", // Subtle Blue
                    primary: "#7C3AED", // Nebula Purple
                    secondary: "#38BDF8", // Starlight Blue
                    text: "#F8FAFC", // Slate 50
                    muted: "#94A3B8", // Slate 400
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'cosmos-gradient': "radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0B1120 100%)",
            }
        },
    },
    plugins: [],
}
