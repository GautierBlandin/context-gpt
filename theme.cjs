const colors = require('tailwindcss/colors')

const globalColors = {
  main: colors.cyan,
  auxiliary: colors.teal,
  neutral: colors.slate,
  error: colors.red,
  success: colors.green,
  warning: colors.amber,
}

module.exports = {
  colors: globalColors,
  backgroundColor: {
    "main-primary": globalColors.main[600],
    "main-primary-hover": globalColors.main[500],
    "main-tertiary": globalColors.main[300],
    "neutral-primary": globalColors.neutral[50],
    "neutral-primary-hover": globalColors.neutral[100],
    "error-primary": globalColors.error[50],
  },
  borderColor: {
    "brand-primary": globalColors.main[400],
    "error-primary": globalColors.error[300],
  },
  textColor: {
    "neutral-primary": globalColors.neutral[800],
    "neutral-emphasis": globalColors.neutral[900],
    "neutral-muted": globalColors.neutral[400],
    "main-onprimary": colors.white,
    "error-primary": globalColors.error[600],
  },
  ringColor: {
    "main-primary": globalColors.main[600],
    "neutral-muted": globalColors.neutral[300],
    "error-primary": globalColors.error[300],
  }
};
