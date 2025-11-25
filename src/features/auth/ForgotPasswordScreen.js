// src/features/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import global from '../theme/globalStyles';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const { colors: theme } = useThemeColors();

  const validate = () => {
    const nextErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Demo behaviour: just show a message.
    Alert.alert(
      'Password reset',
      'If this email exists, a reset link has been "sent". (Demo only, no real email is sent.)',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[global.container, { backgroundColor: theme.background }]}>
        <Header title="Forgot password" leftOnPress={() => navigation.goBack()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: theme.text }]}>Reset your password</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Enter the email address you use for CourseMate. In a real app, we would send a
            password reset link to this address.
          </Text>

          <View style={styles.card}>
            <Input
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />

            <Text
              style={[styles.helperText, { color: theme.muted }]}
            >
              This is a demo screen; no real email will be sent.
            </Text>

            <View style={styles.buttonWrap}>
              <Text
                onPress={handleSubmit}
                style={[styles.primaryBtnText, { backgroundColor: theme.primary }]}
              >
                Send reset link
              </Text>
            </View>
          </View>
        </ScrollView>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 18,
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
  helperText: {
    fontSize: 12,
    marginTop: 8,
  },
  buttonWrap: {
    marginTop: 18,
    borderRadius: 26,
    overflow: 'hidden',
  },
  primaryBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    paddingVertical: 13,
    borderRadius: 26,
  },
});
