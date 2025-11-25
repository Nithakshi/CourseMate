// src/components/CourseCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';

export default function CourseCard({ course, onPress, isFav, onFav }) {
  const { colors: theme } = useThemeColors();
  // Open Library cover URL if available
  const imageUri = course.cover_i
    ? `https://covers.openlibrary.org/b/id/${course.cover_i}-L.jpg`
    : 'https://via.placeholder.com/300x180.png?text=Course+Image';

  return (
    <View style={[styles.container, { backgroundColor: theme.cardLight }] }>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text numberOfLines={2} style={[styles.title, { color: theme.text }]}>{course.title}</Text>
        <Text numberOfLines={1} style={[styles.meta, { color: theme.muted }]}>{course.author_name}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => onPress(course)} style={styles.startButton}>
            <Text style={styles.startButtonText}>Start now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onFav(course)} style={styles.favRow}>
            <Feather
              name={isFav ? 'heart' : 'heart'}
              size={18}
              color={isFav ? theme.danger : '#ADB9D5'}
            />
            <Text style={styles.favText}>{isFav ? 'Favourited' : 'Add to favourite'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardLight,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 140,
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.muted,
  },
});
