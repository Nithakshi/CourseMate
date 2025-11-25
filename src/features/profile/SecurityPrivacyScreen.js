// src/features/profile/SecurityPrivacyScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SecurityPrivacyScreen({ navigation }) {
  const { colors: themeColors } = useThemeColors();
  const [prefs, setPrefs] = useState({
    requireLoginOnStart: true,
    biometricUnlock: false,
    shareUsageAnalytics: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('securityPrefs');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPrefs(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn('Failed to load security prefs', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    try {
      await AsyncStorage.setItem('securityPrefs', JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist security prefs', e);
    }
  };

  const togglePref = key => async (value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    await persist(next);
  };

  return (
    <View
      style={[
        global.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Header title="Security & Privacy" leftOnPress={() => navigation.goBack()} />

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
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Account security</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name="lock"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>Require login on app start</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>When enabled, CourseMate will ask you to log in again after the app has been closed.</Text>
              </View>
            </View>

            <Switch
              value={prefs.requireLoginOnStart}
              onValueChange={togglePref('requireLoginOnStart')}
              thumbColor={prefs.requireLoginOnStart ? themeColors.primary : '#f4f3f4'}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name="shield"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>Biometric unlock</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>Use device biometric authentication where available. This is a visual setting; you may still need to enable biometrics in system settings.</Text>
              </View>
            </View>

            <Switch
              value={prefs.biometricUnlock}
              onValueChange={togglePref('biometricUnlock')}
              thumbColor={prefs.biometricUnlock ? themeColors.primary : '#f4f3f4'}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
            />
          </View>

          {loading ? (
            <Text style={[styles.loadingText, { color: themeColors.muted }]}>Loading security settings...</Text>
          ) : null}
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
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Data & privacy</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name="activity"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>Share anonymous usage analytics</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>In a real deployment this would control sending anonymized usage data. For this coursework app, no analytics are actually sent.</Text>
              </View>
            </View>

            <Switch
              value={prefs.shareUsageAnalytics}
              onValueChange={togglePref('shareUsageAnalytics')}
              thumbColor={prefs.shareUsageAnalytics ? themeColors.primary : '#f4f3f4'}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
            />
          </View>

          <Text style={[styles.infoText, { color: themeColors.muted }]}>CourseMate stores your profile, favourites and theme preferences locally on this device using secure storage (AsyncStorage). The only network requests are course lookups to the public Open Library API; your profile data is not sent to any backend.</Text>
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
  infoText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
  },
});
