/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["PixelatedElegance", "sans-serif"],
        pixeboy: ["Pixeboy", "sans-serif"],
      },
    },
  },
  plugins: [],
};
