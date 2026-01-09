import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E7DED7",
        input: "#E7DED7",
        ring: "#E56B4E",
        background: "#FFF7F3",
        foreground: "#1F2328",
        primary: {
          DEFAULT: "#E56B4E",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4C7B8",
          foreground: "#1F2328",
        },
        destructive: {
          DEFAULT: "#D45A3E",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F6EFEA",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F4C7B8",
          foreground: "#1F2328",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2328",
        },
        card: {
          DEFAULT: "#F6EFEA",
          foreground: "#1F2328",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
