// src/theme/colors.js
// Base color palettes for light and dark mode.

const light = {
  primary: '#548DE6',    // blue header
  primaryLight: '#EAF2FF',
  accent: '#2E6CD9',
  background: '#FFFFFF',
  cardLight: '#EEF6FF',
  text: '#222222',
  muted: '#7C8AA3',
  danger: '#E65555',
};

const dark = {
  // slightly deeper primary blue for dark mode header
  primary: '#3F6FD5',
  // slightly brighter blue for accents in dark mode
  primaryLight: '#123065',
  accent: '#7EA6FF',
  // dark navy instead of near-black
  background: '#06162E',
  cardLight: '#0C2344',
  text: '#F9FAFB',
  muted: '#9CA3AF',
  danger: '#F87171',
};

// keep default export for backward compatibility (light theme)
export const palettes = { light, dark };
export default light;
