/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'toc': '840px',
      'lg': '1140px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /* Background hierarchy (由深到浅) */
        page: "rgb(var(--ce-bg-page) / <alpha-value>)",
        card: "rgb(var(--ce-bg-card) / <alpha-value>)",
        hero: "rgb(var(--ce-bg-hero) / <alpha-value>)",
        hover: "rgb(var(--ce-bg-hover) / <alpha-value>)",

        /* Text hierarchy (由主到次) */
        primary: "rgb(var(--ce-text-primary) / <alpha-value>)",
        secondary: "rgb(var(--ce-text-secondary) / <alpha-value>)",
        hint: "rgb(var(--ce-text-hint) / <alpha-value>)",
        "on-hero": "rgb(var(--ce-text-hero) / <alpha-value>)",

        /* Border */
        border: "rgb(var(--ce-border) / <alpha-value>)",

        /* Accent */
        accent: "rgb(var(--ce-accent) / <alpha-value>)",
        red: "rgb(var(--ce-red) / <alpha-value>)",

        rl: {
          teal: '#4B8D9E',
          gold: '#C29145',
          red: '#A33332',
          green: '#3A8C6F',
        },

      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate")
  ],
}