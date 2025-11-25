// src/features/profile/NotificationsScreen.js
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

export default function NotificationsScreen({ navigation }) {
  const { colors: themeColors } = useThemeColors();
  const [prefs, setPrefs] = useState({
    appNotifications: true,
    courseReminders: true,
    emailUpdates: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('notificationPrefs');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPrefs(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn('Failed to load notification prefs', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    try {
      await AsyncStorage.setItem('notificationPrefs', JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist notification prefs', e);
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
      <Header title="Notifications" leftOnPress={() => navigation.goBack()} />

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
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Push notifications</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name="bell"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>App notifications</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>Allow CourseMate to send alerts</Text>
              </View>
            </View>

            <Switch
              value={prefs.appNotifications}
              onValueChange={togglePref('appNotifications')}
              thumbColor={prefs.appNotifications ? themeColors.primary : '#f4f3f4'}
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
                  name="clock"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>Course reminders</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>Remind me about saved courses</Text>
              </View>
            </View>

            <Switch
              value={prefs.courseReminders}
              onValueChange={togglePref('courseReminders')}
              thumbColor={prefs.courseReminders ? themeColors.primary : '#f4f3f4'}
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
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Email</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: themeColors.primary },
                ]}
              >
                <Feather
                  name="mail"
                  size={18}
                  color={themeColors.primary}
                />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: themeColors.text }]}>Email updates</Text>
                <Text style={[styles.rowSub, { color: themeColors.muted }]}>News and tips about courses</Text>
              </View>
            </View>

            <Switch
              value={prefs.emailUpdates}
              onValueChange={togglePref('emailUpdates')}
              thumbColor={prefs.emailUpdates ? themeColors.primary : '#f4f3f4'}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
            />
          </View>

          {loading ? (
            <Text style={[styles.loadingText, { color: themeColors.muted }]}>Loading preferences...</Text>
          ) : (
            <Text style={[styles.footerNote, { color: themeColors.muted }]}>Notification preferences apply only to this device. CourseMate does not send marketing messages beyond what you enable here.</Text>
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
