import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    primary: "#0A0A0A",
                    secondary: "#111111",
                    card: "#1A1A1A",
                    elevated: "#222222",
                },
                border: {
                    default: "#2A2A2A",
                    subtle: "#1F1F1F",
                },
                accent: {
                    red: "#FF3B3B",
                    orange: "#FF7A00",
                },
                text: {
                    primary: "#F5F5F5",
                    secondary: "#888888",
                    muted: "#555555",
                    disabled: "#333333",
                },
            },
            fontFamily: {
                syne: ["Syne", "sans-serif"],
                dm: ["DM Sans", "sans-serif"],
            },
            borderRadius: {
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "20px",
                full: "9999px",
            },
            boxShadow: {
                card: "0 4px 24px rgba(0,0,0,0.6)",
                elevated: "0 8px 40px rgba(0,0,0,0.8)",
                "glow-accent": "0 0 20px rgba(255,59,59,0.25)",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-1000px 0" },
                    "100%": { backgroundPosition: "1000px 0" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(0)" },
                },
            },
            animation: {
                shimmer: "shimmer 1.5s infinite linear",
                "fade-in": "fade-in 0.3s ease forwards",
                "slide-in": "slide-in 0.3s ease forwards",
            },
            backgroundImage: {
                "accent-gradient": "linear-gradient(135deg, #FF3B3B, #FF7A00)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
