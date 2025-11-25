// src/features/profile/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../auth/authSlice';
import Input from '../components/Input';

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { colors: themeColors } = useThemeColors();

  const [username, setUsername] = useState(user?.username || '');
  const [about, setAbout] = useState(user?.about || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors: { username?: string } = {};
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      nextErrors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const trimmedUsername = username.trim();
    const updatedUser = {
      ...(user || {}),
      username: trimmedUsername,
      about,
    };

    dispatch(setUser(updatedUser));
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to persist user', e);
    }

    navigation.goBack();
  };

  return (
    <View
      style={[
        global.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Header title="Edit Profile" leftOnPress={() => navigation.goBack()} />

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
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Basic info</Text>

          <Input
            label="User name"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />

          <Text style={[styles.label, { color: themeColors.muted }]}>About you</Text>
          <View
            style={[
              styles.aboutBox,
              {
                backgroundColor: themeColors.cardLight,
                borderColor: themeColors.primary,
              },
            ]}
          >
            <TextInput
              value={about}
              onChangeText={setAbout}
              placeholder="Tell others a little about yourself"
              placeholderTextColor={themeColors.muted}
              multiline
              style={[styles.aboutInput, { color: themeColors.text }]}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.primaryBtn, { backgroundColor: themeColors.primary }]}
          >
            <Text style={styles.primaryBtnText}>Save changes</Text>
          </TouchableOpacity>

          <Text style={[styles.footerNote, { color: themeColors.muted }]}>Your profile information is stored locally on this device and used only to personalize your CourseMate experience.</Text>
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginTop: 12,
    marginBottom: 6,
  },
  aboutBox: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 96,
  },
  aboutInput: {
    fontSize: 14,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 26,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  footerNote: {
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
  },
});
