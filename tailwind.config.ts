/** @type {import('tailwindcss').Config} */
import TailwindCSSAnimation from "tailwindcss-animate";
import { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: {
          ...colors.teal,
          DEFAULT: colors.teal[400],
        },
        secondary: {
          ...colors.violet,
          DEFAULT: colors.violet[500],
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        josefin: "Josefin_Sans",
        kanit: ["Kanit", "sans-serif"],
      },
    },
  },
  plugins: [TailwindCSSAnimation],
};

export default config;
