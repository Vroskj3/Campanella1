/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        error: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(8deg)" },
          "20%": { transform: "rotate(-2deg)" },
          "30%": { transform: "rotate(8deg)" },
          "40%": { transform: "rotate(0.0deg)" },
          "50%": { transform: "rotate(4.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
      },
      animation: {
        wave: "wave 1.5s linear infinite",
        error: "error 0.75s",
      },
      backgroundImage: {
        "foto-marconi": "url('src/assets/foto_marconi.jpg')",
        "sfondo-cortile": "url('src/assets/sfondo_cortile.jpg')",
      },
    },
  },
  plugins: [],
};
