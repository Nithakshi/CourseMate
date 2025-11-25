// src/components/Input.js
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';

export default function Input({
  label,
  secureTextEntry,
  value,
  onChangeText,
  placeholder,
  rightIcon,
  error,
}) {
  const { colors: theme } = useThemeColors();

  return (
    <View style={{ marginVertical: 8 }}>
      {label ? <Text style={[styles.label, { color: theme.muted }]}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: theme.cardLight,
            borderColor: error ? theme.danger : '#D7E3FB',
          },
        ]}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={theme.muted}
        />
        {rightIcon ? rightIcon : null}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, marginBottom: 6, marginLeft: 6, fontSize: 13 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7E3FB',
    paddingHorizontal: 12,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 10,
    fontSize: 12,
  },
});
