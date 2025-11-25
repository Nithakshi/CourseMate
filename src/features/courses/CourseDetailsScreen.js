// src/features/courses/CourseDetailsScreen.js
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import { toggleFavourite } from './courseSlice';

export default function CourseDetailsScreen({ route, navigation }) {
  const { course } = route.params || {};
  const imageUri = course?.cover_i
    ? `https://covers.openlibrary.org/b/id/${course.cover_i}-L.jpg`
    : 'https://via.placeholder.com/500x300.png?text=Course';

  const dispatch = useDispatch();
  const favourites = useSelector(state => state.courses.favourites);
  const isFav = !!favourites.find(f => f.id === course?.id);
  const { colors: theme } = useThemeColors();

  const code = course?.courseCode || course?.id || 'CS101';

  // Line under the title. You can later replace this with real level/metadata
  // for each course; for now it uses a default similar to the mock.
  const levelLine = course?.levelLine || 'Level 1 - Computer Science - Core';

  const descriptionText =
    course?.description || 'No detailed description is available for this course yet.';

  const onToggleFav = () => {
    if (course) dispatch(toggleFavourite(course));
  };

  const onStart = () => {
    // For now we just show an alert; later you can navigate to lessons content
    // or a video player here.
    alert('Starting course: ' + course?.title);
  };

  return (
    <View style={[global.container, { backgroundColor: theme.background }] }>
      <Header title="Course Details" leftOnPress={() => navigation.goBack()} />

      <ScrollView
        style={global.pagePadding}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner image */}
        <Image source={{ uri: imageUri }} style={styles.banner} resizeMode="cover" />

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: theme.cardLight, borderColor: theme.primary }] }>
          <View style={styles.infoHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.codeText, { color: theme.muted }]}>{code}</Text>
              <Text style={[styles.titleText, { color: theme.text }]} numberOfLines={2}>
                {course?.title}
              </Text>
            </View>

            <TouchableOpacity onPress={onToggleFav} style={[styles.heartButton, { borderColor: theme.primary }] }>
              <Feather
                name={isFav ? 'heart' : 'heart'}
                size={20}
                color={isFav ? theme.danger : theme.primary}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.levelText, { color: theme.muted }]} numberOfLines={2}>
            {levelLine}
          </Text>
        </View>

        {/* Description card */}
        <View style={[styles.descriptionCard, { backgroundColor: theme.cardLight }] }>
          <Text style={[styles.descriptionTitle, { color: theme.primary }]}>Description</Text>
          <Text style={[styles.descriptionBody, { color: theme.text }]}>{descriptionText}</Text>
        </View>

        {/* Start button at bottom */}
        <TouchableOpacity onPress={onStart} style={[styles.startButton, { backgroundColor: theme.primary }] }>
          <Text style={styles.startButtonText}>Start now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  banner: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    marginTop: 12,
  },
  infoCard: {
    marginTop: 18,
    backgroundColor: colors.primaryLight,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  codeText: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#fff',
  },
  levelText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.muted,
  },
  descriptionCard: {
    marginTop: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 18,
    minHeight: 260,
  },
  descriptionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 14,
  },
  descriptionBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  startButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 26,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
