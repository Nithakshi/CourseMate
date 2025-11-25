// src/features/auth/LoginScreen.js
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
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { colors: theme } = useThemeColors();

  const validate = () => {
    const nextErrors = {};
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      nextErrors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      return;
    }

    const trimmedUsername = username.trim();

    try {
      await dispatch(
        login({ username: trimmedUsername, password }),
      ).unwrap();
      // RootNavigator will redirect to tabs automatically (auth slice change)
    } catch (err) {
      const message = String(err || 'Login failed');
      if (message.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, password: message }));
      } else {
        setErrors(prev => ({ ...prev, username: message }));
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[global.container, { backgroundColor: theme.background }] }>
        <Header title="CourseMate" leftOnPress={() => {}} />

        <View style={{ flex: 1 }}>
          {/* soft background circle like the design */}
          <View style={[styles.backCircle, { backgroundColor: theme.primaryLight }]} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>Login to continue learning with CourseMate</Text>

            <View style={styles.card}>
              <Input
                label="User name"
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                error={errors.username}
              />

              <Input
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={theme.muted}
                    />
                  </TouchableOpacity>
                }
                error={errors.password}
              />

              <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
                <Text style={[styles.forgotText, { color: theme.muted }]}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={submit} style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.primaryBtnText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.secondaryAction}
              >
                <Text style={[styles.secondaryText, { color: theme.muted }]}>New here? Create an account</Text>
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  forgotText: {
    fontSize: 12,
    color: colors.muted,
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
