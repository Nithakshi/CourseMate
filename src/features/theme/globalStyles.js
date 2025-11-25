// src/theme/globalStyles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pagePadding: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  headerCurve: {
    backgroundColor: colors.primary,
    // header with gentle curve and reduced top space
    height: 120,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  largeTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.5,
    // When you add the custom CourseMate font, set fontFamily here, e.g.:
    // fontFamily: 'CourseMateFont',
  },
  roundedCard: {
    backgroundColor: colors.cardLight,
    borderRadius: 14,
    padding: 14,
  },
});
