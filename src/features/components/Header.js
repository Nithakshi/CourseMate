// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

// App-wide header styled to closely match the CourseMate mockup.
// Simple blue bar with large title text and an outlined circular back button.
// Optionally shows a subtitle (e.g. "Hi username 👋") under the title.
export default function Header({ title, leftOnPress, subtitle }) {
  const handlePress = leftOnPress ?? (() => {});
  const { colors: theme } = useThemeColors();
  const user = useSelector(state => state.auth?.user);
  const autoSubtitle = user?.username ? `Hi ${user.username} 👋` : null;
  const finalSubtitle = subtitle !== undefined ? subtitle : autoSubtitle;

  return (
    <View style={[global.headerCurve, { backgroundColor: theme.primary }] }>
      <View style={styles.row}>
        <TouchableOpacity onPress={handlePress} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.textColumn}>
          <Text style={[global.largeTitle, styles.title]} numberOfLines={1}>
            {title}
          </Text>
          {finalSubtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {finalSubtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    // left aligned, similar to mockup
    flexShrink: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 18,
    color: '#E5ECFF',
  },
});
