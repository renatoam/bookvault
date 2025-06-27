/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import clamp from "@tailwindcss/line-clamp"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui, clamp],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
    logs: true,
  },
};
