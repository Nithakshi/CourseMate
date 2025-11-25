// src/features/profile/ProfileScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser, logout } from '../auth/authSlice';
import { setDarkMode } from '../theme/themeSlice';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { colors: themeColors, darkMode } = useThemeColors();

  const username = user?.username || 'User';
  const firstLetter = username.charAt(0).toUpperCase();
  const avatarUri = user?.avatar;

  // Initialize dark mode from AsyncStorage once
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('darkMode');
        if (saved != null) {
          dispatch(setDarkMode(saved === 'true'));
        }
      } catch (e) {
        console.warn('Failed to read dark mode flag', e);
      }
    })();
  }, [dispatch]);

  const handlePickAvatar = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets && response.assets[0];
        if (!asset?.uri) return;

        const updatedUser = { ...(user || {}), avatar: asset.uri };
        dispatch(setUser(updatedUser));
        try {
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Failed to persist avatar', e);
        }
      },
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuPress = key => {
    if (key === 'profile') {
      navigation.navigate('EditProfile');
    } else if (key === 'settings') {
      navigation.navigate('Settings');
    } else if (key === 'notifications') {
      navigation.navigate('Notifications');
    } else if (key === 'security') {
      navigation.navigate('SecurityPrivacy');
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

  const menuItems = [
    { key: 'profile', label: 'Profile', icon: 'user' },
    { key: 'settings', label: 'Setting', icon: 'settings' },
    { key: 'notifications', label: 'Notifications', icon: 'bell' },
    { key: 'security', label: 'Security & Privacy', icon: 'shield' },
    { key: 'logout', label: 'Logout', icon: 'log-out', onPress: handleLogout },
  ];

  return (
    <View
      style={[
        global.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Header title="Profile" leftOnPress={() => {}} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* avatar */}
        <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: themeColors.cardLight },
            ]}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text
                style={[
                  styles.avatarInitial,
                  { color: themeColors.text },
                ]}
              >
                {firstLetter}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* name, role and dark mode toggle */}
        <View style={styles.nameRow}>
          <View>
            <Text
              style={[
                styles.nameText,
                { color: themeColors.text },
              ]}
            >
              {username}
            </Text>
            <Text
              style={[
                styles.subtitleText,
                { color: themeColors.muted },
              ]}
            >
              Student
            </Text>
          </View>

          <View style={styles.toggleRow}>
            <Feather
              name={darkMode ? 'moon' : 'sun'}
              size={18}
              color={darkMode ? '#FACC6B' : themeColors.primary}
              style={{ marginRight: 6 }}
            />
              <Switch
                value={darkMode}
                onValueChange={handleToggleDark}
                thumbColor={darkMode ? '#FACC6B' : '#f4f3f4'}
                trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
              />
          </View>
        </View>

        {/* menu card */}
        <View
          style={[
            styles.menuCard,
            {
              backgroundColor: themeColors.cardLight,
              borderColor: themeColors.primary,
            },
          ]}
        >
          {menuItems.map((item, index) => (
              <TouchableOpacity
              key={item.key}
              style={[
                styles.menuRow,
                index === 0 && styles.menuRowFirst,
                index === menuItems.length - 1 && styles.menuRowLast,
              ]}
              activeOpacity={0.8}
              onPress={item.onPress || (() => handleMenuPress(item.key))}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[
                    styles.menuIconCircle,
                    { borderColor: themeColors.primary },
                  ]}
                >
                  <Feather
                    name={item.icon}
                    size={18}
                    color={themeColors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.menuLabel,
                    { color: themeColors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </View>

              {item.key !== 'logout' ? (
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={themeColors.muted}
                />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
  },
  nameRow: {
    width: '88%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  avatarWrap: {
    marginBottom: 16,
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarCircleDark: {
    backgroundColor: '#111827',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarInitial: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.primary,
  },
  avatarInitialDark: {
    color: '#E5E7EB',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  nameTextDark: {
    color: '#E5E7EB',
  },
  subtitleText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  subtitleTextDark: {
    color: '#9CA3AF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuCard: {
    width: '88%',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  menuCardDark: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#D7E3FB',
  },
  menuRowFirst: {
    borderTopWidth: 0,
  },
  menuRowLast: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});
