// src/features/auth/StartScreen.js
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';

export default function StartScreen({ navigation }) {
  const { colors: theme } = useThemeColors();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={[
        global.container,
        styles.center,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.logoWrap}>
        <Image
          source={require('../../assets/coursemate-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.primary }]}>CourseMate</Text>
      </View>

      <ActivityIndicator size="small" color={theme.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  spinner: {
    marginTop: 24,
  },
});
