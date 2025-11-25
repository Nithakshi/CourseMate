// src/features/profile/SettingsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDarkMode } from '../theme/themeSlice';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors: themeColors, darkMode } = useThemeColors();
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [appSounds, setAppSounds] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('settingsPrefs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.appSounds === 'boolean') {
            setAppSounds(parsed.appSounds);
          }
        }
      } catch (e) {
        console.warn('Failed to load settings prefs', e);
      } finally {
        setLoadingPrefs(false);
      }
    })();
  }, []);

  const persistPrefs = async (next) => {
    try {
      await AsyncStorage.setItem('settingsPrefs', JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist settings prefs', e);
    }
  };

  const handleToggleDark = async (value) => {
    dispatch(setDarkMode(value));
    try {
      await AsyncStorage.setItem('darkMode', value ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to persist dark mode flag', e);
    }
  };

  const handleToggleSounds = async (value) => {
    setAppSounds(value);
    await persistPrefs({ appSounds: value });
  };

  return (
    <View
      style={[
        global.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Header title="Settings" leftOnPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.cardLight,
              borderColor: themeColors.primary,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Appearance</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name={darkMode ? 'moon' : 'sun'}
                  size={18}
                  color={darkMode ? '#FACC6B' : themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>Dark mode</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>Toggle app theme</Text>
              </View>
            </View>

            <Switch
              value={darkMode}
              onValueChange={handleToggleDark}
              thumbColor={darkMode ? '#FACC6B' : '#f4f3f4'}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
            />
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.cardLight,
              borderColor: themeColors.primary,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>General</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name="volume-2"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>App sounds</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>Play sounds for important actions</Text>
              </View>
            </View>

            <Switch
              value={appSounds}
              onValueChange={handleToggleSounds}
              thumbColor={appSounds ? themeColors.primary : '#f4f3f4'}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
            />
          </View>

          {loadingPrefs ? (
            <Text style={[styles.loadingText, { color: themeColors.muted }]}>Loading preferences...</Text>
          ) : (
            <Text style={[styles.footerNote, { color: themeColors.muted }]}>These settings are stored only on this device and do not affect other installations.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rowSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
  },
  footerNote: {
    marginTop: 8,
    fontSize: 12,
  },
});
