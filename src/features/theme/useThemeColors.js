// src/features/theme/useThemeColors.js
import { useSelector } from 'react-redux';
import { palettes } from './colors';

export default function useThemeColors() {
  const darkMode = useSelector(state => state.theme.darkMode);
  const colors = darkMode ? palettes.dark : palettes.light;
  return { colors, darkMode };
}
