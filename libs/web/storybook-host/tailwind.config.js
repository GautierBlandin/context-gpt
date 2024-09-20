const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const theme = require('../../../theme.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '/../../**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: theme,
  },
  plugins: [require('@tailwindcss/forms')],
};
