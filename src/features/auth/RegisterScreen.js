// src/features/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import global from '../theme/globalStyles';
import { useDispatch } from 'react-redux';
import { register } from './authSlice';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { colors: theme } = useThemeColors();

  const evaluateStrength = (value) => {
    if (!value) return '';

    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (score >= 3) return 'Strong';
    if (score === 2) return 'Medium';
    return 'Weak';
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      nextErrors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else {
      const strength = evaluateStrength(password);
      if (strength === 'Weak') {
        nextErrors.password = 'Password is too weak. Use at least 8 characters including letters, numbers and a symbol.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      return;
    }

    try {
      await dispatch(
        register({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      ).unwrap();
      // on success user is logged in; RootNavigator will show main tabs
    } catch (err) {
      const message = String(err || 'Sign up failed');
      if (message.toLowerCase().includes('username')) {
        setErrors(prev => ({ ...prev, username: message }));
      } else {
        setErrors(prev => ({ ...prev, password: message }));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[global.container, { backgroundColor: theme.background }] }>
        <Header title="CourseMate" leftOnPress={() => navigation.goBack()} />

        <View style={{ flex: 1 }}>
          {/* soft background circle like the design */}
          <View style={[styles.backCircle, { backgroundColor: theme.primaryLight }]} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { color: theme.text }]}>Sign up</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>Create your CourseMate account</Text>

            <View style={styles.card}>
              <Input
                label="User name"
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                error={errors.username}
              />
              <Input
                label="Email Address"
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
              />
              <Input
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  setPasswordStrength(evaluateStrength(value));
                }}
                secureTextEntry
                error={errors.password}
              />

              {password ? (
                <Text
                  style={[
                    styles.strengthText,
                    passwordStrength === 'Strong'
                      ? { color: '#16A34A' }
                      : passwordStrength === 'Medium'
                      ? { color: '#F59E0B' }
                      : { color: '#DC2626' },
                  ]}
                >
                  Password strength: {passwordStrength || 'Weak'}
                </Text>
              ) : null}

              <TouchableOpacity onPress={submit} style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.primaryBtnText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.secondaryAction}
              >
                <Text style={[styles.secondaryText, { color: theme.muted }]}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.illustrationWrap}>
              <Image
                source={require('../../assets/coursemate-logo.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  backCircle: {
    position: 'absolute',
    right: -90,
    top: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primaryLight,
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
  secondaryAction: {
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 13,
    color: colors.muted,
  },
  illustrationWrap: {
    marginTop: 28,
    alignItems: 'center',
  },
  illustration: {
    width: 260,
    height: 240,
  },
});
