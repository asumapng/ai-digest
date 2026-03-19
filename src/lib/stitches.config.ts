import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  config,
  getCssText,
} = createStitches({
  theme: {
    colors: {
      black: '#000000',
      orange: '#C87941',
      orangeDark: '#a66436',
      gray: '#888888',
      white: '#ffffff',
      accent: '#C87941',
      background: '#000000',
      surface: '#0a0a0a',
      border: '#333333',
    },
    fonts: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '48px',
      8: '64px',
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
      4: '18px',
      5: '24px',
      6: '32px',
      7: '48px',
    },
  },
  media: {
    bp1: '(min-width: 640px)',
    bp2: '(min-width: 768px)',
    bp3: '(min-width: 1024px)',
  },
});

export const globalStyles = globalCss({
  '*': { margin: 0, padding: 0, boxSizing: 'border-box' },
  body: {
    backgroundColor: '$background',
    color: '$white',
    fontFamily: '$sans',
    '-webkit-font-smoothing': 'antialiased',
  },
  a: { color: 'inherit', textDecoration: 'none' },
});
