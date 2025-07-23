module.exports = {
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {
        "fn-green": "rgb(147, 182, 65)",
        "fn-red": "rgb(231, 46, 41)",
      },
      animation: {
        in: "slideInFromTop 0.3s ease-out",
      },
      keyframes: {
        slideInFromTop: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "fn-gradient":
          "linear-gradient(135deg, rgb(147, 182, 65), rgb(231, 46, 41))",
      },
    },
  },
};
