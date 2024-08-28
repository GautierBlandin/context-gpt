const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#606C38',
        secondary: '#283618',
        background: '#FEFAE0',
        accent: '#DDA15E',
        highlight: '#BC6C25',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
