// src/features/courses/FavouritesScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import { toggleFavourite } from './courseSlice';

export default function FavouritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { favourites } = useSelector(state => state.courses);
  const [query, setQuery] = useState('');
  const { colors: theme } = useThemeColors();

  const filtered = useMemo(() => {
    if (!query) return favourites;
    const q = query.toLowerCase();
    return favourites.filter(c => String(c.title).toLowerCase().includes(q));
  }, [favourites, query]);

  const renderItem = ({ item }) => {
    const imageUri = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
      : 'https://via.placeholder.com/500x300.png?text=Course';

    const code = item.courseCode || item.id || 'CS101';
    const levelLine = item.levelLine || 'Level 1 - Computer Science - Core';

    const handleToggleFav = () => {
      dispatch(toggleFavourite(item));
    };

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CourseDetails', { course: item })}
      >
        <Image source={{ uri: imageUri }} style={styles.banner} resizeMode="cover" />

        <View style={[styles.infoCard, { backgroundColor: theme.cardLight, borderColor: theme.primary }] }>
          <View style={styles.infoHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.codeText, { color: theme.muted }]}>{code}</Text>
              <Text style={[styles.titleText, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.heartShell, { borderColor: theme.primary }] }
              activeOpacity={0.8}
              onPress={handleToggleFav}
            >
              <Feather name="heart" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.levelText, { color: theme.muted }]} numberOfLines={2}>
            {levelLine}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[global.container, { backgroundColor: theme.background }] }>
      <Header title="Favourite" leftOnPress={() => {}} />

      <View style={styles.wrapper}>
        {/* search bar */}
        <View style={[styles.searchWrap, { backgroundColor: theme.cardLight }] }>
          <Feather name="search" size={18} color={theme.muted} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={theme.muted}
            style={[styles.searchInput, { color: theme.text }]}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No favourites yet.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...global.pagePadding,
    paddingTop: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: 190,
    borderRadius: 16,
  },
  infoCard: {
    marginTop: 12,
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
  heartShell: {
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
  emptyWrap: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
  },
});
