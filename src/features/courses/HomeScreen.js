// src/features/courses/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Header from '../components/Header';
import global from '../theme/globalStyles';
import colors from '../theme/colors';
import useThemeColors from '../theme/useThemeColors';
import Feather from 'react-native-vector-icons/Feather';
import CourseCard from '../components/CourseCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, loadFavourites, toggleFavourite } from './courseSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, favourites, status } = useSelector((state) => state.courses);
  const user = useSelector(state => state.auth.user);
  const [query, setQuery] = useState('Search');
  const [selectedCategory, setSelectedCategory] = useState('Recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const { colors: theme } = useThemeColors();

  const username = user?.username || 'Student';
  const filterOptions = ['Recent', 'Programming', 'Mathematics','Engineering','Business','Architecture','Other'];

  useEffect(() => {
    dispatch(fetchCourses(query));
    dispatch(loadFavourites());
  }, [dispatch]);

  const onSearch = () => {
    dispatch(fetchCourses(query));
  };

  const onSelectCategory = (category) => {
    setSelectedCategory(category);

    if (category === 'Recent') {
      // Reuse current query results
      dispatch(fetchCourses(query));
      return;
    }

    let nextQuery = category.toLowerCase();
    if (category === 'Programming') {
      nextQuery = 'programming';
    } else if (category === 'Mathematics') {
      nextQuery = 'mathematics';
    }

    setQuery(nextQuery);
    dispatch(fetchCourses(nextQuery));
  };

  const onPressCourse = (course) => {
    navigation.navigate('CourseDetails', { course });
  };

  const onFav = (course) => dispatch(toggleFavourite(course));

  return (
    <View style={[global.container, { backgroundColor: theme.background }] }>
      <Header title="Home" />

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
            onSubmitEditing={onSearch}
          />
          <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
            <Feather name="arrow-right" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* category filter dropdown */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, { borderColor: theme.primary }]}
            activeOpacity={0.8}
            onPress={() => setFilterOpen(!filterOpen)}
          >
            <Text style={[styles.filterButtonText, { color: theme.text }]}>
              {selectedCategory}
            </Text>
            <Feather
              name={filterOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={theme.muted}
            />
          </TouchableOpacity>

          {filterOpen && (
            <View
              style={[
                styles.filterDropdown,
                { borderColor: theme.primary, backgroundColor: theme.cardLight },
              ]}
            >
              {filterOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.filterOption}
                  activeOpacity={0.8}
                  onPress={() => {
                    setFilterOpen(false);
                    onSelectCategory(option);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      option === selectedCategory
                        ? { color: theme.primary }
                        : { color: theme.text },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {status === 'loading' && (
          <ActivityIndicator
            style={{ marginTop: 12 }}
            size="large"
            color={theme.primary}
          />
        )}

        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={onPressCourse}
              onFav={onFav}
              isFav={!!favourites.find((f) => f.id === item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 14,
    paddingVertical: 4,
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
    paddingVertical: 10,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  searchButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  filterDropdown: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterOptionText: {
    fontSize: 13,
  },
});
