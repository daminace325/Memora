import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],  // Add Pacifico font
      },
      colors: {
        'ig-red': "var(--red)",
        'ig-orange': "var(--orange)",
      },
    },
  },
  plugins: [],
} satisfies Config;
